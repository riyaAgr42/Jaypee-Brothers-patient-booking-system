import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import { generateSlots, parseList } from "../utils/slotUtils.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerUser = asyncHandler(async (request, response) => {
  const {
    name,
    email,
    password,
    role = "patient",
    phone = "",
    gender = "",
    age = 0,
    specialization = "",
    experience = 0,
    qualification = "",
    fees = 0,
    availableSlots = "",
    availableDays = "",
    startTime = "",
    endTime = "",
    slotDuration = 30,
    image = "",
    address = "",
    availabilityLocation = "",
    about = ""
  } = request.body;

  if (!name || !email || !password) {
    response.status(400);
    throw new Error("Please fill all required fields.");
  }

  if (!emailPattern.test(email)) {
    response.status(400);
    throw new Error("Please enter a valid email address.");
  }

  if (password.length < 6) {
    response.status(400);
    throw new Error("Password must be at least 6 characters long.");
  }

  if (!["patient", "doctor"].includes(role)) {
    response.status(400);
    throw new Error("Please choose a valid role.");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    response.status(400);
    throw new Error("User already exists with this email.");
  }

  const parsedDays = parseList(availableDays);
  const parsedSlots = generateSlots({
    availableSlots,
    startTime,
    endTime,
    slotDuration
  });
  const uploadedImage = role === "doctor" ? await uploadImageToCloudinary(image) : "";

  if (role === "doctor" && (!specialization.trim() || !qualification.trim())) {
    response.status(400);
    throw new Error("Please add your specialization and qualification.");
  }

  const doctorProfile =
    role === "doctor"
      ? {
          specialization,
          experience: Number(experience) || 0,
          qualification,
          fees: Number(fees) || 0,
          availableSlots: parsedSlots,
          availableDays: parsedDays,
          image: uploadedImage,
          address,
          availabilityLocation,
          about,
          status: "pending"
        }
      : undefined;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    gender,
    age: Number(age) || 0,
    role,
    doctorProfile
  });

  if (role === "doctor") {
    await Doctor.create({
      user: user._id,
      name,
      phone,
      specialization: doctorProfile.specialization || "General Physician",
      qualification: doctorProfile.qualification,
      experience: doctorProfile.experience,
      availableDays: doctorProfile.availableDays,
      startTime,
      endTime,
      slotDuration: Number(slotDuration) || 30,
      availableSlots: doctorProfile.availableSlots,
      fees: doctorProfile.fees,
      image: doctorProfile.image,
      address: doctorProfile.address,
      availabilityLocation: doctorProfile.availabilityLocation,
      about: doctorProfile.about,
      status: "pending"
    });
  }

  response.status(201).json({
    success: true,
    message: "Registration successful.",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      age: user.age,
      role: user.role,
      token: generateToken(user._id)
    }
  });
});

export const loginUser = asyncHandler(async (request, response) => {
  const { email, password, role } = request.body;

  if (!email || !password) {
    response.status(400);
    throw new Error("Email and password are required.");
  }

  const user = await User.findOne({ email });

  if (!user) {
    response.status(401);
    throw new Error("Invalid email or password.");
  }

  if (role && user.role !== role) {
    response.status(401);
    throw new Error(`This account is registered as ${user.role}, not ${role}.`);
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    response.status(401);
    throw new Error("Invalid email or password.");
  }

  response.status(200).json({
    success: true,
    message: "Login successful.",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      age: user.age,
      role: user.role,
      token: generateToken(user._id)
    }
  });
});

export const getCurrentUser = asyncHandler(async (request, response) => {
  response.status(200).json({
    success: true,
    user: request.user
  });
});
