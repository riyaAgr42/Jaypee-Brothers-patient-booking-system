import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { compressImageFile } from "../utils/imageUtils";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    role: "patient",
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    age: "",
    specialization: "",
    experience: "",
    qualification: "",
    fees: "",
    availableSlots: "",
    availableDays: "",
    startTime: "",
    endTime: "",
    slotDuration: "30",
    image: "",
    availabilityLocation: "",
    address: "",
    about: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Please select an image smaller than 5 MB.");
      return;
    }

    try {
      const compressedImage = await compressImageFile(file);
      setFormData((current) => ({ ...current, image: compressedImage }));
      toast.success("Image selected and optimized.");
    } catch (error) {
      toast.error(error.message || "Image could not be processed.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const user = await register(formData);
      navigate(user.role === "doctor" ? "/doctor" : "/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section-spacing">
      <div className="container-width">
        <div className="mx-auto max-w-md card-style">
          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="mt-2 text-textSecondary">
            Register with your basic details. Doctors can add public booking details here.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-textSecondary">
                Role
              </label>
              <select
                id="role"
                name="role"
                className="input-style"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              autoComplete="name"
              className="input-style"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
              className="input-style"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              autoComplete="new-password"
              className="input-style"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone number"
              className="input-style"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {formData.role === "patient" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <select
                  name="gender"
                  className="input-style"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <input
                  type="number"
                  name="age"
                  placeholder="Age"
                  className="input-style"
                  value={formData.age}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
            )}
            {formData.role === "doctor" && (
              <div className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-bold">Doctor Details</h2>
                  <p className="mt-1 text-sm text-textSecondary">
                    These details will be shown to patients for appointment booking.
                  </p>
                </div>
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
                  placeholder="Qualification e.g. MBBS, MD"
                  className="input-style"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="number"
                    name="experience"
                    placeholder="Experience in years"
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
                  placeholder="Available days e.g. Monday, Tuesday, Friday"
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
                  placeholder="Manual slots, comma separated e.g. 10:00 AM, 11:30 AM"
                  className="input-style"
                  value={formData.availableSlots}
                  onChange={handleChange}
                />
                <input
                  type="file"
                  accept="image/*"
                  className="input-style"
                  onChange={handleImageChange}
                />
                <input
                  type="url"
                  name="image"
                  placeholder="Or paste profile image URL"
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
                  className="input-style min-h-24"
                  value={formData.address}
                  onChange={handleChange}
                />
                <textarea
                  name="about"
                  placeholder="About doctor"
                  className="input-style min-h-24"
                  value={formData.about}
                  onChange={handleChange}
                />
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Doctor accounts are submitted as pending. Admin approval is required before
                  patients can find and book you.
                </p>
              </div>
            )}
            <button type="submit" className="button-primary w-full" disabled={submitting}>
              {submitting ? "Creating account..." : "Register"}
            </button>
          </form>
          <p className="mt-6 text-sm text-textSecondary">
            Already registered?{" "}
            <Link to="/login" className="font-semibold text-primary">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
