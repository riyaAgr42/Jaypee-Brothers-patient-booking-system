import { ArrowRight, CheckCircle2, HeartPulse, ShieldPlus, Star } from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import DoctorCard from "../components/DoctorCard";
import { services, testimonials, whyChooseUs } from "../utils/constants";
import { useEffect, useState } from "react";
import { fetchDoctors } from "../services/doctorService";

const HomePage = () => {
  const [topDoctors, setTopDoctors] = useState([]);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const response = await fetchDoctors();
        const doctorsList = Array.isArray(response?.doctors) ? response.doctors : [];
        setTopDoctors(doctorsList.slice(0, 3));
      } catch (error) {
        console.error(error);
        setTopDoctors([]);
      }
    };

    loadDoctors();
  }, []);

  return (
    <div>
      <section className="section-spacing overflow-hidden">
        <div className="container-width grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
              Smart Healthcare Booking
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl">
              Book trusted doctor appointments with a calm, modern experience.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-textSecondary">
              DocEase helps patients discover specialists, book
              slots, and manage appointments from a clean healthcare dashboard.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link to="/doctors" className="button-primary">
                Explore Doctors <ArrowRight className="ml-2" size={18} />
              </Link>
              <Link to="/register" className="button-outline">
                Create Account
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-6">
              <div>
                <p className="text-3xl font-bold text-primary">500+</p>
                <p className="text-sm text-textSecondary">Appointments managed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-secondary">50+</p>
                <p className="text-sm text-textSecondary">Healthcare specialists</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">99%</p>
                <p className="text-sm text-textSecondary">Patient satisfaction</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[2rem] bg-hero-gradient blur-3xl" />
            <div className="relative rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=1200&q=80"
                alt="Healthcare team"
                className="h-[420px] w-full rounded-[1.5rem] object-cover"
              />
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-blue-50 p-4 dark:bg-slate-800">
                  <HeartPulse className="text-primary" />
                  <p className="mt-2 font-semibold">Patient First</p>
                </div>
                <div className="rounded-xl bg-teal-50 p-4 dark:bg-slate-800">
                  <ShieldPlus className="text-secondary" />
                  <p className="mt-2 font-semibold">Secure Access</p>
                </div>
                <div className="rounded-xl bg-slate-100 p-4 dark:bg-slate-800">
                  <Star className="text-amber-500" />
                  <p className="mt-2 font-semibold">Top Rated Care</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-white dark:bg-slate-950">
        <div className="container-width">
          <SectionHeading
            badge="Services"
            title="Built around the complete patient booking journey"
            description="Every major flow is kept simple, responsive, and easy to explain during interviews."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <div key={service.title} className="card-style">
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                  <CheckCircle2 size={22} />
                </div>
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="mt-3 text-textSecondary">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-width">
          <SectionHeading
            badge="Doctors"
            title="Top specialists ready for consultation"
            description="Browse featured doctors with specialization, experience, fees, and availability."
          />
          <div className="grid gap-6 lg:grid-cols-3">
            {topDoctors.map((doctor) => (
              <DoctorCard key={doctor._id} doctor={doctor} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing bg-white dark:bg-slate-950">
        <div className="container-width">
          <SectionHeading
            badge="Why Choose Us"
            title="Designed to feel professional and easy to use"
            description="The project follows a consistent healthcare theme with clean components and readable code."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {whyChooseUs.map((item) => (
              <div key={item} className="card-style flex items-start gap-3">
                <CheckCircle2 className="mt-1 text-secondary" size={20} />
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-width">
          <SectionHeading
            badge="Testimonials"
            title="What users love about DocEase"
            description="Sample testimonials make the landing page feel realistic and polished."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.name} className="card-style">
                <div className="mb-4 flex text-amber-500">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} size={18} fill="currentColor" />
                  ))}
                </div>
                <p className="text-textSecondary">"{item.quote}"</p>
                <h3 className="mt-4 text-lg font-semibold">{item.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
