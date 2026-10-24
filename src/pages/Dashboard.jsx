
import { Link } from "react-router-dom";

function Dashboard() {
  const stats = [
    {
      title: "Total Projects",
      value: "12",
      note: "Your workspace projects",
      icon: "▦",
    },
    {
      title: "Tasks Completed",
      value: "24",
      note: "Sample completion count",
      icon: "✓",
    },
    {
      title: "Hours Tracked",
      value: "36",
      note: "Sample tracked hours",
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
          <h1>Welcome back, User!</h1>
          <p>
            Here's an overview of your workspace. Choose a
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
              <p>A quick look at your workspace</p>
            </div>
          </div>

          <div className="activity-item">
            <span className="activity-dot purple-dot" />
            <div>
              <strong>Dashboard created</strong>
              <p>Your workspace overview is ready.</p>
            </div>
            <span className="activity-time">Today</span>
          </div>

          <div className="activity-item">
            <span className="activity-dot blue-dot" />
            <div>
              <strong>Profile section available</strong>
              <p>Explore your profile page.</p>
            </div>
            <span className="activity-time">Today</span>
          </div>

          <div className="activity-item">
            <span className="activity-dot green-dot" />
            <div>
              <strong>Settings section available</strong>
              <p>Explore your workspace settings.</p>
            </div>
            <span className="activity-time">Today</span>
          </div>
        </article>

        <article className="panel quick-links-panel">
          <h2>Quick Links</h2>
          <p>Jump to a workspace section.</p>

          <Link to="/dashboard/profile" className="quick-link">
            <span className="quick-link-icon">♙</span>
            <span>
              <strong>My Profile</strong>
              <small>View your information</small>
            </span>
            <span className="quick-arrow">→</span>
          </Link>

          <Link to="/dashboard/settings" className="quick-link">
            <span className="quick-link-icon">⚙</span>
            <span>
              <strong>Settings</strong>
              <small>Explore preferences</small>
            </span>
            <span className="quick-arrow">→</span>
          </Link>
        </article>
      </section>
    </div>
  );
}

export default Dashboard;
