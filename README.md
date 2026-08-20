# NSU Companion — Merged Project (Auth + Admin Management + Backend)

This folder combines three previously separate project folders into a single
runnable workspace, so all of it can be committed to one Git branch:

```
nsu-companion/
├── backend/                     # Express + JWT API (auth + admin endpoints)
│   ├── data/                    # In-memory demo data (users, vendors, stalls, orders, config)
│   ├── server.js
│   ├── admin.api.test.js        # Vitest integration tests against a live server
│   └── package.json
│
├── frontend-authentication/     # React (Vite) - Login / Register / Home / Logout
│   ├── src/
│   └── package.json
│
├── frontend-admin/              # React (Vite) - Admin login + Admin panel
│   ├── src/
│   │   └── test/AdminManagement.test.jsx   # Vitest + React Testing Library
│   ├── vitest.config.js
│   └── package.json
│
├── database/
│   └── nsu_companion_postgresql_final.sql  # Full Postgres schema + demo data
│
├── package.json                 # Root scripts to install/run/test everything together
├── test.py                      # Runs backend + admin-frontend test suites together
├── .gitignore
└── README.md
```

Nothing inside `backend/`, `frontend-authentication/`, or `frontend-admin/`
was rewritten — the original app code and tests are untouched. What was
added is the outer scaffolding (`package.json`, `test.py`, `vite.config.js`
port settings, `.gitignore`, this README) that lets all three run together
from one place.

## Important architecture note

The backend currently stores data in **in-memory JS arrays**
(`backend/data/*.js`), not in the Postgres database. `database/nsu_companion_postgresql_final.sql`
is the intended production schema — wiring the backend to actually use
Postgres (e.g. with `pg` and real queries replacing `data/*.js`) is a
follow-up task, not something this merge silently pretends is already done.

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+ (only needed to run `test.py`)

## 1. Install everything

From the `nsu-companion/` root:

```bash
npm install          # installs root devDependency: concurrently
npm run install:all  # installs backend, frontend-authentication, frontend-admin
```

## 2. Run everything at once

```bash
npm run dev
```

This starts, side by side:

| Service                    | URL                       |
|-----------------------------|---------------------------|
| Backend API                 | http://localhost:5000     |
| Authentication frontend      | http://localhost:5173     |
| Admin Management frontend    | http://localhost:5174     |

Both frontends already point at `http://localhost:5000` for API calls, so no
extra config is needed. Stop everything with `Ctrl+C`.

You can also run each piece individually:

```bash
npm run dev:backend
npm run dev:auth
npm run dev:admin
```

## 3. Run the tests

```bash
npm test
```

This runs `test.py`, which starts the backend, runs the backend's Vitest
suite (`backend/admin.api.test.js`), runs the admin frontend's Vitest suite
(`frontend-admin/src/test/AdminManagement.test.jsx`), stops the backend, and
writes a summary to `TEST_RESULT.md`.

To run one suite at a time:

```bash
npm run test:backend
npm run test:admin
```

`frontend-authentication` has no test suite in the delivered project (no
Vitest devDependencies were set up for it).

## Demo accounts (in-memory backend data)

| Role    | Email                  | Password    |
|---------|-------------------------|-------------|
| Admin   | admin@nsu.edu.bd        | Admin123    |
| Student | student@nsu.edu.bd      | Student123  |

## Git / VS Code instructions

See the accompanying setup instructions for creating a branch and committing
this project from the VS Code terminal.
