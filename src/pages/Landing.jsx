
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing-page">
      <nav className="navbar landing-navbar">
        <Link to="/" className="logo">
          Mentor<span>Dashboard</span>
        </Link>

        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <Link to="/signin" className="nav-button">
            Sign In
          </Link>
        </div>
      </nav>

      <main className="hero">
        <div className="hero-content">
          <span className="eyebrow">
            YOUR WORKSPACE, SIMPLIFIED
          </span>

          <h1>
            Everything you need.
            <br />
            <span>One organized space.</span>
          </h1>

          <p className="hero-description">
            Mentor Dashboard is a simple workspace that helps
            you manage your dashboard, view your profile, and
            organize your settings in one place.
          </p>

          <div className="hero-actions">
            <Link to="/signin" className="primary-button">
              Get Started <span aria-hidden="true">→</span>
            </Link>

            <a href="#features" className="secondary-button">
              Explore Features
            </a>
          </div>
        </div>

        <div className="hero-preview">
          <div className="preview-window">
            <div className="preview-topbar">
              <div className="window-dots">
                <span />
                <span />
                <span />
              </div>
              <span>My Dashboard</span>
            </div>

            <div className="preview-content">
              <div className="preview-sidebar">
                <div className="preview-logo">MD</div>
                <div className="preview-line active" />
                <div className="preview-line" />
                <div className="preview-line" />
              </div>

              <div className="preview-main">
                <div className="preview-heading" />
                <div className="preview-cards">
                  <div className="preview-card">
                    <span>Projects</span>
                    <strong>12</strong>
                  </div>
                  <div className="preview-card">
                    <span>Tasks</span>
                    <strong>24</strong>
                  </div>
                </div>
                <div className="preview-chart">
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="features-section" id="features">
        <div className="section-heading">
          <span className="eyebrow">WHAT YOU CAN DO</span>
          <h2>A workspace built around you</h2>
          <p>
            Find your important information and tools in one
            convenient place.
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon">▦</div>
            <h3>Dashboard</h3>
            <p>
              View your workspace overview and useful
              information at a glance.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">♙</div>
            <h3>Your Profile</h3>
            <p>
              Open your profile and view your personal
              workspace information.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">⚙</div>
            <h3>Settings</h3>
            <p>
              Explore settings and customize your
              workspace preferences.
            </p>
          </article>
        </div>
      </section>

      <footer className="landing-footer">
        © 2026 Mentor Dashboard. Built with React.
      </footer>
    </div>
  );
}

export default Landing;
