import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const [paymentMethod, setPaymentMethod] = useState('balance');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const total = getCartTotal();

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'balance' && user.balance < total) {
      setError('Insufficient balance. Please add funds or choose another payment method.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart.map(item => ({ id: item.id, quantity: item.quantity })),
          paymentMethod
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="empty-state">
        <h3>Your cart is empty</h3>
        <p>Add some delicious items from our menu!</p>
        <button className="btn btn-primary" onClick={() => navigate('/menu')} style={{ marginTop: '20px' }}>
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-items">
        <h2>Cart Items</h2>
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.imageUrl || 'https://via.placeholder.com/80'} alt={item.name} />
            <div className="cart-item-details">
              <h4>{item.name}</h4>
              <span className="price">৳{item.price}</span>
            </div>
            <div className="quantity-controls">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              style={{ marginLeft: '15px', color: 'var(--error)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              x
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2>Order Summary</h2>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>৳{total.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Tax (0%)</span>
          <span>৳0.00</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>৳{total.toFixed(2)}</span>
        </div>

        <div className="payment-methods">
          <h3 style={{ marginBottom: '15px' }}>Payment Method</h3>
          <div
            className={`payment-option ${paymentMethod === 'balance' ? 'selected' : ''}`}
            onClick={() => setPaymentMethod('balance')}
          >
            <input type="radio" checked={paymentMethod === 'balance'} readOnly />
            <span>Pay with Balance (৳{user?.balance?.toFixed(2) || 0} available)</span>
          </div>
          <div
            className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`}
            onClick={() => setPaymentMethod('cash')}
          >
            <input type="radio" checked={paymentMethod === 'cash'} readOnly />
            <span>Cash on Delivery</span>
          </div>
        </div>

        {error && <div style={{ color: 'var(--error)', marginBottom: '15px' }}>{error}</div>}

        <button
          className="btn btn-primary"
          onClick={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}