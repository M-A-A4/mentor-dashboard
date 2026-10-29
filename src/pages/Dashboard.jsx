
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function getProfileName() {
  try {
    const saved = localStorage.getItem("mentor-profile");
    const profile = saved ? JSON.parse(saved) : null;
    return profile?.name?.trim() || "User";
  } catch {
    return "User";
  }
}

function Dashboard() {
  const [userName, setUserName] = useState(getProfileName);

  useEffect(() => {
    function updateName() {
      setUserName(getProfileName());
    }

    window.addEventListener("mentor-profile-updated", updateName);
    window.addEventListener("storage", updateName);

    return () => {
      window.removeEventListener("mentor-profile-updated", updateName);
      window.removeEventListener("storage", updateName);
    };
  }, []);

  const stats = [
    {
      title: "Total Projects",
      value: "12",
      note: "Example workspace total",
      icon: "▦",
    },
    {
      title: "Tasks Completed",
      value: "24",
      note: "Example completion count",
      icon: "✓",
    },
    {
      title: "Hours Tracked",
      value: "36",
      note: "Example tracked hours",
      icon: "◷",
    },
    {
      title: "Productivity",
      value: "85%",
      note: "Example progress metric",
      icon: "↗",
    },
  ];

  return (
    <div className="page-container">
      <section className="welcome-banner">
        <div>
          <span className="banner-label">YOUR WORKSPACE</span>
          <h1>Welcome back, {userName}!</h1>
          <p>
            Here's an overview of your demo workspace. Choose a
            section from the sidebar to get started.
          </p>
          <Link to="/dashboard/profile" className="banner-button">
            View My Profile →
          </Link>
        </div>

        <div className="welcome-decoration">✦</div>
      </section>

      <section className="stats-grid">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.title}>
            <div className="stat-card-top">
              <span>{stat.title}</span>
              <span className="stat-icon">{stat.icon}</span>
            </div>

            <strong className="stat-value">{stat.value}</strong>
            <p>{stat.note}</p>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <h2>Recent Activity</h2>
              <p>Available sections in your workspace</p>
            </div>
          </div>

          <div className="activity-item">
            <span className="activity-dot purple-dot" />
            <div>
              <strong>Dashboard available</strong>
              <p>Your workspace overview is ready.</p>
            </div>
            <span className="activity-time">Ready</span>
          </div>

          <div className="activity-item">
            <span className="activity-dot blue-dot" />
            <div>
              <strong>Profile management</strong>
              <p>View and edit your saved profile information.</p>
            </div>
            <span className="activity-time">Ready</span>
          </div>

          <div className="activity-item">
            <span className="activity-dot green-dot" />
            <div>
              <strong>Workspace preferences</strong>
              <p>Manage your theme and notification preference.</p>
            </div>
            <span className="activity-time">Ready</span>
          </div>
        </article>

        <article className="panel quick-links-panel">
          <h2>Quick Links</h2>
          <p>Jump to a workspace section.</p>

          <Link to="/dashboard/profile" className="quick-link">
            <span className="quick-link-icon">♙</span>
            <span>
              <strong>My Profile</strong>
              <small>View and edit your information</small>
            </span>
            <span className="quick-arrow">→</span>
          </Link>

          <Link to="/dashboard/settings" className="quick-link">
            <span className="quick-link-icon">⚙</span>
            <span>
              <strong>Settings</strong>
              <small>Manage workspace preferences</small>
            </span>
            <span className="quick-arrow">→</span>
          </Link>
        </article>
      </section>

      <p className="demo-note">
        Dashboard statistics are sample values for demonstration.
        They are not connected to a live project or task database.
      </p>
    </div>
  );
}

export default Dashboard;
