# User Guide

A comprehensive walkthrough for all three user roles in NSU Companion.

---

## 👤 Student & Faculty Guide

### Getting Started

1. **Create an account** at `/register` with your name, NSU email, and password
2. **Add balance** from your Profile page to pay with account balance
3. **Browse the menu** and place your first order

### Browsing the Menu

1. Click **Menu** in the navigation bar
2. Use the **category filter buttons** to narrow down items (Fast Food, Beverages, etc.)
3. Each menu card shows:
   - Item photo and name
   - Description
   - Price in BDT (৳)
   - **Add to Cart** button

### Placing an Order

1. Add items to your cart by clicking **Add to Cart** on any menu item
2. Click the **Cart** link in the navbar (badge shows item count)
3. Review your items, adjust quantities with **+** and **-** buttons
4. Choose a **payment method**:
   - **Pay with Balance** — Deducts from your account (instant)
   - **Cash on Delivery** — Pay when you pick up
5. Click **Place Order**

### Tracking Your Order

1. Go to **My Orders** from the navigation bar
2. Each order card shows:
   - **Order #** and current status with icon
   - 🎫 **Pickup Token** — Show this at the counter
   - ⏱️ **Estimated preparation time**
   - **Progress bar** showing order completion stage
   - **Item list** with quantities
   - **Total amount** and payment status
3. The page **auto-refreshes every 30 seconds** to show live updates
4. When status changes to **Ready**, collect your food from the cafeteria counter

### Managing Your Profile

1. Click your name in the navigation bar to go to **Profile**
2. View your **account information** (name, email, student ID, role)
3. **Add balance** to your account:
   - Enter an amount in BDT
   - Click **Add Balance** — the amount is instantly credited

### Order Status Meanings

| Status | Meaning | Icon |
|--------|---------|------|
| ⏳ **Pending** | Order received, waiting for vendor to start | ⏳ |
| 👨‍🍳 **Preparing** | Vendor is cooking your food | 👨‍🍳 |
| ✅ **Ready** | Food is ready for pickup at the counter | ✅ |
| ✔️ **Completed** | Order has been picked up | ✔️ |
| ❌ **Cancelled** | Order was cancelled | ❌ |

---

## 🏪 Vendor Guide

### Accessing the Dashboard

1. Log in with your vendor account
2. Click **Dashboard** in the navigation bar
3. The vendor dashboard opens at `/vendor`

### Understanding the Stats

The top of the dashboard shows 6 key metrics:

| Metric | Description |
|--------|-------------|
| **Total Orders** | All-time order count |
| **Today's Orders** | Orders placed today |
| **Active Orders** | Currently pending or being prepared |
| **Total Revenue** | All-time revenue in BDT |
| **Today Revenue** | Revenue generated today |
| **Ready Pickup** | Orders ready but not yet picked up |

### Managing Orders

1. Use the **filter tabs** to view orders by status (All, Pending, Preparing, Ready, Completed, Cancelled)
2. Each order card displays:
   - **Order #**, **Pickup Token** (🎫), and creation time
   - **Customer name**
   - **Items ordered** with quantities
   - **Total amount** and payment status
3. To update an order's status:
   - Select the new status from the dropdown
   - Changes are immediate and logged to audit trail

**Recommended workflow:**
```
New Order → Set to "Preparing" → Set to "Ready" when done
```

### Status Update Guide

| From → To | When |
|-----------|------|
| Pending → Preparing | When you start working on the order |
| Preparing → Ready | When food is ready for pickup |
| Ready → Completed | After customer picks up |
| Any → Cancelled | If order cannot be fulfilled |

---

## ⚙️ Administrator Guide

### Accessing the Admin Panel

1. Log in with your admin account
2. Click **Admin** in the navigation bar
3. The admin panel opens at `/admin`

### Overview Tab

The overview dashboard provides system-wide analytics:

**9 Stat Cards:**
- Total Users, Students, Vendors
- Menu Items, Total Orders, Pending Orders
- Today's Orders, Total Revenue, Student Balance Total

**Category Distribution:**
Shows how many menu items exist in each category.

**Order Status Distribution:**
Shows the breakdown of orders by their current status.

### Orders Tab

Full order management with a table view:

| Column | Description |
|--------|-------------|
| ID | Order number |
| Customer | Customer name |
| Token | Pickup token |
| Items | Item count |
| Total | Amount in BDT |
| Status | Dropdown to update status |
| Payment | Paid / Unpaid indicator |
| Action | Item breakdown |

### Menu Items Tab

Manage the cafeteria's menu:

- **View** all items in a table
- **Add** new items with name, description, price, category, and image URL
- **Edit** existing items
- **Delete** items (with confirmation)
- **Toggle availability** to hide items without deleting

Adding a new item:
1. Click **Add New Item**
2. Fill in: Name, Description, Price, Category, Image URL
3. Check **Available** to make it visible
4. Click **Add**

### Users Tab

View all registered users:

| Column | Description |
|--------|-------------|
| ID | User identifier |
| Name | Full name |
| Email | NSU email address |
| Student ID | Optional NSU ID |
| Role | Admin / Vendor / Customer (color-coded) |
| Balance | Current account balance |
| Joined | Registration date |

### Audit Logs Tab

System activity history automatically recorded:

- **Order status changes** (who changed what and when)
- **Order placements** with amounts and tokens
- New entries are added automatically by the system

Each log entry shows:
- **Action** (e.g., `update_order_status`, `place_order`)
- **Details** (e.g., "Order #1 → ready")
- **User** who performed the action
- **Timestamp** of the action

---

## Common Tasks

### Resetting the Database

Delete the database file and restart the server:

```bash
rm server/cafeteria.db
npm run dev
```

This regenerates the database with fresh seed data.

### Creating a New Vendor Account

Use the SQLite CLI or MySQL client:

```sql
INSERT INTO users (name, email, password, role, studentId, balance)
VALUES ('New Vendor', 'vendor2@nsu.edu', '<bcrypt_hash>', 'vendor', 'VEND002', 0);
```

Generate a bcrypt hash:
```bash
node -e "console.log(require('bcryptjs').hashSync('password123', 10))"
```

### Viewing Audit Logs Directly

```bash
sqlite3 server/cafeteria.db "SELECT * FROM audit_logs ORDER BY createdAt DESC LIMIT 10;"
```
