import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import asyncHandler from "../utils/asyncHandler.js";

export const bookAppointment = asyncHandler(async (request, response) => {
  const { doctorId, date, time } = request.body;

  if (!doctorId || !date || !time) {
    response.status(400);
    throw new Error("Doctor, date, and time are required.");
  }

  const doctor = await Doctor.findById(doctorId);

  if (!doctor) {
    response.status(404);
    throw new Error("Doctor not found.");
  }

  if (!doctor.availableSlots.includes(time)) {
    response.status(400);
    throw new Error("Selected slot is not available.");
  }

  const existingAppointment = await Appointment.findOne({
    doctor: doctorId,
    date,
    time,
    status: { $in: ["pending", "approved"] }
  });

  if (existingAppointment) {
    response.status(400);
    throw new Error("This slot is already booked for the selected date.");
  }

  const appointment = await Appointment.create({
    patient: request.user._id,
    doctor: doctorId,
    date,
    time,
    status: "pending"
  });

  const populatedAppointment = await appointment.populate([
    { path: "doctor" },
    { path: "patient", select: "-password" }
  ]);

  response.status(201).json({
    success: true,
    message: "Appointment booked successfully.",
    appointment: populatedAppointment
  });
});

export const getMyAppointments = asyncHandler(async (request, response) => {
  const appointments = await Appointment.find({ patient: request.user._id })
    .populate("doctor")
    .sort({ createdAt: -1 });

  response.status(200).json({
    success: true,
    appointments
  });
});

export const cancelAppointment = asyncHandler(async (request, response) => {
  const appointment = await Appointment.findById(request.params.id);

  if (!appointment) {
    response.status(404);
    throw new Error("Appointment not found.");
  }

  const isOwner = appointment.patient.toString() === request.user._id.toString();
  const isAdmin = request.user.role === "admin";

  if (!isOwner && !isAdmin) {
    response.status(403);
    throw new Error("You are not allowed to cancel this appointment.");
  }

  appointment.status = "cancelled";
  await appointment.save();

  response.status(200).json({
    success: true,
    message: "Appointment cancelled successfully."
  });
});

export const updateDoctorAppointmentStatus = asyncHandler(async (request, response) => {
  const { status } = request.body;

  if (!["approved", "rejected", "completed"].includes(status)) {
    response.status(400);
    throw new Error("Doctors can only approve, reject, or complete appointments.");
  }

  const doctor = await Doctor.findOne({ user: request.user._id });

  if (!doctor) {
    response.status(404);
    throw new Error("Doctor profile not found.");
  }

  const appointment = await Appointment.findById(request.params.id);

  if (!appointment) {
    response.status(404);
    throw new Error("Appointment not found.");
  }

  if (appointment.doctor.toString() !== doctor._id.toString()) {
    response.status(403);
    throw new Error("You can only update appointments assigned to you.");
  }

  appointment.status = status;
  await appointment.save();

  response.status(200).json({
    success: true,
    message: "Appointment status updated successfully.",
    appointment
  });
});
