# NSU Companion

## About

**NSU Companion** is a student-focused platform designed to provide useful digital services for students of **North South University (NSU)**.

The project combines university food services, ordering functionality, and other student companion features into a single platform.

## Features

* 🍽️ **University Menu** — View and manage available food items from NSU stalls.
* 🎟️ **Order Token System** — Manage food orders and token-based collection.
* 🎓 **Student Companion Features** — Provide useful services and tools for NSU students.

## Project Structure

```text
NSU_Companion/
│
├── nsu-menu-backend/          # Menu management API
├── nsu-menu-frontend/         # Menu management frontend
├── nsu-order-token-backend/   # Order token API
├── nsu-order-token-frontend/  # Order token frontend
│
└── README.md
```

## Technologies

* **Frontend:** React, Vite
* **Backend:** Node.js, Express
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Testing:** Vitest
* **Real-time Communication:** Socket.IO

## Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd NSU_Companion
```

### 2. Install Dependencies

Install dependencies separately for each application:

```bash
cd nsu-menu-frontend
npm install
```

```bash
cd ../nsu-menu-backend
npm install
```

Repeat the same process for:

```text
nsu-order-token-frontend
nsu-order-token-backend
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then configure the required environment variables, such as database and API settings.

### 4. Start the Applications

Run the frontend and backend applications from their respective directories using:

```bash
npm run dev
```

## Testing

Unit tests are implemented using **Vitest**.

To run tests:

```bash
npm test
```

The menu modules currently include tests for:

* Menu filtering
* Search functionality
* Category and stall filtering
* Menu-item validation
* Invalid input handling
* Partial updates


This project is intended for educational and academic use.
