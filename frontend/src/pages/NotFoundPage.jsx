import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <section className="section-spacing">
    <div className="container-width">
      <div className="mx-auto max-w-xl text-center card-style">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          404 Error
        </p>
        <h1 className="mt-4 text-4xl font-bold">Page not found</h1>
        <p className="mt-4 text-textSecondary">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="button-primary mt-8">
          Back to Home
        </Link>
      </div>
    </div>
  </section>
);

export default NotFoundPage;
