import React, { useEffect, useState } from "react";
import "./index.css";

const API_URL = "http://localhost:5000";

const initialVendors = [
  { id: 1, name: "Campus Bites", email: "vendor1@nsu.edu", status: "Active" },
  { id: 2, name: "North Cafe", email: "vendor2@nsu.edu", status: "Active" },
];

const initialStalls = [
  { id: 1, name: "Campus Bites", location: "Main Campus", status: "Open" },
  { id: 2, name: "North Cafe", location: "Food Court", status: "Open" },
];

const initialOrders = [
  {
    id: "ORD-1001",
    customer: "Student One",
    stall: "Campus Bites",
    amount: 450,
    status: "Completed",
  },
  {
    id: "ORD-1002",
    customer: "Student Two",
    stall: "North Cafe",
    amount: 320,
    status: "Preparing",
  },
  {
    id: "ORD-1003",
    customer: "Faculty One",
    stall: "Campus Bites",
    amount: 280,
    status: "Pending",
  },
];

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("nsu_token");

    if (!token) {
      setCheckingAuth(false);
      return;
    }

    fetch(`${API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Session expired.");
        }

        if (data.user?.role !== "ADMIN") {
          throw new Error("Admin access is required.");
        }

        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem("nsu_token");
        setUser(null);
      })
      .finally(() => {
        setCheckingAuth(false);
      });
  }, []);

  const handleLogin = async (email, password) => {
    setLoginError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      if (data.user?.role !== "ADMIN") {
        throw new Error(
          "Access denied. This panel is only for administrators."
        );
      }

      localStorage.setItem("nsu_token", data.token);
      setUser(data.user);
    } catch (error) {
      setLoginError(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("nsu_token");
    localStorage.removeItem("nsu_current_user");
    setUser(null);
  };

  if (checkingAuth) {
    return (
      <div className="admin-login-page">
        <main>
          <section className="panel admin-login-card">
            <h2>Checking authentication...</h2>
            <p>Please wait.</p>
          </section>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <AdminLogin
        onLogin={handleLogin}
        error={loginError}
      />
    );
  }

  return (
    <AdminPanel
      user={user}
      onLogout={handleLogout}
    />
  );
}

function AdminLogin({ onLogin, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="admin-login-page">
      <main>
        <section className="panel admin-login-card">
          <div className="admin-login-head">
            <div className="brand-logo">N</div>

            <h1>NSU Companion</h1>

            <p>Administrator Login</p>
          </div>

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          <form onSubmit={submit}>
            <label>Administrator Email</label>

            <input
              type="email"
              placeholder="admin@nsu.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="primary save-btn"
              style={{ width: "100%" }}
            >
              Login as Administrator
            </button>
          </form>

          <p className="cross-app-link">
            Not an administrator? <a href="/">Go to NSU Companion</a>
          </p>
        </section>
      </main>
    </div>
  );
}

function AdminPanel({ user, onLogout }) {
  const [page, setPage] = useState("dashboard");

  const [vendors, setVendors] = useState(initialVendors);
  const [stalls, setStalls] = useState(initialStalls);
  const [orders, setOrders] = useState(initialOrders);

  const [config, setConfig] = useState({
    campusName: "NSU Companion",
    orderLimit: "10",
    notifications: true,
  });

  const nav = [
    ["dashboard", "📊", "Admin Dashboard"],
    ["vendors", "👥", "Vendor Management"],
    ["stalls", "🏪", "Stall Management"],
    ["orders", "🧾", "Orders & Payments"],
    ["settings", "⚙️", "System Configuration"],
  ];

  return (
    <div className="admin-app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">N</div>

          <div>
            <strong>NSU Companion</strong>
            <span>Admin Panel</span>
          </div>
        </div>

        <div className="nav-title">MANAGEMENT</div>

        {nav.map(([id, icon, label]) => (
          <button
            key={id}
            className={`side-link ${
              page === id ? "active" : ""
            }`}
            onClick={() => setPage(id)}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}

        <div className="sidebar-bottom">
          <div className="admin-user">
            <div className="avatar">
              {user.name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div>
              <strong>{user.name}</strong>
              <small>{user.role}</small>
            </div>
          </div>

          <a className="sidebar-link-btn" href="/">
            ← NSU Companion Home
          </a>

          <button className="small-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <h1>
              {nav.find((n) => n[0] === page)?.[2]}
            </h1>

            <p>
              Manage the NSU Companion system from one place.
            </p>
          </div>

          <div className="header-badge">
            ADMIN
          </div>
        </header>

        {page === "dashboard" && (
          <Dashboard
            orders={orders}
            vendors={vendors}
            stalls={stalls}
          />
        )}

        {page === "vendors" && (
          <VendorManagement
            vendors={vendors}
            setVendors={setVendors}
          />
        )}

        {page === "stalls" && (
          <StallManagement
            stalls={stalls}
            setStalls={setStalls}
          />
        )}

        {page === "orders" && (
          <OrdersPayments
            orders={orders}
            setOrders={setOrders}
          />
        )}

        {page === "settings" && (
          <SystemConfiguration
            config={config}
            setConfig={setConfig}
          />
        )}

        <footer>
          NSU Companion • Admin Management Module
        </footer>
      </main>
    </div>
  );
}

function Dashboard({ orders, vendors, stalls }) {
  const total = orders.reduce(
    (sum, order) => sum + order.amount,
    0
  );

  return (
    <div className="page">
      <div className="stats">
        <Stat
          title="Total Vendors"
          value={vendors.length}
          icon="👥"
        />

        <Stat
          title="Total Stalls"
          value={stalls.length}
          icon="🏪"
        />

        <Stat
          title="Total Orders"
          value={orders.length}
          icon="🧾"
        />

        <Stat
          title="Total Sales"
          value={`৳${total}`}
          icon="৳"
        />
      </div>

      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Recent Orders</h2>

            <p>
              Overview of the latest orders in the system.
            </p>
          </div>
        </div>

        <OrderTable orders={orders} />
      </section>
    </div>
  );
}

function Stat({ title, value, icon }) {
  return (
    <div className="stat">
      <div className="stat-icon">
        {icon}
      </div>

      <div>
        <p>{title}</p>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function VendorManagement({ vendors, setVendors }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const addVendor = (e) => {
    e.preventDefault();

    if (!name || !email) return;

    setVendors([
      ...vendors,
      {
        id: Date.now(),
        name,
        email,
        status: "Active",
      },
    ]);

    setName("");
    setEmail("");
  };

  const toggleStatus = (id) => {
    setVendors(
      vendors.map((v) =>
        v.id === id
          ? {
              ...v,
              status:
                v.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : v
      )
    );
  };

  return (
    <div className="page">
      <section className="panel">
        <div className="panel-head">
          <div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "700",
                lineHeight: "1.2",
                marginBottom: "6px",
              }}
            >
              Vendor Management
            </div>

            <p>
              Add, view, and manage registered vendors.
            </p>
          </div>
        </div>

        <form
          className="inline-form"
          onSubmit={addVendor}
        >
          <input
            placeholder="Vendor name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            type="email"
            placeholder="Vendor email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <button
            className="primary"
            type="submit"
          >
            Add Vendor
          </button>
        </form>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Vendor</th>
                <th>Email</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {vendors.map((v) => (
                <tr key={v.id}>
                  <td>#{v.id}</td>

                  <td>
                    <strong>{v.name}</strong>
                  </td>

                  <td>{v.email}</td>

                  <td>
                    <Status value={v.status} />
                  </td>

                  <td>
                    <button
                      className="small-btn"
                      onClick={() =>
                        toggleStatus(v.id)
                      }
                    >
                      Change Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StallManagement({ stalls, setStalls }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const addStall = (e) => {
    e.preventDefault();

    if (!name || !location) return;

    setStalls([
      ...stalls,
      {
        id: Date.now(),
        name,
        location,
        status: "Open",
      },
    ]);

    setName("");
    setLocation("");
  };

  const toggleStall = (id) => {
    setStalls(
      stalls.map((s) =>
        s.id === id
          ? {
              ...s,
              status:
                s.status === "Open"
                  ? "Closed"
                  : "Open",
            }
          : s
      )
    );
  };

  return (
    <div className="page">
      <section className="panel">
        <div className="panel-head">
          <div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "700",
                lineHeight: "1.2",
                marginBottom: "6px",
              }}
            >
              Stall Management
            </div>

            <p>
              Create and manage campus food stalls.
            </p>
          </div>
        </div>

        <form
          className="inline-form"
          onSubmit={addStall}
        >
          <input
            placeholder="Stall name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            placeholder="Location"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
          />

          <button
            className="primary"
            type="submit"
          >
            Add Stall
          </button>
        </form>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Stall</th>
                <th>Location</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {stalls.map((s) => (
                <tr key={s.id}>
                  <td>#{s.id}</td>

                  <td>
                    <strong>{s.name}</strong>
                  </td>

                  <td>{s.location}</td>

                  <td>
                    <Status value={s.status} />
                  </td>

                  <td>
                    <button
                      className="small-btn"
                      onClick={() =>
                        toggleStall(s.id)
                      }
                    >
                      Open / Close
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function OrdersPayments({ orders, setOrders }) {
  const updateStatus = (id, status) => {
    setOrders(
      orders.map((o) =>
        o.id === id
          ? { ...o, status }
          : o
      )
    );
  };

  return (
    <div className="page">
      <section className="panel">
        <div className="panel-head">
          <div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "700",
                lineHeight: "1.2",
                marginBottom: "6px",
              }}
            >
              Orders & Payments
            </div>

            <p>
              Review orders and their payment-related information.
            </p>
          </div>
        </div>

        <OrderTable
          orders={orders}
          showActions
          updateStatus={updateStatus}
        />
      </section>
    </div>
  );
}

function OrderTable({
  orders,
  showActions = false,
  updateStatus,
}) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Stall</th>
            <th>Amount</th>
            <th>Status</th>
            {showActions && <th>Update</th>}
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>
                <strong>{o.id}</strong>
              </td>

              <td>{o.customer}</td>
              <td>{o.stall}</td>
              <td>৳{o.amount}</td>

              <td>
                <Status value={o.status} />
              </td>

              {showActions && (
                <td>
                  <select
                    className="status-select"
                    value={o.status}
                    onChange={(e) =>
                      updateStatus(
                        o.id,
                        e.target.value
                      )
                    }
                  >
                    <option>Pending</option>
                    <option>Preparing</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Status({ value }) {
  const className = value
    .toLowerCase()
    .replace(" ", "-");

  return (
    <span className={`status ${className}`}>
      {value}
    </span>
  );
}

function SystemConfiguration({
  config,
  setConfig,
}) {
  const [saved, setSaved] = useState(false);

  const save = (e) => {
    e.preventDefault();

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <div className="page">
      <section className="panel settings-panel">
        <div className="panel-head">
          <div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "700",
                lineHeight: "1.2",
                marginBottom: "6px",
              }}
            >
              System Configuration
            </div>

            <p>
              Configure general system settings.
            </p>
          </div>
        </div>

        <form onSubmit={save}>
          <label>System Name</label>

          <input
            value={config.campusName}
            onChange={(e) =>
              setConfig({
                ...config,
                campusName: e.target.value,
              })
            }
          />

          <label>
            Maximum Items Per Order
          </label>

          <input
            type="number"
            min="1"
            value={config.orderLimit}
            onChange={(e) =>
              setConfig({
                ...config,
                orderLimit: e.target.value,
              })
            }
          />

          <label className="switch-row">
            <input
              type="checkbox"
              checked={config.notifications}
              onChange={(e) =>
                setConfig({
                  ...config,
                  notifications:
                    e.target.checked,
                })
              }
            />

            Enable system notifications
          </label>

          <button
            type="submit"
            className="primary save-btn"
          >
            Save Configuration
          </button>

          {saved && (
            <div className="saved">
              ✓ Configuration saved successfully.
            </div>
          )}
        </form>
      </section>
    </div>
  );
}

export default App;