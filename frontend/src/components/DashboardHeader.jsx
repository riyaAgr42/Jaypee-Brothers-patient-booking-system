import { Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../hooks/useAuth";

const DashboardHeader = ({ title, subtitle }) => {
  const { logout } = useAuth();

  return (
    <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-hero-gradient p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Link to="/" className="mb-4 inline-flex items-center gap-2 text-primary">
          <Stethoscope size={18} />
          <span className="text-sm font-semibold">DocEase Home</span>
        </Link>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-textSecondary">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button type="button" onClick={logout} className="button-primary">
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
