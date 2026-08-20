import express from 'express';
import db from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/orders', (req, res) => {
  if (req.user.role !== 'vendor' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Vendor access required' });
  }

  const { status } = req.query;
  let query = `SELECT o.*, u.name as userName FROM orders o LEFT JOIN users u ON o.userId = u.id`;
  const params = [];

  if (status) {
    query += ` WHERE o.status = ?`;
    params.push(status);
  }

  query += ` ORDER BY o.createdAt DESC`;

  db.all(query, params, (err, orders) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch orders' });

    if (orders.length === 0) return res.json([]);

    const orderIds = orders.map(o => o.id);
    const placeholders = orderIds.map(() => '?').join(',');
    db.all(
      `SELECT oi.*, mi.name as itemName FROM order_items oi LEFT JOIN menu_items mi ON oi.menuItemId = mi.id WHERE oi.orderId IN (${placeholders})`,
      orderIds,
      (err, items) => {
        const itemsMap = {};
        items.forEach(item => {
          if (!itemsMap[item.orderId]) itemsMap[item.orderId] = [];
          itemsMap[item.orderId].push(item);
        });
        orders.forEach(order => { order.items = itemsMap[order.id] || []; });
        res.json(orders);
      }
    );
  });
});

router.put('/orders/:id/status', (req, res) => {
  if (req.user.role !== 'vendor' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Vendor access required' });
  }

  const { status, estimatedMinutes } = req.body;
  const validStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const updateFields = ['status'];
  const updateValues = [status];

  if (estimatedMinutes) {
    updateFields.push('estimatedMinutes');
    updateValues.push(estimatedMinutes);
  }

  updateValues.push(req.params.id);

  db.run(
    `UPDATE orders SET ${updateFields.map(f => `${f} = ?`).join(', ')} WHERE id = ?`,
    updateValues,
    function(err) {
      if (err || this.changes === 0) return res.status(404).json({ error: 'Order not found' });
      db.run(
        "INSERT INTO audit_logs (userId, action, details) VALUES (?, ?, ?)",
        [req.user.id, 'update_order_status', `Order #${req.params.id} → ${status}`]
      );
      res.json({ message: `Order status updated to ${status}` });
    }
  );
});

router.get('/stats', (req, res) => {
  if (req.user.role !== 'vendor' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Vendor access required' });
  }

  const stats = {};

  db.get("SELECT COUNT(*) as total, COALESCE(SUM(totalAmount), 0) as revenue FROM orders", [], (err, row) => {
    stats.totalOrders = row.total;
    stats.totalRevenue = row.revenue;

    db.get("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'", [], (err, row) => {
      stats.pendingOrders = row.count;

      db.get("SELECT COUNT(*) as count FROM orders WHERE status = 'preparing'", [], (err, row) => {
        stats.preparingOrders = row.count;

        db.get("SELECT COUNT(*) as count FROM orders WHERE status = 'ready'", [], (err, row) => {
          stats.readyOrders = row.count;

          db.get("SELECT COUNT(*) as count FROM orders WHERE status = 'completed'", [], (err, row) => {
            stats.completedOrders = row.count;

            db.get("SELECT COUNT(*) as count FROM orders WHERE DATE(createdAt) = DATE('now')", [], (err, row) => {
              stats.todayOrders = row.count;

              db.get("SELECT COALESCE(SUM(totalAmount), 0) as amount FROM orders WHERE DATE(createdAt) = DATE('now')", [], (err, row) => {
                stats.todayRevenue = row.amount;

                db.get("SELECT COUNT(*) as count FROM orders WHERE DATE(createdAt) = DATE('now') AND status IN ('pending', 'preparing')", [], (err, row) => {
                  stats.activeOrders = row.count;
                  res.json(stats);
                });
              });
            });
          });
        });
      });
    });
  });
});

export default router;
