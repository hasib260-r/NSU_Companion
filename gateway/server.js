const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const PORT = process.env.GATEWAY_PORT || 3000;

const BACKEND_URL = "http://localhost:5000";
const AUTH_APP_URL = "http://localhost:5173";
const ADMIN_APP_URL = "http://localhost:5174";

const app = express();

app.use((req, res, next) => {
  if (req.path === "/admin") {
    return res.redirect(308, "/admin/");
  }
  next();
});

const apiProxy = createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
});

const adminProxy = createProxyMiddleware({
  target: ADMIN_APP_URL,
  changeOrigin: true,
  ws: true,
});

const authProxy = createProxyMiddleware({
  target: AUTH_APP_URL,
  changeOrigin: true,
  ws: true,
});

app.use("/api", apiProxy);
app.use("/admin", adminProxy);
app.use("/", authProxy);

const server = app.listen(PORT, () => {
  console.log(`Gateway running on http://localhost:${PORT}`);
  console.log(`  /        -> Authentication app (${AUTH_APP_URL})`);
  console.log(`  /admin   -> Admin Management app (${ADMIN_APP_URL})`);
  console.log(`  /api     -> Backend (${BACKEND_URL})`);
});

server.on("upgrade", (req, socket, head) => {
  if (req.url.startsWith("/admin")) {
    adminProxy.upgrade(req, socket, head);
  } else {
    authProxy.upgrade(req, socket, head);
  }
});
