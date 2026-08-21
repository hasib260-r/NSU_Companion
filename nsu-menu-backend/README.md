# NSU Companion — Digital Menu Management (Backend)

Express + PostgreSQL (via Prisma) API for FR-2.1–FR-2.4, plus a
Socket.IO broadcast so the frontend's live-menu requirement (FR-2.3)
works for real. This matches exactly what `menuService.js` in the
frontend project expects — flip `USE_MOCK = false` there once this is
running and it should connect with no other changes.

## 1. Install PostgreSQL

Easiest on Windows: install [Docker Desktop](https://www.docker.com/products/docker-desktop/),
then run:

```
docker run --name nsu-postgres -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres
```

(Or install PostgreSQL directly from postgresql.org if you'd rather
not use Docker.)

## 2. Configure environment

Copy `.env.example` to `.env` and update `DATABASE_URL` with your
actual password (and database name, if different):

```
copy .env.example .env
```

## 3. Install dependencies and set up the database

```
npm install
npx prisma migrate dev --name init
npm run seed
```

`prisma migrate dev` creates the `menu_items` table from
`prisma/schema.prisma`. `npm run seed` populates it with the same 6
sample items the frontend mock data uses, so you can compare behavior
directly.

## 4. Run the server

```
npm run dev
```

This starts the API on `http://localhost:4000` (Node's built-in
`--watch` restarts it on file changes — no nodemon needed).

Test it's alive: open `http://localhost:4000/health` in a browser —
you should see `{"status":"ok"}`.

## 5. Run the unit tests

```
npm test
```

`src/validation/menuItem.test.js` covers the validation logic used by
the create/update routes — required fields, type checks, negative
price/prep-time rejection, and partial-update behavior for the
availability toggle. This is pure logic with no database involved, so
it's fast and needs no mocking — a good candidate for your one
required unit test if you'd rather submit backend coverage than the
Order Token one.

## API reference

| Method | Path             | Purpose                                  |
|--------|------------------|-------------------------------------------|
| GET    | `/api/menu`      | List items. Supports `?stall=`, `?category=`, `?search=` (FR-2.4) |
| POST   | `/api/menu`      | Create an item (FR-2.1)                   |
| PUT    | `/api/menu/:id`  | Update an item, full or partial — also used for the availability toggle (FR-2.1, FR-2.2) |
| DELETE | `/api/menu/:id`  | Remove an item (FR-2.1)                   |

Every write operation also emits a `menu:updated` Socket.IO event to
all connected clients, satisfying the "reflects changes within 5
seconds" requirement (FR-2.3) without needing the frontend to poll.

## Connecting the frontend

In the frontend project's `src/services/menuService.js`:
1. Set `USE_MOCK = false`
2. Set `VITE_API_BASE_URL=http://localhost:4000/api` in a `.env` file
3. Uncomment the Socket.IO block at the bottom of that file and call
   `subscribeToMenuUpdates()` from `useMenuItems.js`

## Project structure

```
src/
├── app.js                    # Express app (importable, for tests)
├── server.js                 # Entry point — starts HTTP + Socket.IO
├── routes/menu.routes.js
├── controllers/menu.controller.js
├── validation/menuItem.js    # Pure validation logic (unit tested)
├── sockets/menu.socket.js    # Real-time broadcast (FR-2.3)
├── middleware/errorHandler.js
└── lib/prisma.js
prisma/
├── schema.prisma             # menu_items table definition
└── seed.js
```
