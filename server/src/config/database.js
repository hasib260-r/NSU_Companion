import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';

const db = new sqlite3.Database('./cafeteria.db');

export function initializeDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'customer',
        studentId TEXT,
        balance REAL DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        imageUrl TEXT,
        available INTEGER DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        totalAmount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        paymentMethod TEXT,
        paymentStatus TEXT DEFAULT 'unpaid',
        token TEXT,
        estimatedMinutes INTEGER DEFAULT 15,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId INTEGER NOT NULL,
        menuItemId INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (orderId) REFERENCES orders(id),
        FOREIGN KEY (menuItemId) REFERENCES menu_items(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        action TEXT NOT NULL,
        details TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        read INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    seedData();
  });
}

function seedData() {
  const adminPassword = bcrypt.hashSync('admin123', 10);

  db.get("SELECT id FROM users WHERE email = 'admin@nsu.edu'", (err, row) => {
    if (!row) {
      db.run(
        "INSERT INTO users (name, email, password, role, studentId, balance) VALUES (?, ?, ?, ?, ?, ?)",
        ['Admin', 'admin@nsu.edu', adminPassword, 'admin', 'ADMIN001', 0]
      );
    }
  });

  db.get("SELECT id FROM users WHERE email = 'student@nsu.edu'", (err, row) => {
    if (!row) {
      const studentPassword = bcrypt.hashSync('student123', 10);
      db.run(
        "INSERT INTO users (name, email, password, role, studentId, balance) VALUES (?, ?, ?, ?, ?, ?)",
        ['Demo Student', 'student@nsu.edu', studentPassword, 'customer', 'STU001', 500]
      );
    }
  });

  db.get("SELECT id FROM users WHERE email = 'vendor@nsu.edu'", (err, row) => {
    if (!row) {
      const vendorPassword = bcrypt.hashSync('vendor123', 10);
      db.run(
        "INSERT INTO users (name, email, password, role, studentId, balance) VALUES (?, ?, ?, ?, ?, ?)",
        ['Main Cafeteria Vendor', 'vendor@nsu.edu', vendorPassword, 'vendor', 'VEND001', 0]
      );
    }
  });

  db.get("SELECT id FROM menu_items LIMIT 1", (err, row) => {
    if (!row) {
      const menuItems = [
        ['Biriyani', 'Authentic NSU style biriyani with tender chicken', 180, ' Lunch', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8'],
        ['Pizza', 'Fresh oven-baked pizza with mozzarella cheese', 250, 'Fast Food', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38'],
        ['Burger', 'Juicy beef patty with fresh vegetables', 200, 'Fast Food', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'],
        ['Coffee', 'Hot brewed coffee with cream', 80, 'Beverages', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93'],
        ['Tea', 'Traditional Bangladeshi tea', 40, 'Beverages', 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f'],
        ['Paratha', 'Flaky butter paratha with curry', 120, 'Breakfast', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641'],
        ['Sandwich', 'Grilled chicken sandwich with mayo', 150, 'Fast Food', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af'],
        ['Fries', 'Crispy golden french fries', 100, 'Snacks', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877'],
        ['Cold Drink', 'Chilled soft drink', 50, 'Beverages', 'https://images.unsplash.com/photo-1527960471264-932f39eb5846'],
        ['Ice Cream', 'Vanilla ice cream with chocolate sauce', 90, 'Desserts', 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57']
      ];

      const stmt = db.prepare("INSERT INTO menu_items (name, description, price, category, imageUrl) VALUES (?, ?, ?, ?, ?)");
      menuItems.forEach(item => stmt.run(item));
      stmt.finalize();
    }
  });
}

export default db;