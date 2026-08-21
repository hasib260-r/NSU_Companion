# NSU Companion — Order Token Generation (Backend)

Express + PostgreSQL (via Prisma) API for FR-5.1–FR-5.3: generates a
guaranteed-unique pickup token when an order is confirmed, lists order
history, and lets a vendor look up an order by token. Matches exactly
what `orderService.js` in the frontend project expects.

## 1. Database

Uses the same PostgreSQL instance as the Menu Management backend. If
you already have that running:

```
copy .env.example .env
```

and point `DATABASE_URL` at the same database (e.g. `nsu_companion`).
If you haven't set up Postgres yet:

```
docker run --name nsu-postgres -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres
```

⚠️ **Team note:** this project and the Menu Management backend each
have their own `prisma/schema.prisma` right now (`menu_items` here,
`orders`/`order_items` there). That's fine for building each feature
independently, but before merging into one real backend, you'll need
to combine both into a **single shared `schema.prisma`** with one
`prisma migrate` history — otherwise each teammate's migrations will
fight over the same database. Flag this to your group early.

## 2. Install and set up

```
npm install
npx prisma migrate dev --name init
npm run seed
```

`npm run seed` creates 2 sample orders using the real token-generation
path (not fake data), so you can see actual generated tokens like
`RB-4821` in the database.

## 3. Run the server

```
npm run dev
```

Runs on `http://localhost:4001` by default (different port from the
menu backend's `4000`, so you can run both at once locally). Check
`http://localhost:4001/health`.

## 4. Run the unit tests

```
npm test
```

Two test files, no database required:
- `src/services/tokenGenerator.test.js` — token format, stall
  prefixing, fallback prefix, determinism with an injected RNG
- `src/validation/order.test.js` — required fields, item validation,
  rejecting empty/invalid payloads

## API reference

| Method | Path                      | Purpose |
|--------|---------------------------|---------|
| GET    | `/api/orders`             | List all orders, newest first |
| POST   | `/api/orders`              | Confirm an order — generates and returns a unique token (FR-5.1) |
| GET    | `/api/orders/lookup?token=` | Vendor looks up an order by token (FR-5.3); 404 if not found |
| PATCH  | `/api/orders/:id/status`   | Move an order through Received → Preparing → Ready → Completed |

### Why token uniqueness is enforced at the database, not just in code

`token` has a `@unique` constraint in the Prisma schema. When creating
an order, `src/services/orderCreation.js` generates a token, tries to
insert it, and if Postgres rejects it as a duplicate (Prisma error
code `P2002`), it generates a new one and retries — up to 10 times.
This is what makes the "unique" guarantee real even if two students
place orders at the exact same moment; a random check in JavaScript
alone can't guarantee that under concurrent requests.

## Connecting the frontend

In the frontend project's `src/services/orderService.js`:
1. Set `USE_MOCK = false`
2. Set `VITE_API_BASE_URL=http://localhost:4001/api` in a `.env` file
   (note: different port than the menu backend)

No component changes needed — everything already routes through
`orderService.js`.

## Project structure

```
src/
├── app.js
├── server.js
├── routes/orders.routes.js
├── controllers/orders.controller.js
├── services/
│   ├── tokenGenerator.js     # FR-5.1: pure token format logic (unit tested)
│   └── orderCreation.js      # DB-backed uniqueness guarantee + retry
├── validation/order.js       # Pure payload validation (unit tested)
├── middleware/errorHandler.js
└── lib/prisma.js
prisma/
├── schema.prisma             # orders + order_items tables
└── seed.js
```
