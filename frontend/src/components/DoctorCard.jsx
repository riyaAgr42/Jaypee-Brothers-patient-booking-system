import { Clock3, IndianRupee, Star, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";

const DoctorCard = ({ doctor }) => (
  <div className="card-style overflow-hidden p-0">
    <img
      src={
        doctor.image ||
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80"
      }
      alt={doctor.name}
      className="h-60 w-full object-cover"
    />
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
          {doctor.availableSlots.length > 0 ? "Available" : "No slots"}
        </span>
        <span className="inline-flex items-center gap-1 text-sm text-textSecondary">
          <Star size={15} className="text-amber-500" fill="currentColor" />
          {doctor.rating || 4.8}
        </span>
      </div>
      <h3 className="text-xl font-bold">{doctor.name}</h3>
      <p className="mt-1 text-sm text-textSecondary">{doctor.experience} years exp.</p>
      <div className="mt-3 flex items-center gap-2 text-sm text-textSecondary">
        <Stethoscope size={16} />
        <span>{doctor.specialization}</span>
      </div>
      <div className="mt-2 flex items-center gap-2 text-sm text-textSecondary">
        <IndianRupee size={16} />
        <span>{doctor.fees} consultation fee</span>
      </div>
      <div className="mt-2 flex items-center gap-2 text-sm text-textSecondary">
        <Clock3 size={16} />
        <span>{doctor.availableSlots.length} time slots available</span>
      </div>
      <div className="mt-6 flex gap-3">
        <Link to={`/doctors/${doctor._id}`} className="button-outline flex-1">
          View Details
        </Link>
        <Link to={`/book/${doctor._id}`} className="button-primary flex-1">
          Book Now
        </Link>
      </div>
    </div>
  </div>
);

export default DoctorCard;
