
import { NavLink, Link } from "react-router-dom";

function Sidebar({ isOpen, onNavigate }) {
  function linkClass({ isActive }) {
    return isActive ? "sidebar-link active" : "sidebar-link";
  }

  return (
    <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
      <Link
        to="/dashboard"
        className="sidebar-brand"
        onClick={onNavigate}
      >
        <span className="brand-icon">MD</span>
        <span>Mentor Dashboard</span>
      </Link>

      <div className="sidebar-label">WORKSPACE</div>

      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          end
          className={linkClass}
          onClick={onNavigate}
        >
          <span className="sidebar-icon">▦</span>
          <span>Dashboard</span>
        </NavLink>

        {/* Projects link */}
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

        <Link
          to="/signin"
          className="sidebar-signout"
          onClick={onNavigate}
        >
          <span className="sidebar-icon">↪</span>
          <span>Back to Sign In</span>
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;
