# API Documentation

Base URL: `http://localhost:5000/api`

Authentication: `Authorization: Bearer <token>`

---

## Authentication

### Register a New User

```
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@northsouth.edu",
  "password": "securepass123",
  "studentId": "STU12345"
}
```

**Response** `201 Created`:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@northsouth.edu",
    "role": "customer",
    "balance": 0
  }
}
```

**Errors:**
- `400` — Name, email and password are required
- `400` — Email already registered

---

### Login

```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "student@nsu.edu",
  "password": "student123"
}
```

**Response** `200 OK`:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 2,
    "name": "Demo Student",
    "email": "student@nsu.edu",
    "role": "customer",
    "studentId": "STU001",
    "balance": 500
  }
}
```

**Errors:**
- `401` — Invalid credentials

---

### Get Current User

```
GET /api/auth/me
```

**Headers:** `Authorization: Bearer <token>`

**Response** `200 OK`:
```json
{
  "id": 2,
  "name": "Demo Student",
  "email": "student@nsu.edu",
  "role": "customer",
  "studentId": "STU001",
  "balance": 500
}
```

**Errors:**
- `401` — Access token required
- `403` — Invalid or expired token
- `404` — User not found

---

## Menu Items

### Get All Menu Items

```
GET /api/menu
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category (e.g., "Fast Food") |
| `available` | boolean | Filter by availability ("true" or "false") |

**Response** `200 OK`:
```json
[
  {
    "id": 1,
    "name": "Biriyani",
    "description": "Authentic NSU style biriyani with tender chicken",
    "price": 180,
    "category": "Lunch",
    "imageUrl": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8",
    "available": 1,
    "createdAt": "2026-07-17 22:33:00"
  }
]
```

---

### Get Menu Categories

```
GET /api/menu/categories
```

**Response** `200 OK`:
```json
["Beverages", "Breakfast", "Desserts", "Fast Food", "Lunch", "Snacks"]
```

---

### Get Single Menu Item

```
GET /api/menu/:id
```

**Response** `200 OK`:
```json
{
  "id": 1,
  "name": "Biriyani",
  "description": "Authentic NSU style biriyani with tender chicken",
  "price": 180,
  "category": "Lunch",
  "imageUrl": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8",
  "available": 1,
  "createdAt": "2026-07-17 22:33:00"
}
```

**Errors:**
- `404` — Menu item not found

---

### Create Menu Item (Admin)

```
POST /api/menu
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Shawarma",
  "description": "Grilled chicken wrap with garlic sauce",
  "price": 160,
  "category": "Fast Food",
  "imageUrl": "https://example.com/shawarma.jpg"
}
```

**Response** `201 Created`:
```json
{
  "id": 11,
  "name": "Shawarma",
  "description": "Grilled chicken wrap with garlic sauce",
  "price": 160,
  "category": "Fast Food",
  "imageUrl": "https://example.com/shawarma.jpg"
}
```

---

### Update Menu Item (Admin)

```
PUT /api/menu/:id
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Chicken Biriyani",
  "price": 200,
  "available": true
}
```

**Response** `200 OK`:
```json
{
  "message": "Menu item updated successfully"
}
```

---

### Delete Menu Item (Admin)

```
DELETE /api/menu/:id
```

**Headers:** `Authorization: Bearer <token>`

**Response** `200 OK`:
```json
{
  "message": "Menu item deleted successfully"
}
```

---

## Orders

### Place an Order

```
POST /api/orders
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "items": [
    { "id": 1, "quantity": 2 },
    { "id": 4, "quantity": 1 }
  ],
  "paymentMethod": "balance"
}
```

**Response** `201 Created`:
```json
{
  "orderId": 1,
  "totalAmount": 440,
  "status": "pending",
  "token": "A7X3K9",
  "estimatedMinutes": 15,
  "message": "Order placed successfully"
}
```

**Payment Methods:**
- `balance` — Deducts from user's account balance
- `cash` — Cash on delivery (no upfront payment)

**Errors:**
- `400` — Order must contain items
- `400` — Insufficient balance (when using balance method)

---

### Get Orders

```
GET /api/orders
```

**Headers:** `Authorization: Bearer <token>`

Returns the authenticated user's orders. Admins see all orders.

**Response** `200 OK`:
```json
[
  {
    "id": 1,
    "userId": 2,
    "totalAmount": 440,
    "status": "preparing",
    "paymentMethod": "balance",
    "paymentStatus": "paid",
    "token": "A7X3K9",
    "estimatedMinutes": 15,
    "createdAt": "2026-07-18 10:30:00",
    "items": [
      { "id": 1, "orderId": 1, "menuItemId": 1, "quantity": 2, "price": 180, "itemName": "Biriyani" },
      { "id": 2, "orderId": 1, "menuItemId": 4, "quantity": 1, "price": 80, "itemName": "Coffee" }
    ]
  }
]
```

---

### Get Single Order

```
GET /api/orders/:id
```

**Headers:** `Authorization: Bearer <token>`

**Response** `200 OK`:
```json
{
  "id": 1,
  "userId": 2,
  "totalAmount": 440,
  "status": "preparing",
  "paymentMethod": "balance",
  "paymentStatus": "paid",
  "token": "A7X3K9",
  "estimatedMinutes": 15,
  "createdAt": "2026-07-18 10:30:00",
  "items": [
    { "id": 1, "orderId": 1, "menuItemId": 1, "quantity": 2, "price": 180, "itemName": "Biriyani", "itemImage": "https://..." }
  ]
}
```

---

### Update Order Status (Admin/Vendor)

```
PUT /api/orders/:id/status
```

**Headers:** `Authorization: Bearer <token>` (Admin or Vendor)

**Request Body:**
```json
{
  "status": "preparing"
}
```

**Valid Statuses:** `pending`, `preparing`, `ready`, `completed`, `cancelled`

**Response** `200 OK`:
```json
{
  "message": "Order status updated to preparing"
}
```

---

### Pay for Order

```
POST /api/orders/:id/pay
```

**Headers:** `Authorization: Bearer <token>`

Pays an unpaid order using the user's balance.

**Response** `200 OK`:
```json
{
  "message": "Payment successful",
  "amountPaid": 440
}
```

**Errors:**
- `400` — Order already paid
- `400` — Insufficient balance

---

## Users

### Get User Balance

```
GET /api/users/balance
```

**Headers:** `Authorization: Bearer <token>`

**Response** `200 OK`:
```json
{
  "balance": 500
}
```

---

### Add Balance

```
POST /api/users/balance/add
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "amount": 200
}
```

**Response** `200 OK`:
```json
{
  "message": "Balance added successfully",
  "balance": 700
}
```

---

### List All Users (Admin)

```
GET /api/users
```

**Headers:** `Authorization: Bearer <token>` (Admin only)

**Response** `200 OK`:
```json
[
  {
    "id": 1,
    "name": "Admin",
    "email": "admin@nsu.edu",
    "role": "admin",
    "studentId": "ADMIN001",
    "balance": 0,
    "createdAt": "2026-07-17 22:33:00"
  }
]
```

---

## Vendor Operations

### Get All Orders (Vendor)

```
GET /api/vendor/orders
```

**Headers:** `Authorization: Bearer <token>` (Vendor or Admin)

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter by status (e.g., "pending") |

**Response** `200 OK`:
```json
[
  {
    "id": 1,
    "userId": 2,
    "userName": "Demo Student",
    "totalAmount": 440,
    "status": "pending",
    "token": "A7X3K9",
    "estimatedMinutes": 15,
    "createdAt": "2026-07-18 10:30:00",
    "items": [
      { "itemName": "Biriyani", "quantity": 2, "price": 180 }
    ]
  }
]
```

---

### Update Order Status (Vendor)

```
PUT /api/vendor/orders/:id/status
```

**Headers:** `Authorization: Bearer <token>` (Vendor or Admin)

**Request Body:**
```json
{
  "status": "ready",
  "estimatedMinutes": 5
}
```

Automatically creates an audit log entry.

**Response** `200 OK`:
```json
{
  "message": "Order status updated to ready"
}
```

---

### Get Vendor Stats

```
GET /api/vendor/stats
```

**Headers:** `Authorization: Bearer <token>` (Vendor or Admin)

**Response** `200 OK`:
```json
{
  "totalOrders": 15,
  "totalRevenue": 3400,
  "pendingOrders": 3,
  "preparingOrders": 2,
  "readyOrders": 1,
  "completedOrders": 8,
  "cancelledOrders": 1,
  "todayOrders": 5,
  "todayRevenue": 1200,
  "activeOrders": 5
}
```

---

## Admin Operations

### Get System Stats

```
GET /api/admin/stats
```

**Headers:** `Authorization: Bearer <token>` (Admin only)

**Response** `200 OK`:
```json
{
  "totalUsers": 3,
  "totalMenuItems": 10,
  "totalOrders": 15,
  "totalRevenue": 3400,
  "pendingOrders": 3,
  "todayOrders": 5,
  "studentCount": 1,
  "vendorCount": 1,
  "totalStudentBalance": 500,
  "categoryDistribution": [
    { "category": "Fast Food", "count": 3 },
    { "category": "Beverages", "count": 3 }
  ],
  "orderStatusDistribution": [
    { "status": "pending", "count": 3 },
    { "status": "completed", "count": 8 }
  ]
}
```

---

### Get Audit Logs

```
GET /api/admin/audit-logs?limit=50&offset=0
```

**Headers:** `Authorization: Bearer <token>` (Admin only)

**Response** `200 OK`:
```json
[
  {
    "id": 1,
    "userId": 1,
    "userName": "Admin",
    "action": "update_order_status",
    "details": "Order #1 → ready",
    "createdAt": "2026-07-18 10:35:00"
  }
]
```

---

### Create Audit Log Entry

```
POST /api/admin/audit-logs
```

**Headers:** `Authorization: Bearer <token>` (Admin only)

**Request Body:**
```json
{
  "action": "system_config_update",
  "details": "Updated max order limit to 50"
}
```

**Response** `201 Created`:
```json
{
  "id": 42
}
```

---

### Get Weekly Revenue

```
GET /api/admin/revenue-weekly
```

**Headers:** `Authorization: Bearer <token>` (Admin only)

**Response** `200 OK`:
```json
[
  { "date": "2026-07-12", "orders": 3, "revenue": 540 },
  { "date": "2026-07-13", "orders": 5, "revenue": 1200 },
  { "date": "2026-07-18", "orders": 2, "revenue": 440 }
]
```

---

## Health Check

```
GET /api/health
```

**Response** `200 OK`:
```json
{
  "status": "ok",
  "message": "NSU Companion API is running"
}
```

---

## Error Response Format

All errors follow this structure:

```json
{
  "error": "Descriptive error message"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created successfully |
| `400` | Bad request (validation error) |
| `401` | Unauthorized (no token) |
| `403` | Forbidden (wrong role) |
| `404` | Resource not found |
| `500` | Internal server error |
