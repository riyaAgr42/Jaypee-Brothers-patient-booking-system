import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getProfileSummary = asyncHandler(async (request, response) => {
  const appointments = await Appointment.find({ patient: request.user._id })
    .populate("doctor")
    .sort({ createdAt: -1 });

  response.status(200).json({
    success: true,
    profile: request.user,
    stats: {
      totalAppointments: appointments.length,
      approvedAppointments: appointments.filter(
        (appointment) => appointment.status === "approved"
      ).length,
      pendingAppointments: appointments.filter(
        (appointment) => appointment.status === "pending"
      ).length
    },
    recentAppointments: appointments.slice(0, 4)
  });
});

export const updateProfile = asyncHandler(async (request, response) => {
  const { name, phone, gender, age } = request.body;

  const user = await User.findByIdAndUpdate(
    request.user._id,
    {
      name: name ?? request.user.name,
      phone: phone ?? request.user.phone,
      gender: gender ?? request.user.gender,
      age: Number(age ?? request.user.age ?? 0)
    },
    { new: true, runValidators: true }
  ).select("-password");

  response.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    user
  });
});
