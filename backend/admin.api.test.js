import { describe, it, expect } from "vitest";

const BASE_URL = process.env.BACKEND_URL || "http://localhost:5000";
const ADMIN_EMAIL = "admin@northsouth.edu";
const ADMIN_PASSWORD = "Admin123!";
const STUDENT_EMAIL = "student1@northsouth.edu";
const STUDENT_PASSWORD = "Student123!";

async function api(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let body = {};
  const text = await response.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = { raw: text };
    }
  }

  return { status: response.status, body };
}

async function login(email, password) {
  const result = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  expect(result.status).toBe(200);
  expect(result.body.token).toBeTruthy();
  return result.body.token;
}

describe("Admin Management - Backend API", () => {
  it("returns 401 when admin dashboard is requested without authentication", async () => {
    const result = await api("/api/admin/dashboard");
    expect(result.status).toBe(401);
  });

  it("returns 403 when a valid student token accesses admin dashboard", async () => {
    const token = await login(STUDENT_EMAIL, STUDENT_PASSWORD);

    const result = await api("/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(result.status).toBe(403);
    expect(result.body.message).toBe("Admin access is required.");
  });

  it("allows an admin to access the dashboard", async () => {
    const token = await login(ADMIN_EMAIL, ADMIN_PASSWORD);

    const result = await api("/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(result.status).toBe(200);
    expect(result.body.message).toBe("Admin dashboard endpoint is working.");
  });

  it("returns the real admin resource counts on the dashboard", async () => {
    const token = await login(ADMIN_EMAIL, ADMIN_PASSWORD);

    const result = await api("/api/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(result.status).toBe(200);
    expect(result.body.stats.vendors).toBeGreaterThanOrEqual(2);
    expect(result.body.stats.stalls).toBeGreaterThanOrEqual(2);
    expect(result.body.stats.orders).toBeGreaterThanOrEqual(3);
  });

  it.each(["Pending", "Preparing", "Completed"])(
    "accepts valid order status: %s",
    async (status) => {
      const token = await login(ADMIN_EMAIL, ADMIN_PASSWORD);

      const result = await api("/api/admin/orders/ORD-1002/status", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });

      expect(result.status).toBe(200);
      expect(result.body.status).toBe(status);
    },
  );

  it.each(["Cancelled", "", "Random"])(
    "rejects invalid order status: %s",
    async (status) => {
      const token = await login(ADMIN_EMAIL, ADMIN_PASSWORD);

      const result = await api("/api/admin/orders/ORD-1002/status", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });

      expect(result.status).toBe(400);
      expect(result.body.message).toBe("Invalid order status.");
    },
  );

  it("returns 404 for a nonexistent order", async () => {
    const token = await login(ADMIN_EMAIL, ADMIN_PASSWORD);

    const result = await api("/api/admin/orders/DOES-NOT-EXIST/status", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: "Completed" }),
    });

    expect(result.status).toBe(404);
    expect(result.body.message).toBe("Order not found.");
  });

  it("returns the configured admin resources", async () => {
    const token = await login(ADMIN_EMAIL, ADMIN_PASSWORD);

    const [vendors, stalls, orders, config] = await Promise.all([
      api("/api/admin/vendors", { headers: { Authorization: `Bearer ${token}` } }),
      api("/api/admin/stalls", { headers: { Authorization: `Bearer ${token}` } }),
      api("/api/admin/orders", { headers: { Authorization: `Bearer ${token}` } }),
      api("/api/admin/config", { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    expect(vendors.status).toBe(200);
    expect(vendors.body.length).toBeGreaterThanOrEqual(2);

    expect(stalls.status).toBe(200);
    expect(stalls.body.length).toBeGreaterThanOrEqual(2);

    expect(orders.status).toBe(200);
    expect(orders.body.length).toBeGreaterThanOrEqual(3);

    expect(config.status).toBe(200);
    expect(config.body).toEqual({
      campusName: "NSU Companion",
      orderLimit: "10",
      notifications: true,
    });
  });

  it("creates a vendor using the valid equivalence class", async () => {
    const token = await login(ADMIN_EMAIL, ADMIN_PASSWORD);

    const result = await api("/api/admin/vendors", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: "Unit Test Vendor",
        email: "unit-test-vendor@nsu.edu",
      }),
    });

    expect(result.status).toBe(201);
    expect(result.body.name).toBe("Unit Test Vendor");
    expect(result.body.email).toBe("unit-test-vendor@nsu.edu");
    expect(result.body.status).toBe("Active");
  });

  it("rejects a vendor when required fields are missing", async () => {
    const token = await login(ADMIN_EMAIL, ADMIN_PASSWORD);

    const result = await api("/api/admin/vendors", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: "Incomplete Vendor" }),
    });

    expect(result.status).toBe(400);
  });

  it("creates a stall using the valid equivalence class", async () => {
    const token = await login(ADMIN_EMAIL, ADMIN_PASSWORD);

    const result = await api("/api/admin/stalls", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: "Unit Test Stall",
        location: "Library",
      }),
    });

    expect(result.status).toBe(201);
    expect(result.body.name).toBe("Unit Test Stall");
    expect(result.body.location).toBe("Library");
    expect(result.body.status).toBe("Open");
  });

  it("rejects a stall when required fields are missing", async () => {
    const token = await login(ADMIN_EMAIL, ADMIN_PASSWORD);

    const result = await api("/api/admin/stalls", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: "Incomplete Stall" }),
    });

    expect(result.status).toBe(400);
  });
});
