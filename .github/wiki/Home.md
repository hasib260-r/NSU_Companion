# 🍽️ NSU Companion Wiki

Welcome to the **NSU Companion** documentation wiki — a smart cafeteria management and pre-ordering system built for **North South University (NSU)**.

## Quick Links

| Page | Description |
|------|-------------|
| [Getting Started](Getting-Started) | Setup instructions, prerequisites, and first run |
| [Architecture](Architecture) | System design, tech stack, and component diagram |
| [API Documentation](API-Documentation) | All REST endpoints with request/response examples |
| [Database Schema](Database-Schema) | Entity relationships, table definitions, and seed data |
| [User Guide](User-Guide) | Walkthroughs for Students, Vendors, and Admins |
| [Developer Guide](Developer-Guide) | Branching strategy, commit conventions, PR workflow |
| [Deployment Guide](Deployment-Guide) | Production deployment to AWS / Azure / on-campus server |

## Overview

NSU Companion eliminates long physical queues at the NSU cafeteria by connecting three user types through a comprehensive digital ecosystem:

- **👤 Students & Faculty** — Browse live menus, place pre-orders, pay with balance or cash, collect with unique tokens
- **🏪 Vendors** — Manage menus, track incoming orders, update preparation status, view real-time sales analytics
- **⚙️ Administrators** — Configure system settings, manage users and permissions, monitor operations, generate audit reports

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router, CSS3 |
| **Backend** | Node.js, Express.js |
| **Database** | SQLite (dev) / MySQL 8.0+ (production) |
| **Authentication** | JWT (JSON Web Tokens) with bcrypt |
| **Payments** | Balance system, Cash on Delivery, SSLCommerz & bKash (sandbox) |
| **Notifications** | In-app alerts, Firebase Cloud Messaging (planned) |

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| 👑 **Admin** | admin@nsu.edu | admin123 |
| 🏪 **Vendor** | vendor@nsu.edu | vendor123 |
| 👤 **Student** | student@nsu.edu | student123 |

## Project Structure

```
nsu-cafeteria/
├── server/                  # Express.js backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── middleware/      # Auth & validation middleware
│   │   ├── routes/         # API route handlers
│   │   └── index.js        # Entry point
│   └── package.json
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/     # Shared components (Navbar)
│   │   ├── context/        # Auth & Cart React contexts
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Root component with routing
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── wiki/                    # This documentation
```

## Features

- **Real-time Menu Management** — Dynamic pricing and live item availability
- **Secure Payment Gateway** — Balance system, Cash on Delivery, SSLCommerz & bKash
- **Push Notifications** — Real-time order status updates (in-app, FCM planned)
- **Order Tracking** — Live preparation status with progress bars and estimated timers
- **Unique Order Tokens** — Secure 6-character pickup identification system
- **Vendor Dashboard** — Analytics, order management, menu control with 6 stat cards
- **Admin Panel** — System-wide stats, user management, audit logs, 9 overview metrics
- **Mobile Responsive** — Seamless experience across all devices

## Contact

- **Project Lead**: Mohammad Mansib Newaz
- **Tech Lead**: Faroque Hossain Rumi
- **Operations Lead**: Mohammad Hasibur Rahman
- **Course**: CSE327 Software Engineering — Fall 2026
- **University**: North South University
