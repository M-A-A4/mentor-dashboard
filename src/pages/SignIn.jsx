
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleContinue(event) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both your email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    // Demo only: this does not verify credentials with a server.
    localStorage.setItem(
      "mentor-demo-session",
      JSON.stringify({ email: email.trim() })
    );

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
            Enter your email and password to continue in demo mode.
          </p>

          <form onSubmit={handleContinue}>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter any password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            {error && (
              <p role="alert" className="signin-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="primary-button signin-submit"
            >
              Continue to Dashboard →
            </button>
          </form>

          <p className="demo-note">
            Demo mode: credentials are not verified by a server.
            Do not use a real password.
          </p>

          <p className="signin-bottom">
            New here? <Link to="/">Explore the landing page</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default SignIn;
