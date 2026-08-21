# NSU Companion — Order Token Generation (Frontend)

Frontend for FR-5.1–FR-5.3: generate a unique pickup token right after
payment confirmation, show it to the student (confirmation screen +
order history), and let a vendor look up an order by token at pickup.
Runs on mock data until the backend is ready.

## Run it (Windows 11 + VSCode)

```
npm install
npm run dev
```

Open `http://localhost:5173`. Use the **Order confirmation** tab and
click "Simulate payment confirmed" to generate a token (this stands in
for your teammate's checkout/payment feature until it's wired up).
Check **Order history** to see past tokens, and **Vendor lookup** to
search an order by its token.

## Run the unit tests

```
npm test
```

`src/services/tokenGenerator.test.js` covers the token format, stall
prefixing, determinism with an injected RNG, and uniqueness across
many generated tokens — this is a good candidate for your one required
unit test, since it's pure logic with no server or mocking needed.

## Project structure

```
src/
├── components/
│   ├── OrderConfirmation.jsx   # FR-5.2: big token on confirmation screen
│   ├── OrderHistoryList.jsx    # FR-5.2: token shown in order history
│   ├── TokenLookup.jsx         # FR-5.3: vendor looks up order by token
│   └── SimulateOrderForm.jsx   # demo-only stand-in for the payment step
├── services/
│   ├── tokenGenerator.js       # FR-5.1: pure token generation logic
│   └── orderService.js         # ← the ONLY file to edit when the backend is ready
├── data/
│   └── mockOrders.js           # stand-in for the `orders` table
└── hooks/
    ├── useOrders.js
    └── useTokenLookup.js
```

## Connecting to the real backend later

1. In `src/services/orderService.js`, set `USE_MOCK = false`.
2. Set `VITE_API_BASE_URL` in a `.env` file if it's not
   `http://localhost:4000/api`.
3. Backend should expose:
   - `GET /api/orders`
   - `POST /api/orders` — call this right after the payment gateway's
     success callback (FR-4.3); the response must include the
     generated `token`
   - `GET /api/orders/lookup?token=...` — return 404 if not found
4. Decide with your teammate doing Payment Integration whether token
   generation happens in *their* endpoint or in a shared "confirm
   order" endpoint — either way, `tokenGenerator.js`'s logic is what
   the backend should mirror (or you can port it directly into the
   Node backend, since it's plain JS with no browser dependencies).

No component needs to change for this swap — everything routes
through `orderService.js`.
