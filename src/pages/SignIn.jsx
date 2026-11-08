
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInSchema } from "../schemas/signInSchema";
import { useAuth } from "../context/AuthContext";

function SignIn() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const validation = signInSchema.safeParse({ email, password });

    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    if (isRegistering && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    setIsLoading(true);

    try {
      if (isRegistering) {
        await register({
          name: name.trim(),
          email: validation.data.email,
          password: validation.data.password,
        });
      } else {
        await login(validation.data.email, validation.data.password);
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="signin-page">
      <nav className="navbar signin-navbar">
        <Link to="/" className="logo">
          Mentor<span>Dashboard</span>
        </Link>
        <Link to="/" className="back-link">← Back to Home</Link>
      </nav>

      <div className="signin-container">
        <div className="signin-card">
          <div className="signin-icon">MD</div>
          <span className="eyebrow">
            {isRegistering ? "CREATE ACCOUNT" : "WELCOME BACK"}
          </span>
          <h1>{isRegistering ? "Create your account" : "Sign in to your workspace"}</h1>
          <p className="signin-description">
            {isRegistering
              ? "Enter your details to create your account."
              : "Enter your email and password to continue."}
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {isRegistering && (
              <>
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </>
            )}

            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete={isRegistering ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            {error && <p role="alert" className="signin-error">{error}</p>}

            <button
              type="submit"
              className="primary-button signin-submit"
              disabled={isLoading}
            >
              {isLoading
                ? "Please wait..."
                : isRegistering
                  ? "Create Account →"
                  : "Sign In →"}
            </button>
          </form>

          <p className="signin-bottom">
            {isRegistering ? "Already have an account? " : "New here? "}
            <button
              type="button"
              className="text-button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError("");
              }}
            >
              {isRegistering ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}

export default SignIn;
