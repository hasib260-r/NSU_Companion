import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/menu" className="navbar-brand">NSU <span style={{ color: 'var(--primary)' }}>Companion</span></Link>
      <div className="navbar-links">
        <Link to="/menu" className="nav-link">Menu</Link>
        <Link to="/cart" className="nav-link cart">
          Cart
          {getCartCount() > 0 && (
            <span className="cart-badge">{getCartCount()}</span>
          )}
        </Link>
        <Link to="/orders" className="nav-link">Orders</Link>
        {user?.role === 'vendor' && (
          <Link to="/vendor" className="nav-link">Dashboard</Link>
        )}
        {user?.role === 'admin' && (
          <Link to="/admin" className="nav-link">Admin</Link>
        )}
        <Link to="/profile" className="nav-link">
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            👤 {user?.name?.split(' ')[0]}
          </span>
        </Link>
        {user?.role === 'customer' && (
          <span className="balance">৳{user?.balance?.toFixed(2) || 0}</span>
        )}
        <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: '8px 18px', fontSize: '0.9rem' }}>
          Logout
        </button>
      </div>
    </nav>
  );
}
