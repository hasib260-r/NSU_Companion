import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    available: true
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      if (activeTab === 'overview') {
        const [statsRes, weeklyRes] = await Promise.all([
          fetch('/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/admin/revenue-weekly', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);
        if (statsRes.ok) setStats(await statsRes.json());
      } else if (activeTab === 'orders') {
        const res = await fetch('/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setOrders(data);
      } else if (activeTab === 'menu') {
        const res = await fetch('/api/menu');
        const data = await res.json();
        setMenuItems(data);
      } else if (activeTab === 'users') {
        const res = await fetch('/api/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setUsers(data);
      } else if (activeTab === 'audit') {
        const res = await fetch('/api/admin/audit-logs', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setAuditLogs(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      fetchData();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ name: '', description: '', price: '', category: '', imageUrl: '', available: true });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl || '',
      available: item.available === 1
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = editingItem ? `/api/menu/${editingItem.id}` : '/api/menu';
    const method = editingItem ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error('Failed to save item:', err);
    }
  };

  const deleteItem = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-BD', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="page-header">
        <h1>Admin Panel</h1>
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          Overview
        </button>
        <button className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          Orders
        </button>
        <button className={`admin-tab ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>
          Menu Items
        </button>
        <button className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          Users
        </button>
        <button className={`admin-tab ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>
          Audit Logs
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          {activeTab === 'overview' && stats && (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '15px', marginBottom: '30px'
              }}>
                {[
                  { label: 'Total Users', value: stats.totalUsers, color: 'var(--secondary)' },
                  { label: 'Students', value: stats.studentCount, color: '#1976D2' },
                  { label: 'Vendors', value: stats.vendorCount, color: 'var(--warning)' },
                  { label: 'Menu Items', value: stats.totalMenuItems, color: 'var(--primary)' },
                  { label: 'Total Orders', value: stats.totalOrders, color: 'var(--success)' },
                  { label: 'Pending Orders', value: stats.pendingOrders, color: '#FF9800' },
                  { label: 'Today\'s Orders', value: stats.todayOrders, color: '#9C27B0' },
                  { label: 'Total Revenue', value: `৳${stats.totalRevenue?.toFixed(0)}`, color: '#2E7D32' },
                  { label: 'Student Balance', value: `৳${stats.totalStudentBalance?.toFixed(0)}`, color: '#00695C' },
                ].map((card, i) => (
                  <div key={i} style={{
                    background: 'white', borderRadius: '12px', padding: '20px',
                    borderTop: `4px solid ${card.color}`, boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {card.label}
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 700, color: card.color }}>
                      {card.value}
                    </div>
                  </div>
                ))}
              </div>

              {stats.categoryDistribution && stats.categoryDistribution.length > 0 && (
                <div className="order-card" style={{ marginBottom: '20px' }}>
                  <h3 style={{ marginBottom: '15px' }}>Menu Category Distribution</h3>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    {stats.categoryDistribution.map((cat, i) => (
                      <div key={i} style={{
                        padding: '12px 20px', background: 'var(--background)',
                        borderRadius: '8px', textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '4px' }}>{cat.category}</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)' }}>{cat.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {stats.orderStatusDistribution && stats.orderStatusDistribution.length > 0 && (
                <div className="order-card">
                  <h3 style={{ marginBottom: '15px' }}>Order Status Distribution</h3>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    {stats.orderStatusDistribution.map((s, i) => (
                      <div key={i} style={{
                        padding: '12px 20px', background: 'var(--background)',
                        borderRadius: '8px', textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '4px', textTransform: 'capitalize' }}>{s.status}</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)' }}>{s.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Token</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan="9" style={{ textAlign: 'center' }}>No orders found</td></tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.userName || `User #${order.userId}`}</td>
                      <td>{order.token ? <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{order.token}</span> : '-'}</td>
                      <td>{order.items?.length || 0} items</td>
                      <td>৳{order.totalAmount}</td>
                      <td>
                        <select
                          className="status-select"
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <span style={{
                          color: order.paymentStatus === 'paid' ? 'var(--success)' : 'var(--error)',
                          fontWeight: 600
                        }}>
                          {order.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>
                        {order.items?.map((item, i) => (
                          <div key={i} style={{ fontSize: '0.8rem' }}>{item.itemName} x{item.quantity}</div>
                        ))}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'menu' && (
            <>
              <button className="btn btn-primary" onClick={openAddModal} style={{ marginBottom: '20px' }}>
                Add New Item
              </button>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Available</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>৳{item.price}</td>
                      <td>{item.available ? 'Yes' : 'No'}</td>
                      <td>
                        <button className="btn btn-secondary" onClick={() => openEditModal(item)} style={{ marginRight: '10px' }}>
                          Edit
                        </button>
                        <button className="btn btn-outline" onClick={() => deleteItem(item.id)} style={{ color: 'var(--error)', borderColor: 'var(--error)' }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {activeTab === 'users' && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Student ID</th>
                  <th>Role</th>
                  <th>Balance</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.studentId || '-'}</td>
                    <td>
                      <span style={{
                        padding: '3px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 600,
                        background: u.role === 'admin' ? '#FFEBEE' : u.role === 'vendor' ? '#FFF3E0' : '#E8F5E9',
                        color: u.role === 'admin' ? 'var(--error)' : u.role === 'vendor' ? 'var(--warning)' : 'var(--success)',
                        textTransform: 'capitalize'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td>৳{u.balance?.toFixed(2)}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                      {u.createdAt ? formatDate(u.createdAt) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'audit' && (
            <div className="orders-list">
              {auditLogs.length === 0 ? (
                <div className="empty-state">
                  <h3>No audit logs yet</h3>
                  <p>System activity will be recorded here.</p>
                </div>
              ) : (
                auditLogs.map(log => (
                  <div key={log.id} className="order-card" style={{ padding: '15px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{log.action}</span>
                        {log.details && (
                          <span style={{ marginLeft: '10px', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                            — {log.details}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                        {log.userName && <span style={{ marginRight: '10px' }}>by {log.userName}</span>}
                        {formatDate(log.createdAt)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="3" />
              </div>
              <div className="form-group">
                <label>Price (৳)</label>
                <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required>
                  <option value="">Select category</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Fast Food">Fast Food</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input type="url" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://..." />
              </div>
              <div className="form-group">
                <label>
                  <input type="checkbox" checked={formData.available} onChange={(e) => setFormData({ ...formData, available: e.target.checked })} />
                  {' '}Available
                </label>
              </div>
              <button type="submit" className="btn btn-primary">{editingItem ? 'Update' : 'Add'}</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)} style={{ marginLeft: '10px' }}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
