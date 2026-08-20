import React, { useState } from "react";
import "./index.css";

function App() {
  const [page, setPage] = useState("login");
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("nsu_current_user") || "null");
    } catch {
      return null;
    }
  });
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:5000/api";

  const register = async (name, email, password, role) => {
    try {
      setMessage("");

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed.");
        return;
      }

      setMessage(data.message || "Registration successful. Please log in.");
      setPage("login");
    } catch (error) {
      console.error(error);
      setMessage(
        "Cannot connect to the backend. Make sure the backend is running on port 5000."
      );
    }
  };

  const login = async (email, password) => {
    try {
      setMessage("");

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Invalid email or password.");
        return;
      }

      localStorage.setItem("nsu_token", data.token);
      localStorage.setItem("nsu_current_user", JSON.stringify(data.user));

      setCurrentUser(data.user);
      setMessage(data.message || `Welcome, ${data.user.name}!`);
      setPage("home");
    } catch (error) {
      console.error(error);
      setMessage(
        "Cannot connect to the backend. Make sure the backend is running on port 5000."
      );
    }
  };

  const logout = async () => {
    const token = localStorage.getItem("nsu_token");

    try {
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("nsu_token");
      localStorage.removeItem("nsu_current_user");
      setCurrentUser(null);
      setMessage("You have been logged out.");
      setPage("logout");
    }
  };

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>NSU Companion</h1>
          <p>Authentication</p>
        </div>
        <nav>
          <button onClick={() => { setMessage(""); setPage("login"); }}>Login</button>
          <button onClick={() => { setMessage(""); setPage("register"); }}>Register</button>
          {currentUser && (
            <button onClick={logout}>Logout</button>
          )}
        </nav>
      </header>

      <main className="container">
        {message && <div className="message">{message}</div>}

        {page === "login" && (
          <LoginPage
            onLogin={login}
            onRegister={() => { setMessage(""); setPage("register"); }}
          />
        )}

        {page === "register" && (
          <RegisterPage
            onRegister={register}
            onLogin={() => { setMessage(""); setPage("login"); }}
          />
        )}

        {page === "home" && currentUser && (
          <HomePage user={currentUser} onLogout={logout} />
        )}

        {page === "logout" && (
          <LogoutPage
            onLogin={() => { setMessage(""); setPage("login"); }}
          />
        )}
      </main>

      <footer>NSU Companion • User Authentication Module</footer>
    </div>
  );
}

function LoginPage({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <section className="card auth-card">
      <div className="icon">🔐</div>
      <h2>Login</h2>
      <p className="muted">Sign in to your NSU Companion account.</p>

      <form onSubmit={(e) => { e.preventDefault(); onLogin(email, password); }}>
        <label>University Email</label>
        <input
          type="email"
          placeholder="example@northsouth.edu"
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

        <button className="primary full">Login</button>
      </form>

      <p className="bottom-text">
        Don't have an account?{" "}
        <button className="link" onClick={onRegister}>Register</button>
      </p>

      <p className="bottom-text">
        Administrator? <a href="/admin/">Go to Admin Panel</a>
      </p>
    </section>
  );
}

function RegisterPage({ onRegister, onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");

  return (
    <section className="card auth-card">
      <div className="icon">👤</div>
      <h2>Create Account</h2>
      <p className="muted">Register using your university account information.</p>

      <form onSubmit={(e) => {
        e.preventDefault();
        onRegister(name, email, password, role);
      }}>
        <label>Full Name</label>
        <input
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>University Email</label>
        <input
          type="email"
          placeholder="example@northsouth.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="STUDENT">Student</option>
          <option value="FACULTY">Faculty</option>
        </select>

        <label>Password</label>
        <input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength="6"
          required
        />

        <button className="primary full">Create Account</button>
      </form>

      <p className="bottom-text">
        Already have an account?{" "}
        <button className="link" onClick={onLogin}>Login</button>
      </p>
    </section>
  );
}

function HomePage({ user, onLogout }) {
  return (
    <section className="card">
      <div className="success-icon">✓</div>
      <h2>Welcome, {user.name}</h2>
      <p className="muted">You are successfully logged in.</p>

      <div className="profile-box">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      {user.role === "ADMIN" && (
        <a className="primary full admin-link" href="/admin/">
          Open Admin Panel
        </a>
      )}

      <button className="danger full" onClick={onLogout}>Logout</button>
    </section>
  );
}

function LogoutPage({ onLogin }) {
  return (
    <section className="card auth-card">
      <div className="success-icon">✓</div>
      <h2>Logged Out</h2>
      <p className="muted">Your session has been ended successfully.</p>
      <button className="primary full" onClick={onLogin}>Return to Login</button>
    </section>
  );
}

export default App;