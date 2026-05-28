import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { createAppointment } from "../services/appointmentService";
import { fetchDoctorById } from "../services/doctorService";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    time: ""
  });

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const response = await fetchDoctorById(id);
        setDoctor(response.doctor);
      } catch (error) {
        toast.error("Doctor details could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    loadDoctor();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await createAppointment({
        doctorId: id,
        date: formData.date,
        time: formData.time
      });
      toast.success(response.message);
      navigate("/dashboard/appointments");
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Preparing booking page..." />;
  }

  return (
    <section className="section-spacing">
      <div className="container-width">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
          <div className="card-style">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="h-72 w-full rounded-2xl object-cover"
            />
            <h2 className="mt-6 text-3xl font-bold">{doctor.name}</h2>
            <p className="mt-2 text-textSecondary">{doctor.specialization}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {doctor.availableSlots.map((slot) => (
                <span
                  key={slot}
                  className="rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary"
                >
                  {slot}
                </span>
              ))}
            </div>
          </div>

          <div className="card-style">
            <h1 className="text-3xl font-bold">Book your appointment</h1>
            <p className="mt-2 text-textSecondary">
              Choose a date and available time slot for your consultation.
            </p>
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">Appointment date</label>
                <input
                  type="date"
                  className="input-style"
                  value={formData.date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(event) =>
                    setFormData({ ...formData, date: event.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Available slot</label>
                <select
                  className="input-style"
                  value={formData.time}
                  onChange={(event) =>
                    setFormData({ ...formData, time: event.target.value })
                  }
                  required
                >
                  <option value="">Select a time slot</option>
                  {doctor.availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="button-primary w-full" disabled={submitting}>
                {submitting ? "Booking appointment..." : "Confirm Booking"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingPage;
