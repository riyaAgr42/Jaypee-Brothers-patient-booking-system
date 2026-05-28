import { Menu, Stethoscope } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { navLinks } from "../utils/constants";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const dashboardPath =
    user?.role === "admin" ? "/admin" : user?.role === "doctor" ? "/doctor" : "/dashboard";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="container-width flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2 text-primary">
            <Stethoscope size={22} />
          </div>
          <div>
            <p className="text-lg font-bold">DocEase</p>
            <p className="text-xs text-textSecondary">Patient Booking System</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive ? "text-primary" : "text-textSecondary hover:text-primary"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {user ? (
            <>
              {user.role === "patient" ? (
                <Link to="/doctors" className="button-primary">
                  Book Appointment
                </Link>
              ) : null}
              <Link to={dashboardPath} className="button-outline">
                Dashboard
              </Link>
              <button type="button" onClick={logout} className="button-outline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="button-outline">
                Login
              </Link>
              <Link to="/register" className="button-primary">
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-xl border border-slate-200 p-2 md:hidden dark:border-slate-700"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <Menu size={20} />
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-medium text-textSecondary"
              >
                {link.label}
              </NavLink>
            ))}
            <ThemeToggle />
            {user ? (
              <>
                {user.role === "patient" ? (
                  <Link to="/doctors" className="button-primary">
                    Book Appointment
                  </Link>
                ) : null}
                <Link to={dashboardPath} className="button-outline">
                  Dashboard
                </Link>
                <button type="button" onClick={logout} className="button-outline">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="button-outline">
                  Login
                </Link>
                <Link to="/register" className="button-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
