# Architecture

## System Overview

NSU Companion follows a **client-server architecture** with a React single-page application (SPA) frontend communicating with a RESTful Express.js backend through HTTP/JSON.

```
┌─────────────────────────────────────────────────────┐
│                    Browser                           │
│  ┌─────────────────────────────────────────────────┐│
│  │           React SPA (Vite)                      ││
│  │  ┌──────────┐ ┌──────────┐ ┌────────────────┐  ││
│  │  │ Auth     │ │ Cart     │ │ Pages          │  ││
│  │  │ Context  │ │ Context  │ │ (Menu, Orders, │  ││
│  │  │          │ │          │ │  Admin, etc.)  │  ││
│  │  └──────────┘ └──────────┘ └────────────────┘  ││
│  └──────────────────┬──────────────────────────────┘│
│                     │ HTTP (JSON)                    │
└─────────────────────┼────────────────────────────────┘
                      │
              Vite Proxy (dev) / Static (prod)
                      │
┌─────────────────────┼────────────────────────────────┐
│  ┌──────────────────▼──────────────────────────────┐ │
│  │            Express.js Server                     │ │
│  │                                                   │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │ │
│  │  │ Auth     │ │ Menu     │ │ Order Routes     │ │ │
│  │  │ Routes   │ │ Routes   │ │                  │ │ │
│  │  └──────────┘ └──────────┘ └──────────────────┘ │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │ │
│  │  │ Vendor   │ │ Admin    │ │ User Routes      │ │ │
│  │  │ Routes   │ │ Routes   │ │                  │ │ │
│  │  └──────────┘ └──────────┘ └──────────────────┘ │ │
│  │                                                   │ │
│  │       ┌─────────────────────────────────┐         │ │
│  │       │  Middleware Layer               │         │ │
│  │       │  auth.js (JWT verification)     │         │ │
│  │       └─────────────────────────────────┘         │ │
│  │                                                   │ │
│  │       ┌─────────────────────────────────┐         │ │
│  │       │  Database Layer (SQLite/MySQL)  │         │ │
│  │       └─────────────────────────────────┘         │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Tech Stack

### Frontend — React 18 + Vite

| Technology | Purpose |
|------------|---------|
| **React 18** | UI component library with hooks |
| **React Router v6** | Client-side routing with protected routes |
| **Vite 5** | Build tool with HMR and fast bundling |
| **CSS3** | Custom styles with CSS custom properties (design tokens) |
| **Context API** | State management for auth and cart |

### Backend — Node.js + Express

| Technology | Purpose |
|------------|---------|
| **Express.js** | HTTP server and routing |
| **better-sqlite3 / sqlite3** | Embedded SQL database |
| **jsonwebtoken** | Token-based authentication |
| **bcryptjs** | Password hashing |
| **cors** | Cross-origin resource sharing |

## Component Architecture

### Frontend Component Tree

```
App (BrowserRouter)
├── AuthProvider (Context)
│   └── CartProvider (Context)
│       └── AppRoutes
│           ├── Home (public landing)
│           ├── Login
│           ├── Register
│           ├── Menu (public)
│           ├── Cart (protected)
│           ├── Orders (protected)
│           ├── Profile (protected)
│           ├── VendorDashboard (vendor-only)
│           └── AdminDashboard (admin-only)
│               ├── Overview Tab
│               ├── Orders Tab
│               ├── Menu Tab
│               ├── Users Tab
│               └── Audit Logs Tab
```

### Data Flow

1. User authenticates → JWT stored in `localStorage`
2. `AuthContext` persists user state across navigation
3. Cart items stored in `localStorage` via `CartContext`
4. Page components fetch data via `fetch()` with JWT in `Authorization` header
5. Backend verifies JWT via middleware, queries SQLite, returns JSON
6. Frontend re-renders with received data

## Route Design

### Frontend Routes

| Path | Component | Access | Description |
|------|-----------|--------|-------------|
| `/` | Home | Public | Landing page |
| `/login` | Login | Public (redirect if authed) | Sign in |
| `/register` | Register | Public (redirect if authed) | Sign up |
| `/menu` | Menu | Public | Browse items |
| `/cart` | Cart | Auth | Review & checkout |
| `/orders` | Orders | Auth | View order history |
| `/profile` | Profile | Auth | Manage balance & info |
| `/vendor` | VendorDashboard | Vendor | Order management |
| `/admin` | AdminDashboard | Admin | System management |

### API Routes

| Base Path | Module | Auth Required |
|-----------|--------|---------------|
| `/api/auth` | Authentication | Public (register/login), Auth (me) |
| `/api/menu` | Menu Items | Public (GET), Admin (POST/PUT/DELETE) |
| `/api/orders` | Orders | Auth (all) |
| `/api/users` | Users | Auth (balance), Admin (list) |
| `/api/vendor` | Vendor Ops | Vendor/Admin |
| `/api/admin` | Admin Ops | Admin |

## Security Architecture

```
Request → CORS → JSON Parser → Auth Middleware → Route Handler → Response
                                      │
                              ┌───────┴───────┐
                              │ JWT Verify     │
                              │ Role Check     │
                              └───────────────┘
```

- **JWT tokens** are issued on login/register with 7-day expiry
- **Role-based middleware** restricts vendor and admin endpoints
- **Passwords** hashed with bcrypt (10 salt rounds)
- **SQL injection** prevented by parameterized queries
- **Input validation** performed on required fields and data types

## State Management

### AuthContext

```javascript
{
  user: { id, name, email, role, studentId, balance } | null,
  loading: boolean,
  login(email, password): Promise,
  register(name, email, password, studentId): Promise,
  logout(): void,
  updateBalance(newBalance): void
}
```

### CartContext

```javascript
{
  cart: [{ id, name, price, quantity, imageUrl }],
  addToCart(item): void,
  updateQuantity(id, qty): void,
  removeFromCart(id): void,
  clearCart(): void,
  getCartTotal(): number,
  getCartCount(): number,
  toast: string | null
}
```

## Performance Targets

| Metric | Target |
|--------|--------|
| Page Load Time | < 3 seconds |
| API Response Time | < 200ms (p95) |
| Database Query Time | < 100ms (p95) |
| Mobile Performance | 90+ Lighthouse score |
| Availability | 99.5% uptime |
