import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import DoctorCard from "../components/DoctorCard";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import SectionHeading from "../components/SectionHeading";
import { fetchDoctors } from "../services/doctorService";

const DoctorsPage = () => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    specialization: "",
    minExperience: "",
    maxFees: "",
    availableDay: ""
  });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDoctors = async () => {
      setLoading(true);

      try {
        const response = await fetchDoctors({
          search,
          specialization: filters.specialization,
          minExperience: filters.minExperience,
          maxFees: filters.maxFees,
          availableDay: filters.availableDay
        });
        setDoctors(Array.isArray(response?.doctors) ? response.doctors : []);
      } catch (error) {
        console.error(error);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadDoctors, 300);
    return () => clearTimeout(timer);
  }, [search, filters]);

  return (
    <section className="section-spacing">
      <div className="container-width">
        <SectionHeading
          badge="Doctors"
          title="Find the right specialist for your healthcare needs"
          description="Search doctors by specialization and explore available consultation slots."
        />

        <div className="mx-auto mb-10 max-w-2xl">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by doctor, specialization, clinic, or address"
              className="input-style h-14 pl-14 pr-4"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-4">
          <select
            className="input-style"
            value={filters.specialization}
            onChange={(event) =>
              setFilters((current) => ({ ...current, specialization: event.target.value }))
            }
          >
            <option value="">All Specializations</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="Dentist">Dentist</option>
            <option value="Neurologist">Neurologist</option>
            <option value="Orthopedic">Orthopedic</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Pediatrician">Pediatrician</option>
            <option value="Physician">Physician</option>
          </select>
          <input
            type="number"
            className="input-style"
            placeholder="Minimum experience"
            value={filters.minExperience}
            onChange={(event) =>
              setFilters((current) => ({ ...current, minExperience: event.target.value }))
            }
          />
          <input
            type="number"
            className="input-style"
            placeholder="Maximum fees"
            value={filters.maxFees}
            onChange={(event) =>
              setFilters((current) => ({ ...current, maxFees: event.target.value }))
            }
          />
          <select
            className="input-style"
            value={filters.availableDay}
            onChange={(event) =>
              setFilters((current) => ({ ...current, availableDay: event.target.value }))
            }
          >
            <option value="">Any Day</option>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
              (day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              )
            )}
          </select>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading doctors..." />
        ) : doctors.length === 0 ? (
          <EmptyState
            title="No doctors found"
            description="Try another specialization keyword to see more doctors."
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorsPage;
