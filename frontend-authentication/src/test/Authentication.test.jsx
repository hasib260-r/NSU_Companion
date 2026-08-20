import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  cleanup,
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

function createResponse(data, ok = true) {
  return Promise.resolve({
    ok,
    json: async () => data,
  });
}

describe("Authentication - React frontend", () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = vi.fn(() => createResponse({}));
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("shows the Login page by default", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Login" })
    ).toBeInTheDocument();
  });

  it("navigates to the Register page and back to Login", async () => {
    const user = userEvent.setup();
    render(<App />);

    const nav = screen.getByRole("banner");

    await user.click(within(nav).getByRole("button", { name: "Register" }));

    expect(
      screen.getByRole("heading", { name: "Create Account" })
    ).toBeInTheDocument();

    await user.click(within(nav).getByRole("button", { name: "Login" }));

    expect(
      screen.getByRole("heading", { name: "Login" })
    ).toBeInTheDocument();
  });

  it("registers a new account and returns to the Login page", async () => {
    const user = userEvent.setup();

    global.fetch.mockImplementation((url) => {
      if (url.endsWith("/api/auth/register")) {
        return createResponse({ message: "Registration successful." });
      }
      return createResponse({});
    });

    render(<App />);

    await user.click(
      within(screen.getByRole("banner")).getByRole("button", {
        name: "Register",
      })
    );

    await user.type(
      screen.getByPlaceholderText("Enter your full name"),
      "Jane Doe"
    );
    await user.type(
      screen.getByPlaceholderText("example@northsouth.edu"),
      "jane@northsouth.edu"
    );
    await user.type(
      screen.getByPlaceholderText("Create a password"),
      "secret123"
    );

    await user.click(
      screen.getByRole("button", { name: "Create Account" })
    );

    expect(
      await screen.findByRole("heading", { name: "Login" })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Registration successful.")
    ).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledWith(
      "http://localhost:5000/api/auth/register",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("shows a message when registration fails", async () => {
    const user = userEvent.setup();

    global.fetch.mockImplementation((url) => {
      if (url.endsWith("/api/auth/register")) {
        return createResponse(
          { message: "An account with this email already exists." },
          false
        );
      }
      return createResponse({});
    });

    render(<App />);

    await user.click(
      within(screen.getByRole("banner")).getByRole("button", {
        name: "Register",
      })
    );

    await user.type(
      screen.getByPlaceholderText("Enter your full name"),
      "Jane Doe"
    );
    await user.type(
      screen.getByPlaceholderText("example@northsouth.edu"),
      "jane@northsouth.edu"
    );
    await user.type(
      screen.getByPlaceholderText("Create a password"),
      "secret123"
    );

    await user.click(
      screen.getByRole("button", { name: "Create Account" })
    );

    expect(
      await screen.findByText(
        "An account with this email already exists."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Create Account" })
    ).toBeInTheDocument();
  });

  it("logs in successfully and shows the home page", async () => {
    const user = userEvent.setup();

    global.fetch.mockImplementation((url) => {
      if (url.endsWith("/api/auth/login")) {
        return createResponse({
          message: "Login successful.",
          token: "fake-token",
          user: {
            id: 3,
            name: "Sajida Student",
            email: "student1@northsouth.edu",
            role: "STUDENT",
          },
        });
      }
      return createResponse({});
    });

    render(<App />);

    const main = screen.getByRole("main");

    await user.type(
      screen.getByPlaceholderText("example@northsouth.edu"),
      "student1@northsouth.edu"
    );
    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "Student123!"
    );

    await user.click(
      within(main).getByRole("button", { name: "Login" })
    );

    expect(
      await screen.findByRole("heading", {
        name: "Welcome, Sajida Student",
      })
    ).toBeInTheDocument();

    expect(localStorage.getItem("nsu_token")).toBe("fake-token");

    expect(
      screen.queryByRole("link", { name: "Open Admin Panel" })
    ).not.toBeInTheDocument();
  });

  it("shows the Admin Panel link on the home page for admin accounts", async () => {
    const user = userEvent.setup();

    global.fetch.mockImplementation((url) => {
      if (url.endsWith("/api/auth/login")) {
        return createResponse({
          message: "Login successful.",
          token: "fake-admin-token",
          user: {
            id: 1,
            name: "System Admin",
            email: "admin@northsouth.edu",
            role: "ADMIN",
          },
        });
      }
      return createResponse({});
    });

    render(<App />);

    const main = screen.getByRole("main");

    await user.type(
      screen.getByPlaceholderText("example@northsouth.edu"),
      "admin@northsouth.edu"
    );
    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "Admin123!"
    );

    await user.click(
      within(main).getByRole("button", { name: "Login" })
    );

    const adminLink = await screen.findByRole("link", {
      name: "Open Admin Panel",
    });

    expect(adminLink).toHaveAttribute("href", "/admin/");
  });

  it("shows an error message when login fails", async () => {
    const user = userEvent.setup();

    global.fetch.mockImplementation((url) => {
      if (url.endsWith("/api/auth/login")) {
        return createResponse(
          { message: "Invalid email or password." },
          false
        );
      }
      return createResponse({});
    });

    render(<App />);

    const main = screen.getByRole("main");

    await user.type(
      screen.getByPlaceholderText("example@northsouth.edu"),
      "wrong@northsouth.edu"
    );
    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "wrongpass"
    );

    await user.click(
      within(main).getByRole("button", { name: "Login" })
    );

    expect(
      await screen.findByText("Invalid email or password.")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Login" })
    ).toBeInTheDocument();
  });

  it("logs out and shows the Logout confirmation page", async () => {
    const user = userEvent.setup();

    global.fetch.mockImplementation((url) => {
      if (url.endsWith("/api/auth/login")) {
        return createResponse({
          message: "Login successful.",
          token: "fake-token",
          user: {
            id: 3,
            name: "Sajida Student",
            email: "student1@northsouth.edu",
            role: "STUDENT",
          },
        });
      }
      if (url.endsWith("/api/auth/logout")) {
        return createResponse({ message: "Logout successful." });
      }
      return createResponse({});
    });

    render(<App />);

    const main = screen.getByRole("main");

    await user.type(
      screen.getByPlaceholderText("example@northsouth.edu"),
      "student1@northsouth.edu"
    );
    await user.type(
      screen.getByPlaceholderText("Enter your password"),
      "Student123!"
    );

    await user.click(
      within(main).getByRole("button", { name: "Login" })
    );

    await screen.findByRole("heading", {
      name: "Welcome, Sajida Student",
    });

    await user.click(
      within(screen.getByRole("main")).getByRole("button", {
        name: "Logout",
      })
    );

    expect(
      await screen.findByRole("heading", { name: "Logged Out" })
    ).toBeInTheDocument();

    expect(localStorage.getItem("nsu_token")).toBeNull();
    expect(localStorage.getItem("nsu_current_user")).toBeNull();
  });

  it("links to the Admin Panel from the login screen", () => {
    render(<App />);

    const link = screen.getByRole("link", {
      name: "Go to Admin Panel",
    });

    expect(link).toHaveAttribute("href", "/admin/");
  });
});
