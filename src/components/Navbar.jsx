
import { Link, useLocation } from "react-router-dom";

function Navbar({ onMenuClick }) {
  const location = useLocation();

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/dashboard/profile": "My Profile",
    "/dashboard/settings": "Settings",
  };

  const pageTitle = pageTitles[location.pathname] || "Dashboard";

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
          <p className="navbar-subtitle">
            Welcome to your workspace
          </p>
        </div>
      </div>

      <Link to="/dashboard/profile" className="navbar-user">
        <div className="avatar">U</div>
        <div className="navbar-user-info">
          <strong>Demo User</strong>
          <span>Workspace Member</span>
        </div>
      </Link>
    </header>
  );
}

export default Navbar;
