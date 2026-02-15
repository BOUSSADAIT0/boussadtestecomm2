import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './Dashboard.css';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
        console.error('Error response:', errorData);
        if (response.status === 401 || response.status === 403) {
          alert('Accès refusé. Vérifiez que vous êtes connecté en tant qu\'administrateur.');
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      alert('Erreur de connexion au serveur. Vérifiez que le serveur est démarré sur le port 5000.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Chargement des statistiques...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="error-container">
        <div className="error glass">
          <h2>⚠️ Erreur de chargement</h2>
          <p>Impossible de charger les statistiques du dashboard.</p>
          <p>Vérifiez que :</p>
          <ul>
            <li>Le serveur est démarré sur le port 5000</li>
            <li>Vous êtes connecté en tant qu'administrateur</li>
            <li>Votre token d'authentification est valide</li>
          </ul>
          <button onClick={fetchStats} className="retry-btn">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Tableau de bord</h1>
      <p className="welcome">Bienvenue, {user?.name || user?.email}</p>

      <div className="stats-grid">
        <div className="stat-card glass">
          <h3>Chiffre d'affaires</h3>
          <div className="stat-values">
            <div>
              <span className="stat-label">Aujourd'hui</span>
              <span className="stat-value">{stats.revenue.today.toFixed(2)} €</span>
            </div>
            <div>
              <span className="stat-label">Cette semaine</span>
              <span className="stat-value">{stats.revenue.thisWeek.toFixed(2)} €</span>
            </div>
            <div>
              <span className="stat-label">Ce mois</span>
              <span className="stat-value">{stats.revenue.thisMonth.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        <div className="stat-card glass">
          <h3>Commandes</h3>
          <div className="stat-values">
            <div>
              <span className="stat-label">Aujourd'hui</span>
              <span className="stat-value">{stats.orders.today}</span>
            </div>
            <div>
              <span className="stat-label">En attente</span>
              <span className="stat-value warning">{stats.orders.pending}</span>
            </div>
          </div>
        </div>

        <div className="stat-card glass">
          <h3>Produits</h3>
          <div className="stat-values">
            <div>
              <span className="stat-label">Total</span>
              <span className="stat-value">{stats.products.total}</span>
            </div>
            <div>
              <span className="stat-label">Stock faible</span>
              <span className="stat-value warning">{stats.products.lowStock.length}</span>
            </div>
          </div>
        </div>
      </div>

      {stats.products.lowStock.length > 0 && (
        <div className="alert-section glass">
          <h3>⚠️ Produits en stock faible</h3>
          <div className="low-stock-list">
            {stats.products.lowStock.map((product) => (
              <div key={product.id} className="low-stock-item">
                <span>{product.name}</span>
                <span className="stock-count">{product.stock} restants</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.topProducts.length > 0 && (
        <div className="top-products glass">
          <h3>🏆 Produits les plus vendus</h3>
          <div className="top-products-list">
            {stats.topProducts.map((product, index) => (
              <div key={product.id} className="top-product-item">
                <span className="rank">#{index + 1}</span>
                <img src={product.image} alt={product.name} />
                <div className="product-info">
                  <span className="product-name">{product.name}</span>
                  <span className="product-sold">{product.totalSold} vendus</span>
                </div>
                <span className="product-price">{product.price.toFixed(2)} €</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

