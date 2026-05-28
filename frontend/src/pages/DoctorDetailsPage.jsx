import { CalendarClock, IndianRupee, Stethoscope } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchDoctorById } from "../services/doctorService";

const DoctorDetailsPage = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const response = await fetchDoctorById(id);
        setDoctor(response.doctor);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadDoctor();
  }, [id]);

  if (loading) {
    return <LoadingSpinner text="Loading doctor profile..." />;
  }

  if (!doctor) {
    return null;
  }

  return (
    <section className="section-spacing">
      <div className="container-width">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="card-style overflow-hidden p-0">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="h-[380px] w-full object-cover"
            />
          </div>

          <div className="card-style">
            <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
              {doctor.specialization}
            </span>
            <h1 className="mt-4 text-4xl font-bold">{doctor.name}</h1>
            <div className="mt-6 space-y-4 text-textSecondary">
              <div className="flex items-center gap-3">
                <Stethoscope className="text-primary" size={18} />
                <span>
                  {doctor.qualification ? `${doctor.qualification} | ` : ""}
                  {doctor.experience} years of experience
                </span>
              </div>
              <div className="flex items-center gap-3">
                <IndianRupee className="text-primary" size={18} />
                <span>{doctor.fees} consultation fee</span>
              </div>
              <div className="flex items-center gap-3">
                <CalendarClock className="text-primary" size={18} />
                <span>{doctor.availableSlots.length} available time slots</span>
              </div>
            </div>
            {doctor.about && (
              <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-textSecondary dark:bg-slate-800">
                {doctor.about}
              </p>
            )}
            {(doctor.availabilityLocation || doctor.address) && (
              <div className="mt-6 text-sm text-textSecondary">
                <p className="font-semibold text-textPrimary dark:text-slate-100">
                  {doctor.availabilityLocation || "Clinic Address"}
                </p>
                <p className="mt-1">{doctor.address}</p>
              </div>
            )}
            {doctor.availableDays?.length > 0 && (
              <p className="mt-4 text-sm text-textSecondary">
                Available: {doctor.availableDays.join(", ")}
              </p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              {doctor.availableSlots.map((slot) => (
                <span
                  key={slot}
                  className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-primary dark:bg-slate-800"
                >
                  {slot}
                </span>
              ))}
            </div>
            <Link to={`/book/${doctor._id}`} className="button-primary mt-8">
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorDetailsPage;
