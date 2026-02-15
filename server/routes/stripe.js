import express from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Initialiser Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware pour parser le body brut (nécessaire pour les webhooks Stripe)
const rawBodyMiddleware = express.raw({ type: 'application/json' });

// POST /api/stripe/create-checkout-session - Créer une session de paiement Stripe
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { sessionId, userId, shippingAddress } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId est requis' });
    }

    // Récupérer les items du panier
    const cartItems = await prisma.cartItem.findMany({
      where: { sessionId },
      include: { product: true }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Le panier est vide' });
    }

    // Préparer les line items pour Stripe
    const lineItems = cartItems.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.product.name,
          description: item.product.description,
          images: [item.product.image]
        },
        unit_amount: Math.round(item.product.price * 100) // Convertir en centimes
      },
      quantity: item.quantity
    }));

    // Calculer le total
    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    // Créer la session Stripe Checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: process.env.STRIPE_CANCEL_URL,
      metadata: {
        sessionId: sessionId,
        userId: userId || '',
        shippingAddress: shippingAddress || ''
      }
    });

    res.json({ 
      sessionId: checkoutSession.id,
      url: checkoutSession.url 
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la session de paiement' });
  }
});

// POST /api/stripe/webhook - Webhook Stripe pour créer une commande après paiement
router.post('/webhook', rawBodyMiddleware, async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gérer l'événement checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const { sessionId, userId, shippingAddress } = session.metadata;

      // Récupérer les items du panier
      const cartItems = await prisma.cartItem.findMany({
        where: { sessionId },
        include: { product: true }
      });

      if (cartItems.length > 0) {
        // Calculer le total
        const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

        // Créer la commande
        const order = await prisma.order.create({
          data: {
            userId: userId || null,
            sessionId,
            total,
            shippingAddress: shippingAddress || null,
            paymentIntentId: session.payment_intent,
            status: 'PAID',
            items: {
              create: cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price
              }))
            }
          }
        });

        // Vider le panier
        await prisma.cartItem.deleteMany({
          where: { sessionId }
        });

        console.log('Order created:', order.id);
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
    }
  }

  res.json({ received: true });
});

export default router;

