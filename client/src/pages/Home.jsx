import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate(user.role === 'admin' ? '/admin' : user.role === 'vendor' ? '/vendor' : '/menu');
  }

  const features = [
    { icon: '🍔', title: 'Real-time Menu', desc: 'Dynamic pricing and live item availability' },
    { icon: '💳', title: 'Secure Payments', desc: 'Balance, Cash on Delivery & SSLCommerz/bKash' },
    { icon: '🔔', title: 'Push Notifications', desc: 'Real-time order status updates' },
    { icon: '📍', title: 'Order Tracking', desc: 'Live preparation status with countdown timers' },
    { icon: '🎫', title: 'Order Tokens', desc: 'Secure pickup identification system' },
    { icon: '📊', title: 'Vendor Dashboard', desc: 'Analytics, order management, menu control' },
    { icon: '🛡️', title: 'Admin Panel', desc: 'System configuration, user management, audit logs' },
    { icon: '📱', title: 'Mobile Responsive', desc: 'Seamless experience across all devices' },
  ];

  return (
    <div>
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--primary) 0%, #B02A63 50%, var(--secondary) 100%)',
        color: 'white',
        textAlign: 'center',
        padding: '40px 20px'
      }}>
        <div style={{ maxWidth: '800px' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, marginBottom: '20px', lineHeight: 1.1 }}>
            NSU <span style={{ color: '#FFD700' }}>Companion</span>
          </h1>
          <p style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', opacity: 0.95, marginBottom: '15px', fontWeight: 500 }}>
            Smart Cafeteria & Pre-Ordering System
          </p>
          <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', opacity: 0.8, marginBottom: '40px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            Eliminating queues. Empowering campuses.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              padding: '14px 36px', background: '#FFD700', color: '#1E3A5F',
              borderRadius: '50px', fontWeight: 700, fontSize: '1.05rem',
              textDecoration: 'none', transition: 'transform 0.2s'
            }}>
              Get Started
            </Link>
            <Link to="/login" style={{
              padding: '14px 36px', background: 'rgba(255,255,255,0.15)', color: 'white',
              borderRadius: '50px', fontWeight: 600, fontSize: '1.05rem',
              textDecoration: 'none', border: '2px solid rgba(255,255,255,0.3)', transition: 'transform 0.2s'
            }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 20px', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '15px', color: 'var(--text)' }}>
            Everything You Need
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '50px', fontSize: '1.1rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            A comprehensive digital ecosystem connecting students, vendors, and administrators
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '25px'
          }}>
            {features.map((f, i) => (
              <div key={i} style={{
                padding: '30px', borderRadius: '16px', background: 'var(--background)',
                textAlign: 'center', transition: 'transform 0.2s, box-shadow 0.2s'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{f.icon}</div>
                <h3 style={{ marginBottom: '8px', fontSize: '1.15rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 20px', background: 'var(--background)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '15px', color: 'var(--text)' }}>
            Meet Our Team
          </h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '50px' }}>
            CSE327 Software Engineering Project — Fall 2026
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '30px'
          }}>
            {[
              { name: 'Mohammad Mansib Newaz', id: '1931842642', role: 'Project Coordinator', emoji: '👑' },
              { name: 'Faroque Hossain Rumi', id: '1931451942', role: 'Tech Lead', emoji: '⚡' },
              { name: 'Mohammad Hasibur Rahman', id: '2132403642', role: 'Operations Lead', emoji: '🎨' },
            ].map((member, i) => (
              <div key={i} style={{
                padding: '35px 20px', borderRadius: '16px', background: 'white',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)'
              }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'var(--primary)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', margin: '0 auto 20px'
                }}>
                  {member.emoji}
                </div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>{member.name}</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '4px' }}>{member.id}</p>
                <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{
        padding: '60px 20px',
        background: 'linear-gradient(135deg, var(--secondary) 0%, #0F2440 100%)',
        color: 'white', textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '15px' }}>Ready to Get Started?</h2>
          <p style={{ opacity: 0.8, marginBottom: '30px' }}>
            Join NSU Companion today and skip the queues.
          </p>
          <Link to="/register" style={{
            padding: '14px 40px', background: 'var(--primary)', color: 'white',
            borderRadius: '50px', fontWeight: 700, fontSize: '1.05rem',
            textDecoration: 'none', display: 'inline-block'
          }}>
            Create Free Account
          </Link>
          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', fontSize: '0.85rem', opacity: 0.6 }}>
            <span>North South University</span>
            <span>CSE327 — Fall 2026</span>
            <span>MIT License</span>
          </div>
        </div>
      </section>
    </div>
  );
}
