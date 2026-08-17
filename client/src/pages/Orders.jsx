import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async (orderId, totalAmount) => {
    if (user.balance < totalAmount) {
      alert('Insufficient balance');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/orders/${orderId}/pay`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        alert('Payment successful!');
        fetchOrders();
      } else {
        const data = await res.json();
        alert(data.error || 'Payment failed');
      }
    } catch (err) {
      alert('Payment failed');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'var(--warning)';
      case 'preparing': return '#1976D2';
      case 'ready': return 'var(--success)';
      case 'completed': return '#616161';
      case 'cancelled': return 'var(--error)';
      default: return 'var(--text-light)';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return '⏳';
      case 'preparing': return '👨‍🍳';
      case 'ready': return '✅';
      case 'completed': return '✔️';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <h3>No orders yet</h3>
        <p>You haven't placed any orders yet.</p>
        <button className="btn btn-primary" onClick={() => window.location.href = '/menu'} style={{ marginTop: '20px' }}>
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>My Orders</h1>
      </div>

      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="order-id">Order #{order.id}</span>
                <span className={`order-status ${order.status}`}>
                  {getStatusIcon(order.status)} {order.status}
                </span>
                {order.token && (
                  <span style={{
                    padding: '4px 10px', background: '#FFF3E0',
                    borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700,
                    fontFamily: 'monospace', letterSpacing: '1px'
                  }}>
                    🎫 {order.token}
                  </span>
                )}
              </div>
              <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                {formatDate(order.createdAt)}
              </span>
            </div>

            {order.status !== 'cancelled' && order.status !== 'completed' && order.estimatedMinutes && (
              <div style={{
                marginBottom: '12px', padding: '10px 14px',
                background: '#E3F2FD', borderRadius: '8px',
                display: 'flex', alignItems: 'center', gap: '10px',
                fontSize: '0.9rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>⏱️</span>
                <span>Estimated preparation time: <strong>{order.estimatedMinutes} minutes</strong></span>
              </div>
            )}

            <div style={{
              marginBottom: '12px', height: '6px', background: 'var(--border)',
              borderRadius: '3px', overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: order.status === 'completed' || order.status === 'ready' ? '100%'
                  : order.status === 'preparing' ? '60%'
                  : order.status === 'pending' ? '20%' : '0%',
                background: getStatusColor(order.status),
                borderRadius: '3px',
                transition: 'width 0.5s ease'
              }} />
            </div>

            {order.items && order.items.length > 0 && (
              <div className="order-items-list">
                {order.items.map((item, idx) => (
                  <span key={idx} className="order-item">
                    {item.itemName} x{item.quantity}
                  </span>
                ))}
              </div>
            )}

            <div className="order-footer">
              <div>
                <span className="order-total">৳{order.totalAmount.toFixed(2)}</span>
                {order.paymentStatus === 'unpaid' && (
                  <span style={{ marginLeft: '15px', color: 'var(--error)', fontSize: '0.9rem', fontWeight: 600 }}>
                    Unpaid
                  </span>
                )}
                {order.paymentStatus === 'paid' && (
                  <span style={{ marginLeft: '15px', color: 'var(--success)', fontSize: '0.9rem', fontWeight: 600 }}>
                    Paid
                  </span>
                )}
              </div>
              {order.paymentStatus === 'unpaid' && (
                <button
                  className="btn btn-secondary"
                  onClick={() => handlePayNow(order.id, order.totalAmount)}
                >
                  Pay Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}