import { CalendarDays, Home, LayoutDashboard, ShieldCheck, Stethoscope } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const DashboardSidebar = () => {
  const { user } = useAuth();

  const patientLinks = [
    { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { label: "Appointments", path: "/dashboard/appointments", icon: CalendarDays }
  ];

  const adminLinks = [
    { label: "Admin Dashboard", path: "/admin", icon: ShieldCheck }
  ];

  const doctorLinks = [
    { label: "Doctor Dashboard", path: "/doctor", icon: Stethoscope }
  ];

  const links =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "doctor"
        ? doctorLinks
        : patientLinks;

  return (
    <aside className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 lg:w-72">
      <Link
        to="/"
        className="mb-6 flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
      >
        <Home size={18} />
        Back to Home
      </Link>

      <div className="mb-8">
        <p className="text-sm text-textSecondary">Welcome</p>
        <h3 className="text-xl font-bold">{user?.name}</h3>
        <p className="text-sm capitalize text-primary">{user?.role} panel</p>
      </div>

      <div className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={
                link.path === "/dashboard" || link.path === "/admin" || link.path === "/doctor"
              }
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-textSecondary hover:bg-slate-100 hover:text-textPrimary dark:hover:bg-slate-800"
                }`
              }
            >
              <Icon size={18} />
              {link.label}
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};

export default DashboardSidebar;
