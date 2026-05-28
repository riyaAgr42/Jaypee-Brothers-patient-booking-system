import { CalendarCheck, HeartPulse, ShieldCheck, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-slate-200 bg-slate-950 text-slate-100 dark:border-slate-800">
    <div className="container-width py-12">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr_0.7fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="rounded-xl bg-primary/15 p-2 text-primary">
              <Stethoscope size={22} />
            </span>
            <span className="text-xl font-bold">DocEase</span>
          </Link>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400">
            DocEase is your trusted healthcare companion designed to make finding doctors
            and booking appointments simple, fast, and stress-free. Our platform connects
            patients with experienced healthcare professionals, providing an easy and secure
            way to access quality medical care anytime, anywhere. From searching specialists
            to managing appointments, DocEase aims to improve healthcare accessibility and
            create a smoother experience for both patients and doctors.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            Platform
          </h3>
          <div className="mt-5 space-y-3 text-sm text-slate-400">
            <Link to="/doctors" className="block transition hover:text-white">
              Find Doctors
            </Link>
            <Link to="/register" className="block transition hover:text-white">
              Create Account
            </Link>
            <Link to="/login" className="block transition hover:text-white">
              Login
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            Care Features
          </h3>
          <div className="mt-5 space-y-3 text-sm text-slate-400">
            <p className="flex items-center gap-2">
              <CalendarCheck size={16} className="text-secondary" />
              Easy appointments
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-secondary" />
              Secure access
            </p>
            <p className="flex items-center gap-2">
              <HeartPulse size={16} className="text-secondary" />
              Better healthcare
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 DocEase. All Rights Reserved.</p>
        <p>Built with dedication for better healthcare services.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
