
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/signin", { replace: true });
  }

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/dashboard/profile": "My Profile",
    "/dashboard/settings": "Settings",
    "/dashboard/projects": "Projects",
    "/dashboard/tasks": "Tasks",
  };

  const pageTitle =
    pageTitles[location.pathname] ||
    (location.pathname.startsWith("/dashboard/project/")
      ? "Project Details"
      : "Dashboard");

  const initial = user?.name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <header className="dashboard-navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="menu-button"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          ☰
        </button>

        <div>
          <h2>{pageTitle}</h2>
          <p className="navbar-subtitle">Welcome to your workspace</p>
        </div>
      </div>

      <div className="navbar-right">
        <Link to="/dashboard/profile" className="navbar-user">
          <div className="avatar">{initial}</div>
          <div className="navbar-user-info">
            <strong>{user?.name || "User"}</strong>
            <span>{user?.role || "Workspace Member"}</span>
          </div>
        </Link>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    </header>
  );
}

export default Navbar;
