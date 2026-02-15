import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getTotal, sessionId } = useCart();
  const { user } = useAuth();

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          sessionId,
          userId: user?.id || null,
          shippingAddress: '' // Peut être amélioré avec un formulaire
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Rediriger vers Stripe Checkout
        window.location.href = data.url;
      } else {
        alert('Erreur lors de la création de la session de paiement');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Erreur lors de la création de la session de paiement');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-content glass">
          <h2>Votre panier est vide</h2>
          <p>Ajoutez des produits pour commencer vos achats</p>
        </div>
      </div>
    );
  }

  const total = getTotal();

  return (
    <div className="cart">
      <h1 className="cart-title">Mon Panier</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item glass glass-hover">
              <div className="cart-item-image">
                <img src={item.product.image} alt={item.product.name} />
              </div>
              <div className="cart-item-info">
                <h3>{item.product.name}</h3>
                <p className="cart-item-price">{item.product.price.toFixed(2)} €</p>
              </div>
              <div className="cart-item-controls">
                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="quantity-btn"
                  >
                    −
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="remove-btn"
                >
                  🗑️
                </button>
              </div>
              <div className="cart-item-total">
                {(item.product.price * item.quantity).toFixed(2)} €
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary glass">
          <h2>Résumé</h2>
          <div className="summary-line">
            <span>Sous-total</span>
            <span>{total.toFixed(2)} €</span>
          </div>
          <div className="summary-line">
            <span>Frais de livraison</span>
            <span>Gratuit</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>{total.toFixed(2)} €</span>
          </div>
          <button onClick={handleCheckout} className="checkout-btn">
            Payer avec Stripe
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;

