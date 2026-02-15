import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './User.css';

function User() {
  const { user, login, register, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    if (isLogin) {
      result = await login(formData.email, formData.password);
    } else {
      result = await register(formData.email, formData.password, formData.name);
    }

    setLoading(false);

    if (result.success) {
      setFormData({ email: '', password: '', name: '' });
    } else {
      setError(result.error);
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="user-page">
        <div className="user-profile glass">
          <h1>Mon Profil</h1>
          
          <div className="profile-info">
            <div className="profile-field">
              <label>Nom</label>
              <p>{user.name || 'Non renseigné'}</p>
            </div>
            
            <div className="profile-field">
              <label>Email</label>
              <p>{user.email}</p>
            </div>
            
            <div className="profile-field">
              <label>Rôle</label>
              <p>{user.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}</p>
            </div>
            
            <div className="profile-field">
              <label>Membre depuis</label>
              <p>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>

          {user.role === 'ADMIN' && (
            <div style={{ marginBottom: '1rem' }}>
              <button 
                onClick={() => navigate('/admin')} 
                className="admin-btn"
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                🛍️ Accéder au Dashboard Admin
              </button>
            </div>
          )}

          <button onClick={logout} className="logout-btn">
            Se déconnecter
          </button>
        </div>

        <div className="user-orders glass">
          <h2>Mes Commandes</h2>
          <p className="coming-soon">Fonctionnalité à venir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page">
      <div className="auth-container glass">
        <div className="auth-tabs">
          <button
            className={isLogin ? 'active' : ''}
            onClick={() => {
              setIsLogin(true);
              setError('');
            }}
          >
            Connexion
          </button>
          <button
            className={!isLogin ? 'active' : ''}
            onClick={() => {
              setIsLogin(false);
              setError('');
            }}
          >
            Inscription
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Nom (optionnel)</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Votre nom"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="votre@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              minLength="6"
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Chargement...' : isLogin ? 'Se connecter' : 'S\'inscrire'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default User;

