import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";

let isConnected = false;

const starterDoctors = [
  {
    name: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    experience: 10,
    availableSlots: ["10:00 AM", "11:30 AM", "03:00 PM"],
    fees: 1200,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Dr. Michael Chen",
    specialization: "Dermatologist",
    experience: 7,
    availableSlots: ["09:00 AM", "01:00 PM", "04:30 PM"],
    fees: 900,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Dr. Priya Sharma",
    specialization: "Pediatrician",
    experience: 12,
    availableSlots: ["10:30 AM", "12:00 PM", "05:00 PM"],
    fees: 1000,
    image: "https://images.unsplash.com/photo-1594824475317-6d983b9bc4d0?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Dr. Arjun Mehta",
    specialization: "Physician",
    qualification: "MBBS, MD",
    experience: 9,
    availableDays: ["Monday", "Tuesday", "Thursday", "Friday"],
    availableSlots: ["09:30 AM", "12:30 PM", "04:00 PM"],
    fees: 800,
    address: "DocEase General Clinic, New Delhi",
    availabilityLocation: "DocEase General Clinic",
    about: "Experienced physician for general consultation, fever, diabetes, blood pressure, and routine health concerns.",
    status: "approved",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80"
  }
];

const seedInitialData = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@docease.com";
  const adminName = process.env.ADMIN_NAME || "DocEase Admin";
  const adminPassword = process.env.ADMIN_PASSWORD;
  const legacyAdmin = await User.findOne({ email: "admin@medicare.com", role: "admin" });
  const adminExists = await User.findOne({ email: adminEmail });
  const anyAdmin = await User.findOne({ role: "admin" });
  const adminUser = adminExists || legacyAdmin || anyAdmin;

  if (!adminPassword) {
    console.warn("ADMIN_PASSWORD is missing. Admin seed/reset skipped.");
  } else if (!adminUser) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin"
    });
  } else {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    adminUser.name = adminName;
    adminUser.email = adminEmail;
    adminUser.password = hashedPassword;
    adminUser.role = "admin";
    await adminUser.save();
  }

  const doctorCount = await Doctor.countDocuments();

  if (doctorCount === 0) {
    await Doctor.insertMany(starterDoctors);
  }
};

const connectDatabase = async () => {
  if (isConnected) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is missing. Add it to the root .env file or backend/.env with your MongoDB Atlas connection string."
    );
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = connection.connections[0].readyState === 1;

    await seedInitialData();
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
  }
};

export default connectDatabase;
