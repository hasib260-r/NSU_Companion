import express from 'express';
import db from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', (req, res) => {
  const { category, available } = req.query;

  let query = "SELECT * FROM menu_items WHERE 1=1";
  const params = [];

  if (category) {
    query += " AND category = ?";
    params.push(category);
  }

  if (available !== undefined) {
    query += " AND available = ?";
    params.push(available === 'true' ? 1 : 0);
  }

  query += " ORDER BY category, name";

  db.all(query, params, (err, items) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch menu items' });
    }
    res.json(items);
  });
});

router.get('/categories', (req, res) => {
  db.all("SELECT DISTINCT category FROM menu_items ORDER BY category", [], (err, categories) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch categories' });
    }
    res.json(categories.map(c => c.category));
  });
});

router.get('/:id', (req, res) => {
  db.get("SELECT * FROM menu_items WHERE id = ?", [req.params.id], (err, item) => {
    if (err || !item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(item);
  });
});

router.post('/', authenticateToken, requireAdmin, (req, res) => {
  const { name, description, price, category, imageUrl } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Name, price, and category are required' });
  }

  db.run(
    "INSERT INTO menu_items (name, description, price, category, imageUrl) VALUES (?, ?, ?, ?, ?)",
    [name, description, price, category, imageUrl || null],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to add menu item' });
      }
      res.status(201).json({ id: this.lastID, name, description, price, category, imageUrl });
    }
  );
});

router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  const { name, description, price, category, imageUrl, available } = req.body;

  db.run(
    "UPDATE menu_items SET name = ?, description = ?, price = ?, category = ?, imageUrl = ?, available = ? WHERE id = ?",
    [name, description, price, category, imageUrl, available !== undefined ? (available ? 1 : 0) : 1, req.params.id],
    function(err) {
      if (err || this.changes === 0) {
        return res.status(404).json({ error: 'Menu item not found' });
      }
      res.json({ message: 'Menu item updated successfully' });
    }
  );
});

router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  db.run("DELETE FROM menu_items WHERE id = ?", [req.params.id], function(err) {
    if (err || this.changes === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  });
});

export default router;