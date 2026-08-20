require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pool = require("./db");
const vendors = require("./data/vendors");
const stalls = require("./data/stalls");
const orders = require("./data/orders");
const config = require("./data/config");

const app = express();
const PORT = process.env.PORT || 5000;

const JWT_SECRET =
  process.env.JWT_SECRET || "nsu-companion-development-secret";

app.use(cors());
app.use(express.json());

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.full_name,
    email: user.email,
    role: user.role,
    createdAt: user.created_at,
  };
}

async function findUserByEmail(email) {
  const result = await pool.query(
    "SELECT * FROM users WHERE LOWER(email) = LOWER($1)",
    [email]
  );

  return result.rows[0];
}

async function findUserById(id) {
  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );

  return result.rows[0];
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";

  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication token is required.",
    });
  }

  const token = header.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.auth = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
}

async function adminMiddleware(req, res, next) {
  const user = await findUserById(req.auth.id);

  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Admin access is required.",
    });
  }

  next();
}

app.get("/", (req, res) => {
  res.json({
    message: "NSU Companion Backend is running",
  });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message:
          "Name, email, password and role are required.",
      });
    }

    const allowedRoles = ["STUDENT", "FACULTY"];
    const normalizedRole = String(role).toUpperCase();

    if (!allowedRoles.includes(normalizedRole)) {
      return res.status(400).json({
        message: "Role must be one of: Student, Faculty.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters.",
      });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        message:
          "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(
      password,
      10
    );

    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        name.trim(),
        email.trim().toLowerCase(),
        passwordHash,
        normalizedRole,
      ]
    );

    const newUser = result.rows[0];

    return res.status(201).json({
      message: "Registration successful.",
      user: publicUser(newUser),
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      message: "Server error during registration.",
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required.",
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message:
          "Invalid email or password.",
      });
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordCorrect) {
      return res.status(401).json({
        message:
          "Invalid email or password.",
      });
    }

    const token = createToken(user);

    return res.json({
      message: "Login successful.",
      token: token,
      user: publicUser(user),
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Server error during login.",
    });
  }
});

app.get(
  "/api/auth/me",
  authMiddleware,
  async (req, res) => {

    const user = await findUserById(
      req.auth.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    res.json({
      user: publicUser(user),
    });
  }
);

app.post(
  "/api/auth/logout",
  authMiddleware,
  (req, res) => {

    res.json({
      message: "Logout successful.",
    });
  }
);

app.get(
  "/api/admin/dashboard",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {

    const userCount = await pool.query(
      "SELECT COUNT(*) FROM users"
    );

    res.json({
      message:
        "Admin dashboard endpoint is working.",

      stats: {
        users: Number(userCount.rows[0].count),
       vendors: vendors.length,
       stalls: stalls.length,
       orders: orders.length,
      },
    });
  }
);

app.get(
  "/api/admin/vendors",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.json(vendors);
  }
);
app.post(
  "/api/admin/vendors",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Vendor name and email are required.",
      });
    }

    const newVendor = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      status: "Active",
    };

    vendors.push(newVendor);

    res.status(201).json(newVendor);
  }
);
app.patch(
  "/api/admin/vendors/:id/status",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    const vendor = vendors.find(
      (v) => String(v.id) === String(req.params.id)
    );

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found.",
      });
    }

    vendor.status =
      vendor.status === "Active" ? "Inactive" : "Active";

    res.json(vendor);
  }
);

app.get(
  "/api/admin/stalls",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.json(stalls);
  }
);

app.post(
  "/api/admin/stalls",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    const { name, location } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        message: "Stall name and location are required.",
      });
    }

    const newStall = {
      id: stalls.length
        ? Math.max(...stalls.map((stall) => stall.id)) + 1
        : 1,
      name,
      location,
      status: "Open",
    };

    stalls.push(newStall);

    res.status(201).json(newStall);
  }
);

app.patch(
  "/api/admin/stalls/:id/status",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    const id = Number(req.params.id);

    const stall = stalls.find((stall) => stall.id === id);

    if (!stall) {
      return res.status(404).json({
        message: "Stall not found.",
      });
    }

    stall.status =
      stall.status === "Open" ? "Closed" : "Open";

    res.json(stall);
  }
);

app.get(
  "/api/admin/orders",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.json(orders);
  }
);

app.patch(
  "/api/admin/orders/:id/status",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    const order = orders.find(
      (order) => String(order.id) === String(req.params.id)
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Preparing",
      "Completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status.",
      });
    }

    order.status = status;

    res.json(order);
  }
);

app.get(
  "/api/admin/config",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.json(config);
  }
);

app.use((req, res) => {
  res.status(404).json({
    message:
      `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});
