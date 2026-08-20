import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/menu');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p>Sign in to continue to NSU Cafeteria</p>

        <form onSubmit={handleSubmit}>
          {error && <div className="error" style={{ color: 'var(--error)', marginBottom: '20px', textAlign: 'center' }}>{error}</div>}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@northsouth.edu"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-links">
          <p className="auth-link">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>

        <div style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px', fontSize: '0.85rem' }}>
          <strong>Demo Accounts:</strong><br />
          Admin: admin@nsu.edu / admin123<br />
          Vendor: vendor@nsu.edu / vendor123<br />
          Student: student@nsu.edu / student123
        </div>
      </div>
    </div>
  );
}