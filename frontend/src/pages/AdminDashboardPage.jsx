import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardHeader from "../components/DashboardHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import {
  createDoctorByAdmin,
  deleteDoctorByAdmin,
  fetchAdminDashboard,
  fetchAllDoctorsByAdmin,
  fetchAllAppointments,
  fetchPatients,
  updateDoctorByAdmin,
  updateDoctorApprovalByAdmin,
  updateAppointmentStatusByAdmin
} from "../services/adminService";
import { formatDate } from "../utils/helpers";

const initialDoctorForm = {
  name: "",
  specialization: "",
  qualification: "",
  experience: "",
  availableDays: "",
  startTime: "",
  endTime: "",
  slotDuration: "30",
  availableSlots: "",
  fees: "",
  image: "",
  address: "",
  availabilityLocation: "",
  about: ""
};

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctorForm, setDoctorForm] = useState(initialDoctorForm);
  const [savingDoctor, setSavingDoctor] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState("");

  const loadData = async () => {
    setLoading(true);

    try {
      const [dashboardResponse, doctorsResponse, appointmentsResponse, patientsResponse] =
        await Promise.all([
          fetchAdminDashboard(),
          fetchAllDoctorsByAdmin(),
          fetchAllAppointments(),
          fetchPatients()
        ]);

      setDashboard(dashboardResponse);
      setDoctors(doctorsResponse.doctors);
      setAppointments(appointmentsResponse.appointments);
      setPatients(patientsResponse.patients);
    } catch (error) {
      toast.error("Admin dashboard data could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDoctorChange = (event) => {
    setDoctorForm({ ...doctorForm, [event.target.name]: event.target.value });
  };

  const handleDoctorSubmit = async (event) => {
    event.preventDefault();
    setSavingDoctor(true);

    try {
      const payload = {
        ...doctorForm,
        experience: Number(doctorForm.experience),
        fees: Number(doctorForm.fees),
        availableDays: doctorForm.availableDays,
        slotDuration: Number(doctorForm.slotDuration),
        availableSlots: doctorForm.availableSlots
          .split(",")
          .map((slot) => slot.trim())
          .filter(Boolean)
      };

      const response = editingDoctorId
        ? await updateDoctorByAdmin(editingDoctorId, payload)
        : await createDoctorByAdmin(payload);
      toast.success(response.message);
      setDoctorForm(initialDoctorForm);
      setEditingDoctorId("");
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Doctor could not be added.");
    } finally {
      setSavingDoctor(false);
    }
  };

  const handleDoctorDelete = async (doctorId) => {
    try {
      const response = await deleteDoctorByAdmin(doctorId);
      toast.success(response.message);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Doctor could not be deleted.");
    }
  };

  const handleDoctorEdit = (doctor) => {
    setEditingDoctorId(doctor._id);
    setDoctorForm({
      name: doctor.name,
      specialization: doctor.specialization,
      qualification: doctor.qualification || "",
      experience: doctor.experience,
      availableDays: (doctor.availableDays || []).join(", "),
      startTime: doctor.startTime || "",
      endTime: doctor.endTime || "",
      slotDuration: String(doctor.slotDuration || 30),
      availableSlots: doctor.availableSlots.join(", "),
      fees: doctor.fees,
      image: doctor.image,
      address: doctor.address || "",
      availabilityLocation: doctor.availabilityLocation || "",
      about: doctor.about || ""
    });
  };

  const handleDoctorApproval = async (doctorId, status) => {
    try {
      const response = await updateDoctorApprovalByAdmin(doctorId, status);
      toast.success(response.message);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Doctor approval update failed.");
    }
  };

  const handleStatusChange = async (appointmentId, status) => {
    try {
      const response = await updateAppointmentStatusByAdmin(appointmentId, status);
      toast.success(response.message);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Status update failed.");
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading admin dashboard..." />;
  }

  return (
    <div>
      <DashboardHeader
        title="Admin Dashboard"
        subtitle="Manage doctors, patients, schedules, and appointment approvals."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
          title="Doctors"
          value={dashboard.stats.doctorsCount}
          subtitle="Total doctors in the system"
        />
        <StatCard
          title="Active Doctors"
          value={dashboard.stats.activeDoctorsCount}
          subtitle="Approved public doctors"
        />
        <StatCard
          title="Patients"
          value={dashboard.stats.patientsCount}
          subtitle="Registered patient accounts"
        />
        <StatCard
          title="Appointments"
          value={dashboard.stats.appointmentsCount}
          subtitle="All appointment requests"
        />
        <StatCard
          title="Pending Requests"
          value={dashboard.stats.doctorRequestsCount}
          subtitle="Doctor approvals waiting"
        />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="card-style">
          <h2 className="text-xl font-bold">Add Doctor</h2>
          <p className="mt-2 text-sm text-textSecondary">
            {editingDoctorId
              ? "Update the selected doctor details below."
              : "Create new doctor profiles and appointment slots."}
          </p>
          <form onSubmit={handleDoctorSubmit} className="mt-6 space-y-4">
            <input
              name="name"
              placeholder="Doctor name"
              className="input-style"
              value={doctorForm.name}
              onChange={handleDoctorChange}
              required
            />
            <input
              name="specialization"
              placeholder="Specialization"
              className="input-style"
              value={doctorForm.specialization}
              onChange={handleDoctorChange}
              required
            />
            <input
              name="qualification"
              placeholder="Qualification"
              className="input-style"
              value={doctorForm.qualification}
              onChange={handleDoctorChange}
            />
            <input
              name="experience"
              type="number"
              placeholder="Experience in years"
              className="input-style"
              value={doctorForm.experience}
              onChange={handleDoctorChange}
              required
            />
            <input
              name="fees"
              type="number"
              placeholder="Consultation fees"
              className="input-style"
              value={doctorForm.fees}
              onChange={handleDoctorChange}
              required
            />
            <input
              name="availableDays"
              placeholder="Available days separated by comma"
              className="input-style"
              value={doctorForm.availableDays}
              onChange={handleDoctorChange}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="startTime"
                type="time"
                className="input-style"
                value={doctorForm.startTime}
                onChange={handleDoctorChange}
              />
              <input
                name="endTime"
                type="time"
                className="input-style"
                value={doctorForm.endTime}
                onChange={handleDoctorChange}
              />
            </div>
            <input
              name="availableSlots"
              placeholder="Slots separated by comma"
              className="input-style"
              value={doctorForm.availableSlots}
              onChange={handleDoctorChange}
              required
            />
            <input
              name="availabilityLocation"
              placeholder="Clinic or hospital name"
              className="input-style"
              value={doctorForm.availabilityLocation}
              onChange={handleDoctorChange}
            />
            <textarea
              name="address"
              placeholder="Clinic address"
              className="input-style min-h-24"
              value={doctorForm.address}
              onChange={handleDoctorChange}
            />
            <textarea
              name="about"
              placeholder="About doctor"
              className="input-style min-h-24"
              value={doctorForm.about}
              onChange={handleDoctorChange}
            />
            <input
              name="image"
              placeholder="Doctor image URL"
              className="input-style"
              value={doctorForm.image}
              onChange={handleDoctorChange}
              required
            />
            <button type="submit" className="button-primary w-full" disabled={savingDoctor}>
              {savingDoctor
                ? "Saving doctor..."
                : editingDoctorId
                  ? "Update Doctor"
                  : "Add Doctor"}
            </button>
            {editingDoctorId && (
              <button
                type="button"
                className="button-outline w-full"
                onClick={() => {
                  setDoctorForm(initialDoctorForm);
                  setEditingDoctorId("");
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        <div className="card-style">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Doctor Management</h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {doctors.length} doctors
            </span>
          </div>
          <div className="space-y-4">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold">{doctor.name}</h3>
                  <p className="text-sm text-textSecondary">
                    {doctor.specialization} | {doctor.experience} years
                  </p>
                  <div className="mt-2">
                    <StatusBadge status={doctor.status} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {doctor.status === "pending" && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDoctorApproval(doctor._id, "approved")}
                        className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDoctorApproval(doctor._id, "rejected")}
                        className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDoctorEdit(doctor)}
                    className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDoctorDelete(doctor._id)}
                    className="rounded-xl bg-danger px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="card-style">
          <h2 className="text-xl font-bold">Appointment Approval Queue</h2>
          <div className="mt-6 space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="rounded-xl border border-slate-200 p-4 dark:border-slate-800"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {appointment.patient.name} with {appointment.doctor.name}
                    </h3>
                    <p className="text-sm text-textSecondary">
                      {appointment.doctor.specialization}
                    </p>
                    <p className="mt-2 text-sm text-textSecondary">
                      {formatDate(appointment.date)} at {appointment.time}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-3 lg:items-end">
                    <StatusBadge status={appointment.status} />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(appointment._id, "approved")
                        }
                        className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(appointment._id, "rejected")
                        }
                        className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-style">
            <h2 className="text-xl font-bold">Today's Schedule</h2>
            <div className="mt-6 space-y-4">
              {dashboard.todayAppointments.length === 0 ? (
                <p className="text-sm text-textSecondary">
                  No appointments scheduled for today.
                </p>
              ) : (
                dashboard.todayAppointments.map((appointment) => (
                  <div key={appointment._id} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                    <p className="font-semibold">{appointment.patient.name}</p>
                    <p className="text-sm text-textSecondary">
                      {appointment.doctor.name} at {appointment.time}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card-style">
            <h2 className="text-xl font-bold">Status Overview</h2>
            <div className="mt-6 space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>Approved</span>
                  <span>{dashboard.stats.approvedCount}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-3 rounded-full bg-emerald-500"
                    style={{
                      width: `${Math.max(
                        10,
                        (dashboard.stats.approvedCount /
                          Math.max(dashboard.stats.appointmentsCount, 1)) *
                          100
                      )}%`
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>Pending</span>
                  <span>{dashboard.stats.pendingCount}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-3 rounded-full bg-amber-500"
                    style={{
                      width: `${Math.max(
                        10,
                        (dashboard.stats.pendingCount /
                          Math.max(dashboard.stats.appointmentsCount, 1)) *
                          100
                      )}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card-style">
            <h2 className="text-xl font-bold">Patients</h2>
            <div className="mt-6 space-y-3">
              {patients.map((patient) => (
                <div
                  key={patient._id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-800"
                >
                  <div>
                    <p className="font-semibold">{patient.name}</p>
                    <p className="text-sm text-textSecondary">{patient.email}</p>
                  </div>
                  <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
                    Patient
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
