import express from 'express';
import db from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/balance', authenticateToken, (req, res) => {
  db.get("SELECT balance FROM users WHERE id = ?", [req.user.id], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ balance: user.balance });
  });
});

router.post('/balance/add', authenticateToken, (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Valid amount required' });
  }

  db.run("UPDATE users SET balance = balance + ? WHERE id = ?", [amount, req.user.id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to add balance' });
    }
    db.get("SELECT balance FROM users WHERE id = ?", [req.user.id], (err, user) => {
      res.json({ message: 'Balance added successfully', balance: user.balance });
    });
  });
});

router.get('/', authenticateToken, requireAdmin, (req, res) => {
  db.all("SELECT id, name, email, role, studentId, balance, createdAt FROM users ORDER BY createdAt DESC", [], (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.json(users);
  });
});

export default router;