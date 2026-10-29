
import { useState } from "react";
import { Link } from "react-router-dom";

const defaultProfile = {
  name: "Demo User",
  email: "user@example.com",
  role: "Workspace Member",
  accountType: "Demo Account",
  memberSince: "October 2026",
};

function Profile() {
  const [profile, setProfile] = useState(() => {
    try {
      const savedProfile = localStorage.getItem("mentor-profile");
      return savedProfile
        ? { ...defaultProfile, ...JSON.parse(savedProfile) }
        : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const [form, setForm] = useState({
    name: profile.name,
    email: profile.email,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSave(event) {
    event.preventDefault();

    const updatedProfile = {
      ...profile,
      name: form.name.trim(),
      email: form.email.trim(),
    };

    if (!updatedProfile.name || !updatedProfile.email) {
      setMessage("Please enter both your name and email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedProfile.email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      localStorage.setItem(
        "mentor-profile",
        JSON.stringify(updatedProfile)
      );
      setProfile(updatedProfile);
      window.dispatchEvent(new Event("mentor-profile-updated"));
      setForm({
        name: updatedProfile.name,
        email: updatedProfile.email,
      });
      setIsEditing(false);
      setMessage("Profile saved successfully.");
    } catch {
      setMessage("Could not save your profile in this browser.");
    }
  }

  function handleCancel() {
    setForm({ name: profile.name, email: profile.email });
    setIsEditing(false);
    setMessage("");
  }

  const initial = profile.name.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <span className="eyebrow">ACCOUNT</span>
          <h1>My Profile</h1>
          <p>View and manage your profile information.</p>
        </div>
      </div>

      <section className="profile-card">
        <div className="profile-cover" />

        <div className="profile-details">
          <div className="profile-avatar">{initial}</div>

          <h2>{profile.name}</h2>
          <p className="profile-role">{profile.role}</p>

          {isEditing ? (
            <form onSubmit={handleSave} className="profile-edit-form">
              <label htmlFor="profile-name">Full Name</label>
              <input
                id="profile-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                maxLength={80}
              />

              <label htmlFor="profile-email">Email Address</label>
              <input
                id="profile-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                maxLength={254}
              />

              <div className="profile-edit-actions">
                <button type="submit" className="primary-button">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="profile-information">
                <div className="information-item">
                  <span>Full Name</span>
                  <strong>{profile.name}</strong>
                </div>

                <div className="information-item">
                  <span>Email Address</span>
                  <strong>{profile.email}</strong>
                </div>

                <div className="information-item">
                  <span>Account Type</span>
                  <strong>{profile.accountType}</strong>
                </div>

                <div className="information-item">
                  <span>Member Since</span>
                  <strong>{profile.memberSince}</strong>
                </div>
              </div>

              <button
                type="button"
                className="primary-button profile-button"
                onClick={() => {
                  setForm({ name: profile.name, email: profile.email });
                  setIsEditing(true);
                  setMessage("");
                }}
              >
                Edit Profile
              </button>
            </>
          )}

          {message && (
            <p role="status" className="profile-message">
              {message}
            </p>
          )}

          <p className="demo-note">
            This is a demo profile. Changes are saved in this browser
            only; they are not sent to a server.
          </p>

          <Link
            to="/dashboard/settings"
            className="primary-button profile-button"
          >
            Go to Settings →
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Profile;
