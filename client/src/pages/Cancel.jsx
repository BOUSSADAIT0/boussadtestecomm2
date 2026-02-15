import { Link } from 'react-router-dom';
import './Cancel.css';

function Cancel() {
  return (
    <div className="cancel-page">
      <div className="cancel-content glass">
        <div className="cancel-icon">❌</div>
        <h1>Paiement annulé</h1>
        <p>Votre paiement a été annulé. Aucun montant n'a été débité.</p>
        <p className="cancel-note">
          Vous pouvez continuer vos achats ou modifier votre panier.
        </p>
        <div className="cancel-actions">
          <Link to="/cart" className="back-cart-btn">
            Retour au panier
          </Link>
          <Link to="/" className="back-home-btn">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cancel;

