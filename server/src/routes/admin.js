import express from 'express';
import db from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken, requireAdmin);

router.get('/stats', (req, res) => {
  const stats = {};

  db.get("SELECT COUNT(*) as totalUsers FROM users", [], (err, row) => {
    stats.totalUsers = row.totalUsers;

    db.get("SELECT COUNT(*) as totalMenuItems FROM menu_items", [], (err, row) => {
      stats.totalMenuItems = row.totalMenuItems;

      db.get("SELECT COUNT(*) as totalOrders FROM orders", [], (err, row) => {
        stats.totalOrders = row.totalOrders;

        db.get("SELECT COALESCE(SUM(totalAmount), 0) as totalRevenue FROM orders", [], (err, row) => {
          stats.totalRevenue = row.totalRevenue;

          db.get("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'", [], (err, row) => {
            stats.pendingOrders = row.count;

            db.get("SELECT COUNT(*) as count FROM orders WHERE DATE(createdAt) = DATE('now')", [], (err, row) => {
              stats.todayOrders = row.count;

              db.get("SELECT COUNT(*) as count FROM users WHERE role = 'customer'", [], (err, row) => {
                stats.studentCount = row.count;

                db.get("SELECT COUNT(*) as count FROM users WHERE role = 'vendor'", [], (err, row) => {
                  stats.vendorCount = row.count;

                  db.get("SELECT COALESCE(SUM(balance), 0) as totalBalance FROM users WHERE role = 'customer'", [], (err, row) => {
                    stats.totalStudentBalance = row.totalBalance;

                    db.all("SELECT category, COUNT(*) as count FROM menu_items GROUP BY category ORDER BY count DESC", [], (err, categories) => {
                      stats.categoryDistribution = categories || [];

                      db.all("SELECT o.status, COUNT(*) as count FROM orders o GROUP BY o.status", [], (err, statusCounts) => {
                        stats.orderStatusDistribution = statusCounts || [];
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
    });
  });
});

router.get('/audit-logs', (req, res) => {
  const { limit = 50, offset = 0 } = req.query;
  db.all(
    `SELECT al.*, u.name as userName FROM audit_logs al LEFT JOIN users u ON al.userId = u.id ORDER BY al.createdAt DESC LIMIT ? OFFSET ?`,
    [limit, offset],
    (err, logs) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch audit logs' });
      res.json(logs);
    }
  );
});

router.post('/audit-logs', (req, res) => {
  const { action, details } = req.body;
  if (!action) return res.status(400).json({ error: 'Action is required' });
  db.run(
    "INSERT INTO audit_logs (userId, action, details) VALUES (?, ?, ?)",
    [req.user.id, action, details || ''],
    function(err) {
      if (err) return res.status(500).json({ error: 'Failed to create audit log' });
      res.status(201).json({ id: this.lastID });
    }
  );
});

router.get('/revenue-weekly', (req, res) => {
  db.all(
    `SELECT DATE(createdAt) as date, COUNT(*) as orders, COALESCE(SUM(totalAmount), 0) as revenue
     FROM orders
     WHERE createdAt >= DATE('now', '-7 days')
     GROUP BY DATE(createdAt)
     ORDER BY date ASC`,
    [],
    (err, data) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch revenue data' });
      res.json(data);
    }
  );
});

export default router;
