import { useState, useEffect } from 'react';

export default function VendorDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchOrders();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/vendor/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setStats(await res.json());
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/vendor/orders`, {
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

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/vendor/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      fetchOrders();
      fetchStats();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const statCards = stats ? [
    { label: 'Total Orders', value: stats.totalOrders, color: 'var(--secondary)' },
    { label: 'Today\'s Orders', value: stats.todayOrders, color: '#1976D2' },
    { label: 'Active Orders', value: stats.activeOrders, color: 'var(--warning)' },
    { label: 'Total Revenue', value: `৳${stats.totalRevenue?.toFixed(0) || 0}`, color: 'var(--success)' },
    { label: 'Today Revenue', value: `৳${stats.todayRevenue?.toFixed(0) || 0}`, color: 'var(--primary)' },
    { label: 'Ready Pickup', value: stats.readyOrders, color: '#4CAF50' },
  ] : [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-BD', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="page-header">
        <h1>Vendor Dashboard</h1>
      </div>

      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '15px', marginBottom: '30px'
        }}>
          {statCards.map((card, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: '12px', padding: '20px',
              borderTop: `4px solid ${card.color}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {card.label}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: card.color }}>
                {card.value}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="admin-tabs" style={{ marginBottom: '20px' }}>
        {['all', 'pending', 'preparing', 'ready', 'completed', 'cancelled'].map(s => (
          <button
            key={s}
            className={`admin-tab ${filter === s ? 'active' : ''}`}
            onClick={() => setFilter(s)}
            style={{ textTransform: 'capitalize' }}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="empty-state">
          <h3>No {filter} orders</h3>
          <p>Orders will appear here when customers place them.</p>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <span className="order-id">Order #{order.id}</span>
                  {order.token && (
                    <span style={{
                      marginLeft: '12px', padding: '4px 10px', background: '#FFF3E0',
                      borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700,
                      fontFamily: 'monospace', letterSpacing: '1px'
                    }}>
                      🎫 {order.token}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span className={`order-status ${order.status}`}>{order.status}</span>
                  <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                    {formatDate(order.createdAt)}
                  </span>
                </div>
              </div>

              <div style={{ marginBottom: '12px', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                <strong>Customer:</strong> {order.userName || `User #${order.userId}`}
              </div>

              <div className="order-items-list" style={{ marginBottom: '12px' }}>
                {order.items?.map((item, idx) => (
                  <span key={idx} className="order-item">
                    {item.itemName} x{item.quantity}
                  </span>
                ))}
              </div>

              <div className="order-footer">
                <span className="order-total">৳{order.totalAmount}</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {order.paymentStatus === 'unpaid' && (
                    <span style={{ color: 'var(--error)', fontSize: '0.85rem', fontWeight: 600 }}>Unpaid</span>
                  )}
                  <select
                    className="status-select"
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    style={{ padding: '8px 14px', fontWeight: 600 }}
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
