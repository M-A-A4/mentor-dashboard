
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const session = localStorage.getItem("mentor-demo-session");

  if (!session) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
