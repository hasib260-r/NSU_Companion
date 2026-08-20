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

const mockUser = {
  id: 1,
  name: "Test Administrator",
  email: "admin@nsu.edu",
  role: "ADMIN",
};

const mockVendors = [
  {
    id: 1,
    name: "Campus Bites",
    email: "vendor1@nsu.edu",
    status: "Active",
  },
  {
    id: 2,
    name: "North Cafe",
    email: "vendor2@nsu.edu",
    status: "Active",
  },
];

const mockStalls = [
  {
    id: 1,
    name: "Campus Bites",
    location: "Main Campus",
    status: "Open",
  },
  {
    id: 2,
    name: "North Cafe",
    location: "Food Court",
    status: "Open",
  },
];

const mockOrders = [
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

function createResponse(data, ok = true) {
  return Promise.resolve({
    ok,
    json: async () => data,
  });
}

describe("Admin Management - React frontend", () => {
  beforeEach(() => {
    localStorage.setItem("nsu_token", "test-admin-token");

    global.fetch = vi.fn((url, options = {}) => {
      if (url.endsWith("/api/auth/me")) {
        return createResponse({
          user: mockUser,
        });
      }

      if (url.endsWith("/api/admin/vendors")) {
        if (options.method === "POST") {
          const body = JSON.parse(options.body);

          return createResponse({
            id: 3,
            name: body.name,
            email: body.email,
            status: "Active",
          });
        }

        return createResponse(mockVendors);
      }

      if (url.endsWith("/api/admin/stalls")) {
        if (options.method === "POST") {
          const body = JSON.parse(options.body);

          return createResponse({
            id: 3,
            name: body.name,
            location: body.location,
            status: "Open",
          });
        }

        return createResponse(mockStalls);
      }

      if (url.endsWith("/api/admin/orders")) {
        return createResponse(mockOrders);
      }

      if (
        url.includes("/api/admin/vendors/") &&
        url.endsWith("/status")
      ) {
        const id = Number(
          url.split("/api/admin/vendors/")[1].split("/")[0]
        );

        const vendor = mockVendors.find(
          (item) => item.id === id
        );

        return createResponse({
          ...vendor,
          status:
            vendor.status === "Active"
              ? "Inactive"
              : "Active",
        });
      }

      if (
        url.includes("/api/admin/stalls/") &&
        url.endsWith("/status")
      ) {
        const id = Number(
          url.split("/api/admin/stalls/")[1].split("/")[0]
        );

        const stall = mockStalls.find(
          (item) => item.id === id
        );

        return createResponse({
          ...stall,
          status:
            stall.status === "Open"
              ? "Closed"
              : "Open",
        });
      }

      if (
        url.includes("/api/admin/orders/") &&
        url.endsWith("/status")
      ) {
        const id = url
          .split("/api/admin/orders/")[1]
          .split("/")[0];

        const body = JSON.parse(options.body);

        const order = mockOrders.find(
          (item) => item.id === id
        );

        return createResponse({
          ...order,
          status: body.status,
        });
      }

      return createResponse({});
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("shows the Admin Dashboard by default", async () => {
    render(<App />);

    expect(
      await screen.findByRole("heading", {
        name: "Admin Dashboard",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Total Vendors")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Total Stalls")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Total Orders")
    ).toBeInTheDocument();

    expect(
      screen.getByText("৳1050")
    ).toBeInTheDocument();
  });

  it("navigates to Vendor Management and displays the initial vendors", async () => {
    const user = userEvent.setup();

    render(<App />);

    await screen.findByRole("heading", {
      name: "Admin Dashboard",
    });

    await user.click(
      screen.getByRole("button", {
        name: /Vendor Management/i,
      })
    );

    expect(
      screen.getByRole("heading", {
        name: "Vendor Management",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Campus Bites")
    ).toBeInTheDocument();

    expect(
      screen.getByText("North Cafe")
    ).toBeInTheDocument();
  });

  it("adds a vendor when valid data is submitted", async () => {
    const user = userEvent.setup();

    render(<App />);

    await screen.findByRole("heading", {
      name: "Admin Dashboard",
    });

    await user.click(
      screen.getByRole("button", {
        name: /Vendor Management/i,
      })
    );

    await user.type(
      screen.getByPlaceholderText("Vendor name"),
      "Test Vendor"
    );

    await user.type(
      screen.getByPlaceholderText("Vendor email"),
      "testvendor@nsu.edu"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Add Vendor",
      })
    );

    expect(
      screen.getByText("Test Vendor")
    ).toBeInTheDocument();

    expect(
      screen.getByText("testvendor@nsu.edu")
    ).toBeInTheDocument();
  });

  it("does not add a vendor when required data is missing", async () => {
    const user = userEvent.setup();

    render(<App />);

    await screen.findByRole("heading", {
      name: "Admin Dashboard",
    });

    await user.click(
      screen.getByRole("button", {
        name: /Vendor Management/i,
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: "Add Vendor",
      })
    );

    expect(
      screen.queryByText("Test Vendor")
    ).not.toBeInTheDocument();

    expect(
      screen.getAllByRole("row")
    ).toHaveLength(3);
  });

  it("toggles vendor status", async () => {
    const user = userEvent.setup();

    render(<App />);

    await screen.findByRole("heading", {
      name: "Admin Dashboard",
    });

    await user.click(
      screen.getByRole("button", {
        name: /Vendor Management/i,
      })
    );

    const rows = screen.getAllByRole("row");

    const campusRow = rows.find((row) =>
      within(row).queryByText("Campus Bites")
    );

    expect(campusRow).toBeTruthy();

    expect(
      within(campusRow).getByText("Active")
    ).toBeInTheDocument();

    await user.click(
      within(campusRow).getByRole("button", {
        name: "Change Status",
      })
    );

    expect(
      await within(campusRow).findByText("Inactive")
    ).toBeInTheDocument();
  });

  it("navigates to Stall Management and adds a valid stall", async () => {
    const user = userEvent.setup();

    render(<App />);

    await screen.findByRole("heading", {
      name: "Admin Dashboard",
    });

    await user.click(
      screen.getByRole("button", {
        name: /Stall Management/i,
      })
    );

    expect(
      screen.getByRole("heading", {
        name: "Stall Management",
      })
    ).toBeInTheDocument();

    await user.type(
      screen.getByPlaceholderText("Stall name"),
      "Test Stall"
    );

    await user.type(
      screen.getByPlaceholderText("Location"),
      "Library"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Add Stall",
      })
    );

    expect(
      screen.getByText("Test Stall")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Library")
    ).toBeInTheDocument();
  });

  it("does not add a stall when required data is missing", async () => {
    const user = userEvent.setup();

    render(<App />);

    await screen.findByRole("heading", {
      name: "Admin Dashboard",
    });

    await user.click(
      screen.getByRole("button", {
        name: /Stall Management/i,
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: "Add Stall",
      })
    );

    expect(
      screen.getAllByRole("row")
    ).toHaveLength(3);
  });

  it("toggles stall Open/Closed status", async () => {
    const user = userEvent.setup();

    render(<App />);

    await screen.findByRole("heading", {
      name: "Admin Dashboard",
    });

    await user.click(
      screen.getByRole("button", {
        name: /Stall Management/i,
      })
    );

    const rows = screen.getAllByRole("row");

    const campusRow = rows.find((row) =>
      within(row).queryByText("Campus Bites")
    );

    expect(campusRow).toBeTruthy();

    expect(
      within(campusRow).getByText("Open")
    ).toBeInTheDocument();

    await user.click(
      within(campusRow).getByRole("button", {
        name: "Open / Close",
      })
    );

    expect(
      await within(campusRow).findByText("Closed")
    ).toBeInTheDocument();
  });

  it("shows Orders & Payments and updates an order status", async () => {
    const user = userEvent.setup();

    render(<App />);

    await screen.findByRole("heading", {
      name: "Admin Dashboard",
    });

    await user.click(
      screen.getByRole("button", {
        name: /Orders & Payments/i,
      })
    );

    expect(
      screen.getByRole("heading", {
        name: "Orders & Payments",
      })
    ).toBeInTheDocument();

    const rows = screen.getAllByRole("row");

    const orderRow = rows.find((row) =>
      within(row).queryByText("ORD-1002")
    );

    expect(orderRow).toBeTruthy();

    const select = within(orderRow).getByRole(
      "combobox"
    );

    await user.selectOptions(
      select,
      "Completed"
    );

    expect(select).toHaveValue("Completed");
  });

  it("offers only backend-supported order statuses in the frontend selector", async () => {
    const user = userEvent.setup();

    render(<App />);

    await screen.findByRole("heading", {
      name: "Admin Dashboard",
    });

    await user.click(
      screen.getByRole("button", {
        name: /Orders & Payments/i,
      })
    );

    const rows = screen.getAllByRole("row");

    const orderRow = rows.find((row) =>
      within(row).queryByText("ORD-1001")
    );

    const select = within(orderRow).getByRole(
      "combobox"
    );

    const options = within(select)
      .getAllByRole("option")
      .map((option) => option.textContent);

    expect(options).toEqual([
      "Pending",
      "Preparing",
      "Completed",
      "Cancelled",
    ]);

    expect(options).toContain("Cancelled");
  });

  it("opens System Configuration and saves changes", async () => {
    const user = userEvent.setup();

    render(<App />);

    await screen.findByRole("heading", {
      name: "Admin Dashboard",
    });

    await user.click(
      screen.getByRole("button", {
        name: /System Configuration/i,
      })
    );

    expect(
      screen.getByRole("heading", {
        name: "System Configuration",
      })
    ).toBeInTheDocument();

    const nameInput =
      screen.getByDisplayValue("NSU Companion");

    await user.clear(nameInput);

    await user.type(
      nameInput,
      "NSU Companion Test"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Save Configuration",
      })
    );

    expect(
      await screen.findByText(
        "✓ Configuration saved successfully."
      )
    ).toBeInTheDocument();
  });

  it("uses Boundary Value Analysis for order limit: minimum value 1 is accepted by the input", async () => {
    const user = userEvent.setup();

    render(<App />);

    await screen.findByRole("heading", {
      name: "Admin Dashboard",
    });

    await user.click(
      screen.getByRole("button", {
        name: /System Configuration/i,
      })
    );

    const input =
      screen.getByDisplayValue("10");

    await user.clear(input);

    await user.type(input, "1");

    expect(input).toHaveValue(1);

    expect(input).toHaveAttribute(
      "min",
      "1"
    );
  });
});