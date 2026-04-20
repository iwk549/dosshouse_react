import { act, screen } from "@testing-library/react";
import AdminUsers from "../../components/admin/adminUsers";
import { getUsers, deleteUser } from "../../services/adminService";
import { toast } from "react-toastify";
import { apiResponse, clickByText, renderWithContext } from "../testHelpers";

jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() },
}));

jest.mock("../../services/adminService", () => ({
  getUsers: jest.fn(),
  deleteUser: jest.fn(),
}));

const mockUsers = [
  {
    _id: "1",
    name: "Alice",
    email: "alice@test.com",
    lastActive: "2024-01-01T00:00:00.000Z",
    hasGoogleAccount: true,
    role: null,
  },
  {
    _id: "2",
    name: "Bob",
    email: "bob@test.com",
    lastActive: null,
    hasGoogleAccount: false,
    role: null,
  },
  {
    _id: "3",
    name: "Admin User",
    email: "admin@test.com",
    lastActive: null,
    hasGoogleAccount: false,
    role: "admin",
  },
];

function renderComponent() {
  return renderWithContext(AdminUsers, {}, { role: "admin" });
}

describe("AdminUsers", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    getUsers.mockReturnValue(apiResponse({ users: mockUsers, count: mockUsers.length }));
  });

  it("should render a list of users", async () => {
    await act(async () => renderComponent());
    expect(screen.queryByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).toBeInTheDocument();
  });

  it("should show 'Never' for users with no lastActive", async () => {
    await act(async () => renderComponent());
    expect(screen.queryAllByText("Never").length).toBeGreaterThan(0);
  });

  it("should show a delete button for non-admin users", async () => {
    await act(async () => renderComponent());
    expect(screen.queryAllByTitle("Delete user").length).toBe(2);
  });

  it("should show a user icon instead of delete for admin users", async () => {
    await act(async () => renderComponent());
    expect(screen.queryByTitle("Site admin")).toBeInTheDocument();
  });

  it("should open a confirm modal when delete is clicked", async () => {
    await act(async () => renderComponent());
    await act(async () => screen.queryAllByTitle("Delete user")[0].click());
    expect(screen.queryByText(/are you sure/i)).toBeInTheDocument();
    expect(screen.queryAllByText("Alice").length).toBeGreaterThan(0);
  });

  it("should call deleteUser and show success toast on confirm", async () => {
    deleteUser.mockReturnValue(apiResponse({}));
    await act(async () => renderComponent());
    await act(async () => screen.queryAllByTitle("Delete user")[0].click());
    await act(async () => await clickByText("Delete"));
    expect(deleteUser).toHaveBeenCalledWith("1");
    expect(toast.success).toHaveBeenCalled();
  });

  it("should show an error toast if delete fails", async () => {
    deleteUser.mockReturnValue(apiResponse("Something went wrong", 400));
    await act(async () => renderComponent());
    await act(async () => screen.queryAllByTitle("Delete user")[0].click());
    await act(async () => await clickByText("Delete"));
    expect(toast.error).toHaveBeenCalled();
  });

  it("should show an error toast if getUsers fails", async () => {
    getUsers.mockReturnValue(apiResponse("Server error", 500));
    await act(async () => renderComponent());
    expect(toast.error).toHaveBeenCalled();
  });
});
