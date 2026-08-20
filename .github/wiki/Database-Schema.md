# Database Schema

The application uses **SQLite** for development and is designed to be compatible with **MySQL 8.0+** for production. The database is auto-created at `server/cafeteria.db` on first run.

## Entity Relationship Diagram

```
┌───────────────────┐       ┌──────────────────────┐
│       users       │       │     menu_items        │
├───────────────────┤       ├──────────────────────┤
│ PK │ id           │       │ PK │ id              │
│    │ name         │       │    │ name            │
│    │ email (UQ)   │       │    │ description     │
│    │ password     │       │    │ price           │
│    │ role         │       │    │ category        │
│    │ studentId    │       │    │ imageUrl        │
│    │ balance      │       │    │ available       │
│    │ createdAt    │       │    │ createdAt       │
└────────┬──────────┘       └──────────────────────┘
         │                             │
         │ 1                        ──┘
         │                          N
         ▼                          ▼
┌───────────────────┐       ┌──────────────────────┐
│      orders       │       │     order_items       │
├───────────────────┤       ├──────────────────────┤
│ PK │ id           │───────│ FK │ orderId         │
│ FK │ userId       │   N   │ FK │ menuItemId      │
│    │ totalAmount  │   1   │    │ quantity        │
│    │ status       │       │    │ price           │
│    │ paymentMethod│       │    │ id (PK)         │
│    │ paymentStatus│       └──────────────────────┘
│    │ token        │
│    │ estimatedMin │       ┌──────────────────────┐
│    │ createdAt    │       │     audit_logs        │
└───────────────────┘       ├──────────────────────┤
         │                  │ PK │ id              │
         │ 1                │ FK │ userId          │
         │                  │    │ action          │
         ▼                  │    │ details         │
┌───────────────────┐       │    │ createdAt       │
│  notifications    │       └──────────────────────┘
├───────────────────┤
│ PK │ id           │       ┌──────────────────────┐
│ FK │ userId       │       │  (future: sessions,  │
│    │ title        │       │   payments, etc.)    │
│    │ message      │       └──────────────────────┘
│    │ read         │
│    │ createdAt    │
└───────────────────┘
```

## Table Definitions

### users

Stores all user accounts — students, vendors, and administrators.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique user identifier |
| `name` | TEXT | NOT NULL | Full name |
| `email` | TEXT | UNIQUE NOT NULL | NSU email address |
| `password` | TEXT | NOT NULL | bcrypt-hashed password |
| `role` | TEXT | DEFAULT 'customer' | `customer`, `vendor`, or `admin` |
| `studentId` | TEXT | NULLABLE | NSU student ID (optional) |
| `balance` | REAL | DEFAULT 0 | Account balance in BDT |
| `createdAt` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |

**Seed Data:**
| Name | Email | Role | Password (plain) |
|------|-------|------|-----------------|
| Admin | admin@nsu.edu | admin | admin123 |
| Main Cafeteria Vendor | vendor@nsu.edu | vendor | vendor123 |
| Demo Student | student@nsu.edu | customer | student123 |

---

### menu_items

Cafeteria food and beverage items available for ordering.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique item identifier |
| `name` | TEXT | NOT NULL | Item display name |
| `description` | TEXT | NULLABLE | Item description |
| `price` | REAL | NOT NULL | Price in BDT |
| `category` | TEXT | NOT NULL | Menu category (e.g., "Fast Food") |
| `imageUrl` | TEXT | NULLABLE | External image URL |
| `available` | INTEGER | DEFAULT 1 | Availability flag (0/1) |
| `createdAt` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Item creation timestamp |

**Seed Data (10 items):**

| Name | Category | Price | Description |
|------|----------|-------|-------------|
| Biriyani | Lunch | 180 | Authentic NSU style biriyani with tender chicken |
| Pizza | Fast Food | 250 | Fresh oven-baked pizza with mozzarella cheese |
| Burger | Fast Food | 200 | Juicy beef patty with fresh vegetables |
| Coffee | Beverages | 80 | Hot brewed coffee with cream |
| Tea | Beverages | 40 | Traditional Bangladeshi tea |
| Paratha | Breakfast | 120 | Flaky butter paratha with curry |
| Sandwich | Fast Food | 150 | Grilled chicken sandwich with mayo |
| Fries | Snacks | 100 | Crispy golden french fries |
| Cold Drink | Beverages | 50 | Chilled soft drink |
| Ice Cream | Desserts | 90 | Vanilla ice cream with chocolate sauce |

