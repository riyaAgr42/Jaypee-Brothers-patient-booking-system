import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";

const DashboardLayout = () => (
  <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 sm:px-6 lg:px-8">
    <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
      <DashboardSidebar />
      <section className="flex-1 rounded-2xl bg-white p-6 shadow-soft dark:bg-slate-900">
        <Outlet />
      </section>
    </div>
  </div>
);

export default DashboardLayout;
