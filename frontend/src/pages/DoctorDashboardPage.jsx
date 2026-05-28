import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardHeader from "../components/DashboardHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../hooks/useAuth";
import { updateAppointmentStatusByDoctor } from "../services/appointmentService";
import { fetchMyDoctorProfile, updateMyDoctorProfile } from "../services/doctorService";

const DoctorDashboardPage = () => {
  const { setUser } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    qualification: "",
    experience: "",
    fees: "",
    availableDays: "",
    startTime: "",
    endTime: "",
    slotDuration: "30",
    unavailableDays: "",
    availableSlots: "",
    image: "",
    address: "",
    availabilityLocation: "",
    about: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadDoctorProfile = async () => {
      try {
        const response = await fetchMyDoctorProfile();
        const nextDoctor = response.doctor;
        setDoctor(nextDoctor);
        setAppointments(response.appointments || []);
        setFormData({
          name: nextDoctor.name || "",
          specialization: nextDoctor.specialization || "",
          qualification: nextDoctor.qualification || "",
          experience: String(nextDoctor.experience ?? ""),
          fees: String(nextDoctor.fees ?? ""),
          availableDays: (nextDoctor.availableDays || []).join(", "),
          startTime: nextDoctor.startTime || "",
          endTime: nextDoctor.endTime || "",
          slotDuration: String(nextDoctor.slotDuration || 30),
          unavailableDays: (nextDoctor.unavailableDays || []).join(", "),
          availableSlots: (nextDoctor.availableSlots || []).join(", "),
          image: nextDoctor.image || "",
          address: nextDoctor.address || "",
          availabilityLocation: nextDoctor.availabilityLocation || "",
          about: nextDoctor.about || ""
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "Doctor profile could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    loadDoctorProfile();
  }, []);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await updateMyDoctorProfile(formData);
      setDoctor(response.doctor);
      setUser((current) => {
        const nextUser = {
          ...(current || {}),
          name: response.doctor.name,
          doctorProfile: {
            specialization: response.doctor.specialization,
            qualification: response.doctor.qualification,
            experience: response.doctor.experience,
            fees: response.doctor.fees,
            availableDays: response.doctor.availableDays,
            availableSlots: response.doctor.availableSlots,
            image: response.doctor.image,
            address: response.doctor.address,
            availabilityLocation: response.doctor.availabilityLocation,
            status: response.doctor.status
          }
        };

        localStorage.setItem("docease-user", JSON.stringify(nextUser));
        return nextUser;
      });
      toast.success(response.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Doctor profile update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleAppointmentStatus = async (appointmentId, status) => {
    try {
      const response = await updateAppointmentStatusByDoctor(appointmentId, status);
      toast.success(response.message);
      const profileResponse = await fetchMyDoctorProfile();
      setAppointments(profileResponse.appointments || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Appointment status update failed.");
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading doctor dashboard..." />;
  }

  return (
    <div>
      <DashboardHeader
        title="Doctor Dashboard"
        subtitle="Confirm your current status, update your availability, and manage your public doctor details."
      />

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="card-style">
          <h2 className="text-xl font-bold">Current Status</h2>
          <div className="mt-6 space-y-4 text-sm">
            <div>
              <p className="text-textSecondary">Name</p>
              <p className="font-semibold">{doctor?.name}</p>
            </div>
            <div>
              <p className="text-textSecondary">Specialization</p>
              <p className="font-semibold">{doctor?.specialization}</p>
            </div>
            <div>
              <p className="text-textSecondary">Profile Status</p>
              <div className="mt-2">
                <StatusBadge status={doctor?.status} />
              </div>
            </div>
            <div>
              <p className="text-textSecondary">Available At</p>
              <p className="font-semibold">{doctor?.availabilityLocation || "Not added yet"}</p>
            </div>
            <div>
              <p className="text-textSecondary">Address</p>
              <p className="font-semibold">{doctor?.address || "Not added yet"}</p>
            </div>
            <p className="rounded-xl bg-slate-50 p-4 text-textSecondary dark:bg-slate-800">
              Your profile appears publicly only after admin approval. Profile edits are reflected
              in doctor listings and the profile page.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card-style space-y-4">
          <h2 className="text-xl font-bold">Doctor Details</h2>
          <p className="text-sm text-textSecondary">
            Update your public details, schedule, and appointment slot settings.
          </p>
          <input
            type="text"
            name="name"
            placeholder="Doctor name"
            className="input-style"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="specialization"
            placeholder="Specialization"
            className="input-style"
            value={formData.specialization}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="qualification"
            placeholder="Qualification"
            className="input-style"
            value={formData.qualification}
            onChange={handleChange}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="number"
              name="experience"
              placeholder="Experience"
              className="input-style"
              value={formData.experience}
              onChange={handleChange}
              min="0"
              required
            />
            <input
              type="number"
              name="fees"
              placeholder="Consultation fee"
              className="input-style"
              value={formData.fees}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          <input
            type="text"
            name="availableDays"
            placeholder="Available days, comma separated"
            className="input-style"
            value={formData.availableDays}
            onChange={handleChange}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="time"
              name="startTime"
              className="input-style"
              value={formData.startTime}
              onChange={handleChange}
            />
            <input
              type="time"
              name="endTime"
              className="input-style"
              value={formData.endTime}
              onChange={handleChange}
            />
          </div>
          <input
            type="text"
            name="availableSlots"
            placeholder="Manual available slots, comma separated"
            className="input-style"
            value={formData.availableSlots}
            onChange={handleChange}
          />
          <input
            type="text"
            name="unavailableDays"
            placeholder="Unavailable days, comma separated"
            className="input-style"
            value={formData.unavailableDays}
            onChange={handleChange}
          />
          <input
            type="url"
            name="image"
            placeholder="Profile image URL"
            className="input-style"
            value={formData.image}
            onChange={handleChange}
          />
          <input
            type="text"
            name="availabilityLocation"
            placeholder="Hospital or clinic name"
            className="input-style"
            value={formData.availabilityLocation}
            onChange={handleChange}
          />
          <textarea
            name="address"
            placeholder="Clinic address"
            className="input-style min-h-28"
            value={formData.address}
            onChange={handleChange}
          />
          <textarea
            name="about"
            placeholder="About doctor"
            className="input-style min-h-28"
            value={formData.about}
            onChange={handleChange}
          />
          <button type="submit" className="button-primary w-full" disabled={saving}>
            {saving ? "Saving changes..." : "Save Doctor Profile"}
          </button>
        </form>
      </div>

      <div className="mt-8 card-style">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Patient Appointments</h2>
            <p className="mt-1 text-sm text-textSecondary">
              View the appointments booked with you by patients.
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            {appointments.length} appointments
          </span>
        </div>

        {appointments.length === 0 ? (
          <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-textSecondary dark:bg-slate-800">
            No patient appointments yet.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold">{appointment.patient?.name}</h3>
                    <p className="text-sm text-textSecondary">
                      {appointment.patient?.email || "No email"}
                    </p>
                    <p className="mt-1 text-sm text-textSecondary">
                      {appointment.date} at {appointment.time}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    <StatusBadge status={appointment.status} />
                    {appointment.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleAppointmentStatus(appointment._id, "approved")}
                          className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAppointmentStatus(appointment._id, "rejected")}
                          className="rounded-xl bg-amber-500 px-3 py-2 text-xs font-semibold text-white"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {appointment.status === "approved" && (
                      <button
                        type="button"
                        onClick={() => handleAppointmentStatus(appointment._id, "completed")}
                        className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboardPage;
