import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateBalance } = useAuth();
  const [addAmount, setAddAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddBalance = async (e) => {
    e.preventDefault();
    const amount = parseFloat(addAmount);

    if (isNaN(amount) || amount <= 0) {
      setMessage('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/users/balance/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });

      const data = await res.json();

      if (res.ok) {
        updateBalance(data.balance);
        setAddAmount('');
        setMessage(`Successfully added ৳${amount.toFixed(2)}`);
      } else {
        setMessage(data.error || 'Failed to add balance');
      }
    } catch (err) {
      setMessage('Failed to add balance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>My Profile</h1>
      </div>

      <div style={{ maxWidth: '600px' }}>
        <div className="order-card">
          <h2 style={{ marginBottom: '20px' }}>Account Information</h2>

          <div style={{ display: 'grid', gap: '15px' }}>
            <div>
              <strong>Name:</strong> {user?.name}
            </div>
            <div>
              <strong>Email:</strong> {user?.email}
            </div>
            {user?.studentId && (
              <div>
                <strong>Student ID:</strong> {user.studentId}
              </div>
            )}
            <div>
              <strong>Role:</strong> {user?.role === 'admin' ? 'Administrator' : 'Customer'}
            </div>
          </div>
        </div>

        <div className="order-card" style={{ marginTop: '20px' }}>
          <h2 style={{ marginBottom: '20px' }}>Balance Management</h2>

          <div style={{ marginBottom: '20px', padding: '20px', background: 'var(--background)', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '5px' }}>Current Balance</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary)' }}>
              ৳{user?.balance?.toFixed(2) || '0.00'}
            </div>
          </div>

          <form onSubmit={handleAddBalance}>
            <div className="form-group">
              <label>Add Balance (৳)</label>
              <input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                step="1"
              />
            </div>
            {message && (
              <div style={{
                padding: '10px',
                marginBottom: '15px',
                borderRadius: '6px',
                background: message.includes('Successfully') ? '#E8F5E9' : '#FFEBEE',
                color: message.includes('Successfully') ? 'var(--success)' : 'var(--error)'
              }}>
                {message}
              </div>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Processing...' : 'Add Balance'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}