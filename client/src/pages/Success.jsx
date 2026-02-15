import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useEffect } from 'react';
import './Success.css';

function Success() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Vider le panier après un paiement réussi
    clearCart();
  }, []);

  return (
    <div className="success-page">
      <div className="success-content glass">
        <div className="success-icon">✅</div>
        <h1>Paiement réussi !</h1>
        <p>Merci pour votre achat. Votre commande a été traitée avec succès.</p>
        <p className="success-note">
          Vous recevrez un email de confirmation sous peu.
        </p>
        <Link to="/" className="back-home-btn">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

export default Success;

