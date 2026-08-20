import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchMenu();
    fetchCategories();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu?available=1');
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      console.error('Failed to fetch menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/menu/categories');
      const data = await res.json();
      setCategories(['All', ...data]);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const filteredItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return <div className="loading">Loading menu...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Menu</h1>
      </div>

      <div className="menu-filters">
        {categories.map(category => (
          <button
            key={category}
            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="empty-state">
          <h3>No items found</h3>
          <p>No menu items available in this category.</p>
        </div>
      ) : (
        <div className="menu-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="menu-card">
              <img src={item.imageUrl || 'https://via.placeholder.com/300x180?text=No+Image'} alt={item.name} />
              <div className="menu-card-content">
                <h3>{item.name}</h3>
                <p className="description">{item.description}</p>
                <div className="menu-card-footer">
                  <span className="price">৳{item.price}</span>
                  <button className="add-btn" onClick={() => addToCart(item)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}