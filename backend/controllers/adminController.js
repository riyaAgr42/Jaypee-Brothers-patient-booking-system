import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateSlots, parseList } from "../utils/slotUtils.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";

export const getDashboardStats = asyncHandler(async (request, response) => {
  const [doctorsCount, activeDoctorsCount, patientsCount, appointmentsCount, pendingCount, doctorRequestsCount, appointments] =
    await Promise.all([
      Doctor.countDocuments(),
      Doctor.countDocuments({ status: { $in: ["approved", "available"] } }),
      User.countDocuments({ role: "patient" }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: "pending" }),
      Doctor.countDocuments({ status: "pending" }),
      Appointment.find()
        .populate("doctor", "name specialization")
        .populate("patient", "name email")
        .sort({ createdAt: -1 })
    ]);

  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter(
    (appointment) => appointment.date === today
  );

  response.status(200).json({
    success: true,
    stats: {
      doctorsCount,
      activeDoctorsCount,
      patientsCount,
      appointmentsCount,
      pendingCount,
      doctorRequestsCount,
      approvedCount: appointments.filter(
        (appointment) => appointment.status === "approved"
      ).length
    },
    recentAppointments: appointments.slice(0, 6),
    todayAppointments
  });
});

export const getAllDoctors = asyncHandler(async (request, response) => {
  const doctors = await Doctor.find().populate("user", "name email phone").sort({ createdAt: -1 });

  response.status(200).json({
    success: true,
    doctors
  });
});

export const createDoctor = asyncHandler(async (request, response) => {
  const {
    name,
    phone = "",
    specialization,
    qualification = "",
    experience,
    availableSlots,
    availableDays,
    startTime,
    endTime,
    slotDuration,
    fees,
    image,
    address = "",
    availabilityLocation = "",
    about = ""
  } = request.body;
  const uploadedImage = await uploadImageToCloudinary(image);

  const doctor = await Doctor.create({
    name,
    phone,
    specialization,
    qualification,
    experience,
    availableDays: parseList(availableDays),
    startTime,
    endTime,
    slotDuration: Number(slotDuration) || 30,
    availableSlots: generateSlots({ availableSlots, startTime, endTime, slotDuration }),
    fees,
    image: uploadedImage,
    address,
    availabilityLocation,
    about,
    status: "approved"
  });

  response.status(201).json({
    success: true,
    message: "Doctor added successfully.",
    doctor
  });
});

export const updateDoctorApproval = asyncHandler(async (request, response) => {
  const { status } = request.body;

  if (!["approved", "rejected", "pending", "unavailable"].includes(status)) {
    response.status(400);
    throw new Error("Invalid doctor approval status.");
  }

  const doctor = await Doctor.findById(request.params.id);

  if (!doctor) {
    response.status(404);
    throw new Error("Doctor not found.");
  }

  doctor.status = status;
  await doctor.save();

  if (doctor.user) {
    await User.findByIdAndUpdate(doctor.user, {
      "doctorProfile.status": status
    });
  }

  response.status(200).json({
    success: true,
    message:
      status === "approved"
        ? "Doctor approved and published successfully."
        : status === "rejected"
          ? "Doctor request rejected."
          : "Doctor status updated successfully.",
    doctor
  });
});

export const updateDoctor = asyncHandler(async (request, response) => {
  const doctor = await Doctor.findById(request.params.id);

  if (!doctor) {
    response.status(404);
    throw new Error("Doctor not found.");
  }

  const payload = {
    ...request.body,
    image: request.body.image
      ? await uploadImageToCloudinary(request.body.image)
      : doctor.image
  };

  const updatedDoctor = await Doctor.findByIdAndUpdate(
    request.params.id,
    payload,
    {
      new: true,
      runValidators: true
    }
  );

  response.status(200).json({
    success: true,
    message: "Doctor updated successfully.",
    doctor: updatedDoctor
  });
});

export const deleteDoctor = asyncHandler(async (request, response) => {
  const doctor = await Doctor.findById(request.params.id);

  if (!doctor) {
    response.status(404);
    throw new Error("Doctor not found.");
  }

  await doctor.deleteOne();

  response.status(200).json({
    success: true,
    message: "Doctor deleted successfully."
  });
});

export const getAllAppointments = asyncHandler(async (request, response) => {
  const appointments = await Appointment.find()
    .populate("doctor")
    .populate("patient", "-password")
    .sort({ createdAt: -1 });

  response.status(200).json({
    success: true,
    appointments
  });
});

export const updateAppointmentStatus = asyncHandler(async (request, response) => {
  const appointment = await Appointment.findById(request.params.id);

  if (!appointment) {
    response.status(404);
    throw new Error("Appointment not found.");
  }

  if (!["pending", "approved", "rejected", "completed", "cancelled"].includes(request.body.status)) {
    response.status(400);
    throw new Error("Invalid appointment status.");
  }

  appointment.status = request.body.status;
  await appointment.save();

  response.status(200).json({
    success: true,
    message: "Appointment status updated successfully."
  });
});

export const getPatients = asyncHandler(async (request, response) => {
  const patients = await User.find({ role: "patient" }).select("-password");

  response.status(200).json({
    success: true,
    patients
  });
});
