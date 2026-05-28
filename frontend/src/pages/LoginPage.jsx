import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    role: "patient",
    email: "",
    password: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const user = await login(formData);
      navigate(user.role === "admin" ? "/admin" : user.role === "doctor" ? "/doctor" : "/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section-spacing">
      <div className="container-width">
        <div className="mx-auto max-w-md card-style">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-textSecondary">
            Login and choose your role to open the right dashboard.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <select
              name="role"
              className="input-style"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
              className="input-style"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              className="input-style"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" className="button-primary w-full" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="mt-6 text-sm text-textSecondary">
            New user?{" "}
            <Link to="/register" className="font-semibold text-primary">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
