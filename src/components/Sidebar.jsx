
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar({ isOpen, onNavigate }) {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";

  function linkClass({ isActive }) {
    return isActive ? "sidebar-link active" : "sidebar-link";
  }

  function handleLogout() {
    logout();
    onNavigate?.();
  }

  return (
    <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
      <Link
        to={isAdmin ? "/admin" : "/dashboard"}
        className="sidebar-brand"
        onClick={onNavigate}
      >
        <span className="brand-icon">MD</span>
        <span>Mentor Dashboard</span>
      </Link>

      <div className="sidebar-label">WORKSPACE</div>

      <nav className="sidebar-nav">
        {isAdmin && (
          <NavLink
            to="/admin"
            end
            className={linkClass}
            onClick={onNavigate}
          >
            <span className="sidebar-icon">▦</span>
            <span>Admin Dashboard</span>
          </NavLink>
        )}

        <NavLink
          to="/dashboard"
          end
          className={linkClass}
          onClick={onNavigate}
        >
          <span className="sidebar-icon">▦</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/dashboard/projects"
          className={linkClass}
          onClick={onNavigate}
        >
          <span className="sidebar-icon">▣</span>
          <span>Projects</span>
        </NavLink>

        <NavLink
          to="/dashboard/tasks"
          className={linkClass}
          onClick={onNavigate}
        >
          <span className="sidebar-icon">✓</span>
          <span>Tasks</span>
        </NavLink>

        <NavLink
          to="/dashboard/profile"
          className={linkClass}
          onClick={onNavigate}
        >
          <span className="sidebar-icon">♙</span>
          <span>My Profile</span>
        </NavLink>

        <NavLink
          to="/dashboard/settings"
          className={linkClass}
          onClick={onNavigate}
        >
          <span className="sidebar-icon">⚙</span>
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-help">
          <strong>Need help?</strong>
          <p>Explore your workspace and learn as you go.</p>
          <Link to="/" onClick={onNavigate}>
            Visit Home →
          </Link>
        </div>

        <button
          type="button"
          className="sidebar-signout"
          onClick={handleLogout}
        >
          <span className="sidebar-icon">↪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
