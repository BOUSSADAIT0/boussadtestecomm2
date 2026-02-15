import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/cart/:sessionId - Récupérer le panier d'une session
router.get('/:sessionId', async (req, res) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { sessionId: req.params.sessionId },
      include: { product: true }
    });

    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du panier' });
  }
});

// POST /api/cart - Ajouter un produit au panier
router.post('/', async (req, res) => {
  try {
    const { productId, quantity, sessionId } = req.body;

    if (!productId || !sessionId) {
      return res.status(400).json({ error: 'productId et sessionId sont requis' });
    }

    // Vérifier si le produit existe déjà dans le panier
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        productId_sessionId: {
          productId,
          sessionId
        }
      }
    });

    let cartItem;
    if (existingItem) {
      // Mettre à jour la quantité
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + (quantity || 1) },
        include: { product: true }
      });
    } else {
      // Créer un nouvel item
      cartItem = await prisma.cartItem.create({
        data: {
          productId,
          sessionId,
          quantity: quantity || 1
        },
        include: { product: true }
      });
    }

    res.json(cartItem);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout au panier' });
  }
});

// PUT /api/cart/:id - Mettre à jour la quantité d'un item
router.put('/:id', async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ error: 'La quantité doit être au moins 1' });
    }

    const cartItem = await prisma.cartItem.update({
      where: { id: req.params.id },
      data: { quantity },
      include: { product: true }
    });

    res.json(cartItem);
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du panier' });
  }
});

// DELETE /api/cart/:id - Supprimer un item du panier
router.delete('/:id', async (req, res) => {
  try {
    await prisma.cartItem.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Item supprimé du panier' });
  } catch (error) {
    console.error('Error deleting from cart:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du panier' });
  }
});

// DELETE /api/cart/clear/:sessionId - Vider le panier d'une session
router.delete('/clear/:sessionId', async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({
      where: { sessionId: req.params.sessionId }
    });

    res.json({ message: 'Panier vidé' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Erreur lors du vidage du panier' });
  }
});

export default router;