---

### orders

Customer orders placed through the system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique order identifier |
| `userId` | INTEGER | NOT NULL, FK → users.id | Customer who placed the order |
| `totalAmount` | REAL | NOT NULL | Total order value in BDT |
| `status` | TEXT | DEFAULT 'pending' | Current status: `pending`, `preparing`, `ready`, `completed`, `cancelled` |
| `paymentMethod` | TEXT | NULLABLE | `balance` or `cash` |
| `paymentStatus` | TEXT | DEFAULT 'unpaid' | `paid` or `unpaid` |
| `token` | TEXT | NULLABLE | 6-character pickup token (e.g., "A7X3K9") |
| `estimatedMinutes` | INTEGER | DEFAULT 15 | Estimated preparation time |
| `createdAt` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Order placement timestamp |

**Status Flow:**
```
pending → preparing → ready → completed
    ↓         ↓
 cancelled  cancelled
```

---

### order_items

Line items within each order.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique line item identifier |
| `orderId` | INTEGER | NOT NULL, FK → orders.id | Parent order |
| `menuItemId` | INTEGER | NOT NULL, FK → menu_items.id | Menu item ordered |
| `quantity` | INTEGER | NOT NULL | Quantity ordered |
| `price` | REAL | NOT NULL | Price per unit at time of order |

---

### audit_logs

System activity log for administrative review.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique log identifier |
| `userId` | INTEGER | NOT NULL, FK → users.id | User who performed the action |
| `action` | TEXT | NOT NULL | Action identifier (e.g., `update_order_status`, `place_order`) |
| `details` | TEXT | NULLABLE | Human-readable description |
| `createdAt` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Log creation timestamp |

---

### notifications

User notifications for order updates.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique notification identifier |
| `userId` | INTEGER | NOT NULL, FK → users.id | Target user |
| `title` | TEXT | NOT NULL | Notification title |
| `message` | TEXT | NOT NULL | Notification body |
| `read` | INTEGER | DEFAULT 0 | Read flag (0/1) |
| `createdAt` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Notification creation timestamp |

---

## Indexing Strategy

For production MySQL deployment, add these indexes:

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Orders
CREATE INDEX idx_orders_userId ON orders(userId);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_createdAt ON orders(createdAt);

-- Order Items
CREATE INDEX idx_order_items_orderId ON order_items(orderId);
CREATE INDEX idx_order_items_menuItemId ON order_items(menuItemId);

-- Menu Items
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_available ON menu_items(available);

-- Audit Logs
CREATE INDEX idx_audit_logs_userId ON audit_logs(userId);
CREATE INDEX idx_audit_logs_createdAt ON audit_logs(createdAt);

-- Notifications
CREATE INDEX idx_notifications_userId ON notifications(userId);
CREATE INDEX idx_notifications_read ON notifications(read);
```

## Migration Guide (SQLite → MySQL)

For production deployment, migrate to MySQL 8.0+:

1. Install MySQL and create a database:
```sql
CREATE DATABASE nsu_companion CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'nsu_app'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON nsu_companion.* TO 'nsu_app'@'localhost';
FLUSH PRIVILEGES;
```

2. Convert SQLite types to MySQL:

| SQLite Type | MySQL Type |
|-------------|------------|
| INTEGER PRIMARY KEY AUTOINCREMENT | INT AUTO_INCREMENT |
| TEXT | VARCHAR(255) or TEXT |
| REAL | DECIMAL(10,2) |
| DATETIME | DATETIME(6) |
| INTEGER (boolean) | TINYINT(1) |

3. Replace parameterized `?` placeholders with `?` (already compatible with mysql2 driver).
