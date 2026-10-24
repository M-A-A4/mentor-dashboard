
import { useState } from "react";

function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <span className="eyebrow">PREFERENCES</span>
          <h1>Settings</h1>
          <p>Manage your demo workspace preferences.</p>
        </div>
      </div>

      <section className="settings-card">
        <div className="settings-section-heading">
          <div className="settings-icon">♙</div>
          <div>
            <h2>General Preferences</h2>
            <p>Choose how your workspace behaves.</p>
          </div>
        </div>

        <div className="setting-row">
          <div>
            <strong>Email Notifications</strong>
            <p>Receive updates about workspace activity.</p>
          </div>

          <label className="toggle">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(event) =>
                setNotifications(event.target.checked)
              }
            />
            <span className="toggle-slider" />
          </label>
        </div>

        <div className="setting-row">
          <div>
            <strong>Dark Mode Preference</strong>
            <p>Toggle this example preference on or off.</p>
          </div>

          <label className="toggle">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(event) =>
                setDarkMode(event.target.checked)
              }
            />
            <span className="toggle-slider" />
          </label>
        </div>

        <div className="settings-status">
          <strong>Current preferences</strong>
          <p>
            Notifications: {notifications ? "Enabled" : "Disabled"}
          </p>
          <p>
            Dark mode preference: {darkMode ? "On" : "Off"}
          </p>
          <small>
            These are temporary demo settings and reset when
            the page is refreshed.
          </small>
        </div>
      </section>

      <section className="settings-card about-card">
        <div className="settings-section-heading">
          <div className="settings-icon">ⓘ</div>
          <div>
            <h2>About this application</h2>
            <p>Mentor Dashboard</p>
          </div>
        </div>

        <div className="about-information">
          <span>Frontend</span>
          <strong>React + Vite</strong>
        </div>

        <div className="about-information">
          <span>Routing</span>
          <strong>React Router</strong>
        </div>

        <div className="about-information">
          <span>Version</span>
          <strong>1.0.0</strong>
        </div>
      </section>
    </div>
  );
}

export default Settings;
