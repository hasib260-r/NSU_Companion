# Getting Started

Follow this guide to set up the NSU Companion project on your local machine for development and testing.

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| [Node.js](https://nodejs.org) | v18+ | JavaScript runtime |
| npm or yarn | Latest | Package manager |
| [Git](https://git-scm.com) | Latest | Version control |
| [VS Code](https://code.visualstudio.com) | — | Recommended editor |

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/mnxtr/Software-engineering-project.git
cd Software-engineering-project
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

This installs:
- `express` — Web framework
- `sqlite3` — Database engine
- `bcryptjs` — Password hashing
- `jsonwebtoken` — JWT authentication
- `cors` — Cross-origin requests
- `dotenv` — Environment configuration

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

This installs:
- `react` & `react-dom` — UI library
- `react-router-dom` — Client-side routing
- `vite` & `@vitejs/plugin-react` — Build tool

### 4. Environment Configuration

Backend environment variables (`server/.env`):

```env
PORT=5000
JWT_SECRET=your-secure-secret-key-here
DATABASE_PATH=./cafeteria.db
```

Frontend variables (`client/.env`):

```env
VITE_API_URL=http://localhost:5000
```

> **Note**: The application works without `.env` files using sensible defaults. The JWT secret defaults to `nsu-cafeteria-secret-key-2024`.

## Running the Application

### Development Mode (two terminals)

**Terminal 1 — Backend:**

```bash
cd server
npm run dev
```

The server starts on `http://localhost:5000` with auto-reload on file changes.

**Terminal 2 — Frontend:**

```bash
cd client
npm run dev
```

The client starts on `http://localhost:3000` with HMR (Hot Module Replacement).

The Vite dev server proxies `/api` requests to the backend at port 5000.

### Production Mode

```bash
# Build the frontend
cd client
npm run build

# Start the server (serves static + API)
cd ../server
npm start
```

The combined app runs on `http://localhost:5000`.

## Access Points

| Service | URL |
|---------|-----|
| 🎓 Student App | `http://localhost:3000` (dev) / `http://localhost:5000` (prod) |
| 🏪 Vendor Dashboard | `http://localhost:3000/vendor` |
| ⚙️ Admin Panel | `http://localhost:3000/admin` |
| 🔌 Backend API | `http://localhost:5000/api` |

## Demo Accounts

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | admin@nsu.edu | admin123 | All features, user management, audit logs |
| **Vendor** | vendor@nsu.edu | vendor123 | Order management, menu control, analytics |
| **Student** | student@nsu.edu | student123 | Browse menu, place orders, track status |

The database is auto-seeded with these accounts and 10 menu items on first run.

## First Run Checklist

- [ ] Backend starts without errors on port 5000
- [ ] Frontend builds without errors on port 3000
- [ ] Can log in as student, vendor, and admin
- [ ] Menu items are displayed on the Menu page
- [ ] Can add items to cart and place an order
- [ ] Vendor dashboard shows order with status management
- [ ] Admin dashboard shows stats and user list

## Troubleshooting

### Backend won't start
```bash
# Check for port conflicts
lsof -i :5000
# Kill process if needed
kill -9 <PID>
```

### Database issues
```bash
# Delete the database and let it regenerate
rm server/cafeteria.db
# Restart the server
npm run dev
```

### CORS errors
Ensure the backend is running on port 5000 and the Vite proxy is configured in `client/vite.config.js`.

### Module import errors
Ensure you're using Node.js v18+ and that `"type": "module"` is in `server/package.json`.
