
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const defaultProfile = {
  name: "Demo User",
  role: "Workspace Member",
};

function getSavedProfile() {
  try {
    const saved = localStorage.getItem("mentor-profile");
    return saved
      ? { ...defaultProfile, ...JSON.parse(saved) }
      : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

function Navbar({ onMenuClick }) {
  const location = useLocation();
  const [profile, setProfile] = useState(getSavedProfile);

  useEffect(() => {
    function updateProfile() {
      setProfile(getSavedProfile());
    }

    // Update when the profile is saved in this browser tab.
    window.addEventListener("mentor-profile-updated", updateProfile);

    // Update when localStorage changes in another browser tab.
    window.addEventListener("storage", updateProfile);

    return () => {
      window.removeEventListener("mentor-profile-updated", updateProfile);
      window.removeEventListener("storage", updateProfile);
    };
  }, []);

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/dashboard/profile": "My Profile",
    "/dashboard/settings": "Settings",
  };

  const pageTitle = pageTitles[location.pathname] || "Dashboard";
  const initial = profile.name?.trim().charAt(0).toUpperCase() || "U";

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
        <div className="avatar">{initial}</div>
        <div className="navbar-user-info">
          <strong>{profile.name || "Demo User"}</strong>
          <span>{profile.role || "Workspace Member"}</span>
        </div>
      </Link>
    </header>
  );
}

export default Navbar;
