
import { Link } from "react-router-dom";

function Profile() {
  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <span className="eyebrow">ACCOUNT</span>
          <h1>My Profile</h1>
          <p>View your profile information.</p>
        </div>
      </div>

      <section className="profile-card">
        <div className="profile-cover" />

        <div className="profile-details">
          <div className="profile-avatar">U</div>

          <h2>Demo User</h2>
          <p className="profile-role">Workspace Member</p>

          <div className="profile-information">
            <div className="information-item">
              <span>Full Name</span>
              <strong>Demo User</strong>
            </div>

            <div className="information-item">
              <span>Email Address</span>
              <strong>user@example.com</strong>
            </div>

            <div className="information-item">
              <span>Account Type</span>
              <strong>Demo Account</strong>
            </div>

            <div className="information-item">
              <span>Member Since</span>
              <strong>October 2026</strong>
            </div>
          </div>

          <p className="demo-note">
            This profile contains example information for
            demonstration purposes.
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
