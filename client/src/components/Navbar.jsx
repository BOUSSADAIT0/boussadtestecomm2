import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar({ onSearch }) {
  const { cartItems } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="navbar glass">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🛍️</span>
          <span className="logo-text">E-Commerce</span>
        </Link>
        
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">🔍</button>
        </form>
        
        <div className="navbar-actions">
          {/* Cacher le panier pour les admins */}
          {!(isAuthenticated && user?.role === 'ADMIN') && (
            <Link to="/cart" className="navbar-cart">
              <span className="cart-icon">🛒</span>
              <span className="cart-text">Panier</span>
              {itemCount > 0 && (
                <span className="cart-badge">{itemCount}</span>
              )}
            </Link>
          )}
          
          {isAuthenticated && user?.role === 'ADMIN' && (
            <Link to="/admin" className="navbar-admin">
              <span className="admin-icon">🛍️</span>
              <span className="admin-text">Admin</span>
            </Link>
          )}
          
          <Link to="/user" className="navbar-user">
            <span className="user-icon">👤</span>
            <span className="user-text">
              {isAuthenticated ? (user?.name || user?.email?.split('@')[0]) : 'Connexion'}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

