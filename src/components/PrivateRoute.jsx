import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, roleRequired }) {
  const { token, role } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (roleRequired && role !== roleRequired) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
}
