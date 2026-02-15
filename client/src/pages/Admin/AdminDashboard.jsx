import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProductsManagement from './components/ProductsManagement';
import OrdersManagement from './components/OrdersManagement';
import UsersManagement from './components/UsersManagement';
import './AdminDashboard.css';

function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div style={{ padding: '2rem', color: '#fff', textAlign: 'center' }}>
        <h2>⛔ Accès refusé</h2>
        <p>Vous devez être connecté en tant qu'administrateur pour accéder à cette page.</p>
        <p>État actuel :</p>
        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
          <li>Authentifié : {isAuthenticated ? '✅ Oui' : '❌ Non'}</li>
          <li>Rôle : {user?.role || 'Non défini'}</li>
          <li>Email : {user?.email || 'Non défini'}</li>
        </ul>
        <button onClick={() => navigate('/user')} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#667eea', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Aller à la page de connexion
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar glass">
        <div className="sidebar-header">
          <h2>🛍️ Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Tableau de bord
          </button>
          <button
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            📦 Produits
          </button>
          <button
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            🛒 Commandes
          </button>
          <button
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            👥 Utilisateurs
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="admin-info">
            <p className="admin-email">{user?.email}</p>
            <p className="admin-role">👑 Administrateur</p>
          </div>
          <button onClick={() => navigate('/')} className="back-to-site-btn">
            ← Voir le site client
          </button>
        </div>
      </aside>

      <main className="admin-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'products' && <ProductsManagement />}
        {activeTab === 'orders' && <OrdersManagement />}
        {activeTab === 'users' && <UsersManagement />}
      </main>
    </div>
  );
}

export default AdminDashboard;

