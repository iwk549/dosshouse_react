import { screen } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import { renderWithContext } from "../testHelpers";
import AdminRoute from "../../components/common/routing/adminRoute";

const ProtectedPage = () => <div>Admin Page</div>;
const CompetitionsPage = () => <div>Competitions</div>;

function renderAdminRoute(user, path = "/admin") {
  const Wrapper = () => (
    <Routes>
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <ProtectedPage />
          </AdminRoute>
        }
      />
      <Route path="/competitions" element={<CompetitionsPage />} />
    </Routes>
  );
  return renderWithContext(Wrapper, {}, user, path);
}

describe("AdminRoute", () => {
  it("should render the protected page for an admin user", () => {
    renderAdminRoute({ role: "admin" });
    expect(screen.queryByText("Admin Page")).toBeInTheDocument();
  });

  it("should redirect to competitions for a non-admin user", () => {
    renderAdminRoute({ role: "user" });
    expect(screen.queryByText("Admin Page")).not.toBeInTheDocument();
    expect(screen.queryByText("Competitions")).toBeInTheDocument();
  });

  it("should redirect to competitions when not logged in", () => {
    renderAdminRoute(null);
    expect(screen.queryByText("Admin Page")).not.toBeInTheDocument();
    expect(screen.queryByText("Competitions")).toBeInTheDocument();
  });
});
