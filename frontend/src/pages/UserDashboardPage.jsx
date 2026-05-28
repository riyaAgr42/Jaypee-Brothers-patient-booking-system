import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardHeader from "../components/DashboardHeader";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { fetchProfileSummary, updateProfile } from "../services/userService";
import { formatDate } from "../utils/helpers";

const UserDashboardPage = () => {
  const [data, setData] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    gender: "",
    age: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const response = await fetchProfileSummary();
        setData(response);
        setProfileForm({
          name: response.profile.name || "",
          phone: response.profile.phone || "",
          gender: response.profile.gender || "",
          age: String(response.profile.age || "")
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await updateProfile(profileForm);
      toast.success(response.message);
      setData((current) => ({
        ...current,
        profile: response.user
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed.");
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <div>
      <DashboardHeader
        title="Patient Dashboard"
        subtitle="Track your bookings, profile details, and recent appointment activity."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Total Appointments"
          value={data.stats.totalAppointments}
          subtitle="All appointments booked by you"
        />
        <StatCard
          title="Approved"
          value={data.stats.approvedAppointments}
          subtitle="Appointments confirmed by admin"
        />
        <StatCard
          title="Pending"
          value={data.stats.pendingAppointments}
          subtitle="Appointments waiting for approval"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="card-style">
          <h2 className="text-xl font-bold">Profile</h2>
          <form onSubmit={handleProfileSubmit} className="mt-6 space-y-4">
            <input
              className="input-style"
              name="name"
              value={profileForm.name}
              onChange={(event) =>
                setProfileForm((current) => ({ ...current, name: event.target.value }))
              }
            />
            <input
              className="input-style"
              name="phone"
              placeholder="Phone"
              value={profileForm.phone}
              onChange={(event) =>
                setProfileForm((current) => ({ ...current, phone: event.target.value }))
              }
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <select
                className="input-style"
                value={profileForm.gender}
                onChange={(event) =>
                  setProfileForm((current) => ({ ...current, gender: event.target.value }))
                }
              >
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input
                type="number"
                className="input-style"
                placeholder="Age"
                value={profileForm.age}
                onChange={(event) =>
                  setProfileForm((current) => ({ ...current, age: event.target.value }))
                }
              />
            </div>
            <p className="text-sm text-textSecondary">{data.profile.email}</p>
            <button type="submit" className="button-primary w-full">
              Save Profile
            </button>
          </form>
        </div>

        <div className="card-style">
          <h2 className="text-xl font-bold">Recent Appointments</h2>
          {data.recentAppointments.length === 0 ? (
            <div className="mt-6">
              <EmptyState
                title="No appointments yet"
                description="Book your first doctor appointment to see it here."
              />
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {data.recentAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold">{appointment.doctor.name}</h3>
                      <p className="text-sm text-textSecondary">
                        {appointment.doctor.specialization}
                      </p>
                      <p className="mt-1 text-sm text-textSecondary">
                        {formatDate(appointment.date)} at {appointment.time}
                      </p>
                    </div>
                    <StatusBadge status={appointment.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
