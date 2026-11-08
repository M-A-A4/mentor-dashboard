
import { useState } from "react";
import { Link } from "react-router-dom";
import { profileSchema } from "../schemas/profileSchema";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, updateAccount } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setMessage("");

    const validation = profileSchema.safeParse(form);

    if (!validation.success) {
      setMessage(validation.error.issues[0].message);
      return;
    }

    setIsSaving(true);

    try {
      await updateAccount({
        name: validation.data.name,
        email: validation.data.email,
      });

      setForm({
        name: validation.data.name,
        email: validation.data.email,
      });

      setIsEditing(false);
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(error.message || "Could not update profile.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancel() {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
    });
    setIsEditing(false);
    setMessage("");
  }

  const initial = user?.name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className="page-container profile-page">
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
          <h2>{user?.name}</h2>
          <p className="profile-role">{user?.role || "Workspace Member"}</p>

          {isEditing ? (
            <form onSubmit={handleSave} className="profile-edit-form" noValidate>
              <label htmlFor="profile-name">Full Name</label>
              <input
                id="profile-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                maxLength={80}
              />

              <label htmlFor="profile-email">Email Address</label>
              <input
                id="profile-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                maxLength={254}
              />

              <div className="profile-edit-actions">
                <button type="submit" className="primary-button" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleCancel}
                  disabled={isSaving}
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
                  <strong>{user?.name}</strong>
                </div>
                <div className="information-item">
                  <span>Email Address</span>
                  <strong>{user?.email}</strong>
                </div>
                <div className="information-item">
                  <span>Account Type</span>
                  <strong>{user?.accountType || "Registered Account"}</strong>
                </div>
                <div className="information-item">
                  <span>Member Since</span>
                  <strong>{user?.memberSince || "—"}</strong>
                </div>
              </div>

              <button
                type="button"
                className="primary-button profile-button"
                onClick={() => {
                  setForm({
                    name: user?.name || "",
                    email: user?.email || "",
                  });
                  setIsEditing(true);
                  setMessage("");
                }}
              >
                Edit Profile
              </button>
            </>
          )}

          {message && <p role="status" className="profile-message">{message}</p>}

          <Link to="/dashboard/settings" className="secondary-button profile-settings-link">
            Go to Settings →
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Profile;
