import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";
import { cancelAppointment, fetchMyAppointments } from "../services/appointmentService";
import { formatDate } from "../utils/helpers";

const AppointmentHistoryPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const loadAppointments = async () => {
    try {
      const response = await fetchMyAppointments();
      setAppointments(response.appointments);
    } catch (error) {
      toast.error("Appointments could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const filteredAppointments = (() => {
    if (filter === "all") {
      return appointments;
    }

    return appointments.filter((appointment) => appointment.status === filter);
  })();

  const handleCancel = async (appointmentId) => {
    try {
      const response = await cancelAppointment(appointmentId);
      toast.success(response.message);
      loadAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancellation failed.");
    }
  };

  const handleDownload = (appointment) => {
    const lines = [
      "DocEase Appointment Details",
      `Doctor: ${appointment.doctor.name}`,
      `Specialization: ${appointment.doctor.specialization}`,
      `Date: ${formatDate(appointment.date)}`,
      `Time: ${appointment.time}`,
      `Status: ${appointment.status}`
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `appointment-${appointment._id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <LoadingSpinner text="Loading appointment history..." />;
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointment History</h1>
          <p className="mt-2 text-textSecondary">
            Filter and manage your previous and upcoming appointments.
          </p>
        </div>
        <select
          className="input-style max-w-xs"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredAppointments.length === 0 ? (
        <EmptyState
          title="No appointments found"
          description="Try changing the filter or book a new appointment."
        />
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="card-style flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold">{appointment.doctor.name}</h3>
                <p className="text-sm text-textSecondary">
                  {appointment.doctor.specialization}
                </p>
                <p className="mt-2 text-sm text-textSecondary">
                  {formatDate(appointment.date)} at {appointment.time}
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 sm:items-end">
                <StatusBadge status={appointment.status} />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownload(appointment)}
                    className="button-outline px-4 py-2"
                  >
                    Download
                  </button>
                  {!["cancelled", "rejected", "completed"].includes(appointment.status) && (
                    <button
                      type="button"
                      onClick={() => handleCancel(appointment._id)}
                      className="rounded-xl bg-danger px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                    >
                      Cancel Appointment
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentHistoryPage;
