
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-number">404</div>
      <h1>Page not found</h1>
      <p>
        Sorry, we couldn't find the page you are looking for.
      </p>

      <Link to="/" className="primary-button">
        Return Home
      </Link>
    </main>
  );
}

export default NotFound;
