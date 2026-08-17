import express from 'express';
import db from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, (req, res) => {
  const { items, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain items' });
  }

  let totalAmount = 0;
  const placeholders = items.map(() => '?').join(',');

  db.all(`SELECT * FROM menu_items WHERE id IN (${placeholders})`, items.map(i => i.id), (err, menuItems) => {
    if (err || menuItems.length === 0) {
      return res.status(400).json({ error: 'Invalid menu items' });
    }

    const itemMap = {};
    menuItems.forEach(item => itemMap[item.id] = item);

    items.forEach(item => {
      const menuItem = itemMap[item.id];
      if (menuItem) {
        totalAmount += menuItem.price * item.quantity;
      }
    });

    if (paymentMethod === 'balance') {
      db.get("SELECT balance FROM users WHERE id = ?", [req.user.id], (err, user) => {
        if (err || user.balance < totalAmount) {
          return res.status(400).json({ error: 'Insufficient balance' });
        }

        db.run("UPDATE users SET balance = balance - ? WHERE id = ?", [totalAmount, req.user.id], (err) => {
          if (err) return res.status(500).json({ error: 'Payment failed' });
          createOrder();
        });
      });
    } else {
      createOrder();
    }

    function generateToken() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let token = '';
      for (let i = 0; i < 6; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return token;
    }

    function createOrder() {
      const token = generateToken();
      const estimatedMinutes = 15;

      db.run(
        "INSERT INTO orders (userId, totalAmount, status, paymentMethod, paymentStatus, token, estimatedMinutes) VALUES (?, ?, 'pending', ?, ?, ?, ?)",
        [req.user.id, totalAmount, paymentMethod, paymentMethod === 'balance' ? 'paid' : 'unpaid', token, estimatedMinutes],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create order' });
          }

          const orderId = this.lastID;
          const orderItems = items.map(item => ({
            orderId,
            menuItemId: item.id,
            quantity: item.quantity,
            price: itemMap[item.id].price
          }));

          const stmt = db.prepare("INSERT INTO order_items (orderId, menuItemId, quantity, price) VALUES (?, ?, ?, ?)");
          orderItems.forEach(item => stmt.run(item.orderId, item.menuItemId, item.quantity, item.price));
          stmt.finalize();

          db.run(
            "INSERT INTO audit_logs (userId, action, details) VALUES (?, ?, ?)",
            [req.user.id, 'place_order', `Order #${orderId} placed for ৳${totalAmount} (Token: ${token})`]
          );

          res.status(201).json({
            orderId,
            totalAmount,
            status: 'pending',
            token,
            estimatedMinutes,
            message: 'Order placed successfully'
          });
        }
      );
    }
  });
});

router.get('/', authenticateToken, (req, res) => {
  const query = req.user.role === 'admin'
    ? `SELECT o.*, u.name as userName
       FROM orders o
       LEFT JOIN users u ON o.userId = u.id
       ORDER BY o.createdAt DESC`
    : `SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC`;

  const params = req.user.role === 'admin' ? [] : [req.user.id];

  db.all(query, params, (err, orders) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }

    if (req.user.role !== 'admin') {
      return res.json(orders);
    }

    const orderIds = orders.map(o => o.id);
    if (orderIds.length === 0) return res.json([]);

    const placeholders = orderIds.map(() => '?').join(',');
    db.all(
      `SELECT oi.*, mi.name as itemName
       FROM order_items oi
       LEFT JOIN menu_items mi ON oi.menuItemId = mi.id
       WHERE oi.orderId IN (${placeholders})`,
      orderIds,
      (err, orderItems) => {
        if (err) return res.json(orders);

        const itemsMap = {};
        orderItems.forEach(item => {
          if (!itemsMap[item.orderId]) itemsMap[item.orderId] = [];
          itemsMap[item.orderId].push(item);
        });

        orders.forEach(order => {
          order.items = itemsMap[order.id] || [];
        });

        res.json(orders);
      }
    );
  });
});

router.get('/:id', authenticateToken, (req, res) => {
  const query = req.user.role === 'admin'
    ? `SELECT o.*, u.name as userName, u.email as userEmail
       FROM orders o
       LEFT JOIN users u ON o.userId = u.id
       WHERE o.id = ?`
    : "SELECT * FROM orders WHERE id = ? AND userId = ?";

  const params = req.user.role === 'admin' ? [req.params.id] : [req.params.id, req.user.id];

  db.get(query, params, (err, order) => {
    if (err || !order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    db.all(
      `SELECT oi.*, mi.name as itemName, mi.imageUrl as itemImage
       FROM order_items oi
       LEFT JOIN menu_items mi ON oi.menuItemId = mi.id
       WHERE oi.orderId = ?`,
      [order.id],
      (err, items) => {
        order.items = items || [];
        res.json(order);
      }
    );
  });
});

router.put('/:id/status', authenticateToken, requireAdmin, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  db.run("UPDATE orders SET status = ? WHERE id = ?", [status, req.params.id], function(err) {
    if (err || this.changes === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: `Order status updated to ${status}` });
  });
});

router.post('/:id/pay', authenticateToken, (req, res) => {
  db.get("SELECT * FROM orders WHERE id = ? AND userId = ?", [req.params.id, req.user.id], (err, order) => {
    if (err || !order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ error: 'Order already paid' });
    }

    db.get("SELECT balance FROM users WHERE id = ?", [req.user.id], (err, user) => {
      if (err || user.balance < order.totalAmount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      db.run("UPDATE users SET balance = balance - ? WHERE id = ?", [order.totalAmount, req.user.id], (err) => {
        if (err) return res.status(500).json({ error: 'Payment failed' });

        db.run("UPDATE orders SET paymentStatus = 'paid' WHERE id = ?", [req.params.id], (err) => {
          res.json({ message: 'Payment successful', amountPaid: order.totalAmount });
        });
      });
    });
  });
});

export default router;