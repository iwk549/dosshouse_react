import { useContext } from "react";
import { Navigate } from "react-router-dom";
import LoadingContext from "../../../context/loadingContext";

const AdminRoute = ({ children }) => {
  const { user, initialized } = useContext(LoadingContext);
  if (!initialized) return null;
  if (user?.role !== "admin") return <Navigate replace to="/competitions" />;
  return children;
};

export default AdminRoute;
