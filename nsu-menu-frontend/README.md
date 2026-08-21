# NSU Companion — Digital Menu Management (Frontend)

Frontend for FR-2.1–FR-2.4 (add/edit/remove items, toggle availability,
live menu display, search & filter). Runs entirely on mock data until
the backend is ready — nothing in the UI needs to change when you
connect it.

## Run it (Windows 11 + VSCode)

1. Install [Node.js LTS](https://nodejs.org/) if you don't have it (18+ recommended).
2. Open this folder in VSCode.
3. Open a terminal in VSCode (`` Ctrl+` ``) and run:

   ```
   npm install
   npm run dev
   ```

4. Open the URL it prints (usually `http://localhost:5173`).

You should see the menu dashboard with 6 sample items. Try adding,
editing, deleting, toggling availability, searching, and filtering —
all of it works against in-memory mock data right now.

## Project structure

```
src/
├── components/       # Presentational UI pieces
├── data/
│   └── mockMenuItems.js   # Stand-in for the `menu_items` DB table
├── services/
│   └── menuService.js     # ← the ONLY file to edit when the backend is ready
├── hooks/
│   └── useMenuItems.js    # Loading state, CRUD calls, search/filter logic
└── App.jsx
```

## Connecting to the real backend later

1. In `src/services/menuService.js`, set `USE_MOCK = false`.
2. Set `VITE_API_BASE_URL` in a `.env` file (defaults to
   `http://localhost:4000/api`) to match wherever Express is running.
3. Make sure the backend exposes:
   - `GET /api/menu`
   - `POST /api/menu`
   - `PUT /api/menu/:id`
   - `DELETE /api/menu/:id`
4. For live updates (FR-2.3), uncomment the Socket.IO block at the
   bottom of `menuService.js` and call `subscribeToMenuUpdates()` from
   `useMenuItems.js` inside a `useEffect`.

No component files need to change for this swap — that's the point of
routing everything through `menuService.js`.
