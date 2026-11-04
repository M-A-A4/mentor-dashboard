
import { useEffect, useState } from "react";

function Settings() {
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem("mentor-notifications") !== "false";
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("mentor-dark-mode") === "true";
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );

    localStorage.setItem("mentor-dark-mode", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem(
      "mentor-notifications",
      String(notifications)
    );
  }, [notifications]);

  function handleNotificationsChange(value) {
    setNotifications(value);
    setMessage("Notification preference updated.");
  }

  function handleDarkModeChange(value) {
    setDarkMode(value);
    setMessage("Appearance preference updated.");
  }

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
            <p>
              {notifications
                ? "Email notifications are enabled in your preferences."
                : "Email notifications are disabled in your preferences."}
            </p>
            <small>
              This setting saves your choice in this browser.
              Actual emails are not sent yet.
            </small>
          </div>

          <label className="toggle">
            <input
              type="checkbox"
              checked={notifications}
              onChange={(event) =>
                handleNotificationsChange(event.target.checked)
              }
              aria-label="Enable email notifications preference"
            />
            <span className="toggle-slider" />
          </label>
        </div>

        <div className="setting-row">
          <div>
            <strong>Dark Mode</strong>
            <p>Switch between light and dark appearance.</p>
          </div>

          <label className="toggle">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(event) =>
                handleDarkModeChange(event.target.checked)
              }
              aria-label="Enable dark mode"
            />
            <span className="toggle-slider" />
          </label>
        </div>

        {message && (
          <p role="status" className="settings-status-message">
            {message}
          </p>
        )}

        <div className="settings-status">
          <strong>Current preferences</strong>
          <p>
            Notifications: {notifications ? "Enabled" : "Disabled"}
          </p>
          <p>Dark mode: {darkMode ? "On" : "Off"}</p>
          <small>
            Preferences are saved in this browser and remain after
            refreshing the page.
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
          <span>Email delivery</span>
          <strong>Not connected yet</strong>
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
