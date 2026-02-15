import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import './OrdersManagement.css';

function OrdersManagement() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = statusFilter
        ? `/api/admin/orders?status=${statusFilter}`
        : '/api/admin/orders';
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        await fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#f59e0b',
      PAID: '#10b981',
      SHIPPED: '#3b82f6',
      DELIVERED: '#8b5cf6',
      CANCELLED: '#ef4444'
    };
    return colors[status] || '#fff';
  };

  const getStatusLabel = (status) => {
    const labels = {
      PENDING: 'En attente',
      PAID: 'Payé',
      SHIPPED: 'Expédié',
      DELIVERED: 'Livré',
      CANCELLED: 'Annulé'
    };
    return labels[status] || status;
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="orders-management">
      <div className="header-actions">
        <h1>Gestion des commandes</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Tous les statuts</option>
          <option value="PENDING">En attente</option>
          <option value="PAID">Payé</option>
          <option value="SHIPPED">Expédié</option>
          <option value="DELIVERED">Livré</option>
          <option value="CANCELLED">Annulé</option>
        </select>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card glass">
            <div className="order-header">
              <div>
                <h3>Commande #{order.id.slice(0, 8)}</h3>
                <p className="order-date">
                  {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="order-status">
                <span
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {getStatusLabel(order.status)}
                </span>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="status-select"
                >
                  <option value="PENDING">En attente</option>
                  <option value="PAID">Payé</option>
                  <option value="SHIPPED">Expédié</option>
                  <option value="DELIVERED">Livré</option>
                  <option value="CANCELLED">Annulé</option>
                </select>
              </div>
            </div>

            <div className="order-info">
              <div>
                <strong>Client:</strong>{' '}
                {order.user
                  ? `${order.user.name || order.user.email}`
                  : `Session: ${order.sessionId.slice(0, 8)}`}
              </div>
              {order.shippingAddress && (
                <div>
                  <strong>Adresse:</strong> {order.shippingAddress}
                </div>
              )}
            </div>

            <div className="order-items">
              <h4>Produits:</h4>
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <img src={item.product.image} alt={item.product.name} />
                  <div className="item-info">
                    <span className="item-name">{item.product.name}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                  </div>
                  <span className="item-price">
                    {(item.price * item.quantity).toFixed(2)} €
                  </span>
                </div>
              ))}
            </div>

            <div className="order-total">
              <strong>Total: {order.total.toFixed(2)} €</strong>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="no-orders">
            <p>Aucune commande trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersManagement;

