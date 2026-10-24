
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();

  function handleContinue(event) {
    event.preventDefault();
    navigate("/dashboard");
  }

  return (
    <main className="signin-page">
      <nav className="navbar signin-navbar">
        <Link to="/" className="logo">
          Mentor<span>Dashboard</span>
        </Link>

        <Link to="/" className="back-link">
          ← Back to Home
        </Link>
      </nav>

      <div className="signin-container">
        <div className="signin-card">
          <div className="signin-icon">MD</div>

          <span className="eyebrow">WELCOME BACK</span>
          <h1>Sign in to your workspace</h1>

          <p className="signin-description">
            This is a demo sign-in page. Authentication is
            disabled for this project.
          </p>

          <form onSubmit={handleContinue}>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter any password"
              autoComplete="current-password"
            />

            <button type="submit" className="primary-button signin-submit">
              Continue to Dashboard →
            </button>
          </form>

          <p className="demo-note">
            Demo mode: no real account or password is required.
          </p>

          <p className="signin-bottom">
            New here?{" "}
            <Link to="/">Explore the landing page</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default SignIn;
