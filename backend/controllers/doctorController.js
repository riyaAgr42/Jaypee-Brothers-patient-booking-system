import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateSlots, parseList } from "../utils/slotUtils.js";
import { uploadImageToCloudinary } from "../utils/cloudinary.js";

export const getDoctors = asyncHandler(async (request, response) => {
  const search = request.query.search?.trim() || "";
  const specialization = request.query.specialization?.trim() || "";
  const minExperience = Number(request.query.minExperience || 0);
  const maxFees = Number(request.query.maxFees || 0);
  const availableDay = request.query.availableDay?.trim() || "";
  const searchFilter = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { specialization: { $regex: search, $options: "i" } },
          { availabilityLocation: { $regex: search, $options: "i" } },
          { address: { $regex: search, $options: "i" } }
        ]
      }
    : {};
  const filter = {
    status: { $in: ["approved", "available"] },
    ...searchFilter
  };

  if (specialization) {
    filter.specialization = { $regex: specialization, $options: "i" };
  }

  if (minExperience > 0) {
    filter.experience = { $gte: minExperience };
  }

  if (maxFees > 0) {
    filter.fees = { $lte: maxFees };
  }

  if (availableDay) {
    filter.availableDays = { $regex: availableDay, $options: "i" };
  }

  const doctors = await Doctor.find(filter).sort({ createdAt: -1 });

  response.status(200).json({
    success: true,
    doctors
  });
});

export const getDoctorById = asyncHandler(async (request, response) => {
  const doctor = await Doctor.findById(request.params.id);

  if (!doctor || !["approved", "available"].includes(doctor.status)) {
    response.status(404);
    throw new Error("Doctor not found.");
  }

  response.status(200).json({
    success: true,
    doctor
  });
});

export const getMyDoctorProfile = asyncHandler(async (request, response) => {
  const doctor = await Doctor.findOne({ user: request.user._id });

  if (!doctor) {
    response.status(404);
    throw new Error("Doctor profile not found.");
  }

  const appointments = await Appointment.find({ doctor: doctor._id })
    .populate("patient", "name email")
    .sort({ createdAt: -1 });

  response.status(200).json({
    success: true,
    doctor,
    appointments
  });
});

export const updateMyDoctorProfile = asyncHandler(async (request, response) => {
  const {
    name,
    specialization,
    experience,
    fees,
    availableSlots = "",
    availableDays = "",
    startTime = "",
    endTime = "",
    slotDuration = 30,
    unavailableDays = "",
    qualification,
    image,
    address,
    availabilityLocation,
    about,
    status
  } = request.body;

  let doctor = await Doctor.findOne({ user: request.user._id });

  const nextStatus = ["pending", "approved", "rejected", "unavailable"].includes(status)
    ? status
    : doctor?.status || "pending";
  const nextName = name?.trim() || doctor?.name || request.user.name;
  const nextSpecialization = specialization?.trim() || doctor?.specialization || "";
  const nextExperience = Number(experience ?? doctor?.experience ?? 0);
  const nextFees = Number(fees ?? doctor?.fees ?? 0);
  const nextAvailableSlots = generateSlots({
    availableSlots,
    startTime: startTime || doctor?.startTime,
    endTime: endTime || doctor?.endTime,
    slotDuration: slotDuration || doctor?.slotDuration
  });
  const uploadedImage = image ? await uploadImageToCloudinary(image) : doctor?.image || "";

  if (nextStatus === "available") {
    if (!nextName || !nextSpecialization || nextAvailableSlots.length === 0) {
      response.status(400);
      throw new Error(
        "Please add your name, specialization, and at least one available slot before publishing your profile."
      );
    }
  }

  if (!doctor) {
    doctor = await Doctor.create({
      user: request.user._id,
      name: nextName,
      specialization: nextSpecialization || "General Physician",
      qualification: qualification || "",
      experience: nextExperience,
      fees: nextFees,
      availableDays: parseList(availableDays),
      startTime,
      endTime,
      slotDuration: Number(slotDuration) || 30,
      unavailableDays: parseList(unavailableDays),
      availableSlots: nextAvailableSlots,
      image: uploadedImage,
      address: address || "",
      availabilityLocation: availabilityLocation || "",
      about: about || "",
      status: nextStatus
    });
  }

  doctor.name = name ?? doctor.name;
  doctor.specialization = specialization ?? doctor.specialization;
  doctor.qualification = qualification ?? doctor.qualification;
  doctor.experience = Number(experience ?? doctor.experience);
  doctor.fees = Number(fees ?? doctor.fees);
  doctor.availableDays = availableDays === "" ? doctor.availableDays : parseList(availableDays);
  doctor.startTime = startTime ?? doctor.startTime;
  doctor.endTime = endTime ?? doctor.endTime;
  doctor.slotDuration = Number(slotDuration ?? doctor.slotDuration);
  doctor.unavailableDays =
    unavailableDays === "" ? doctor.unavailableDays : parseList(unavailableDays);
  doctor.availableSlots = nextAvailableSlots;
  doctor.image = uploadedImage || doctor.image;
  doctor.address = address ?? doctor.address;
  doctor.availabilityLocation = availabilityLocation ?? doctor.availabilityLocation;
  doctor.about = about ?? doctor.about;
  doctor.status = nextStatus;

  await doctor.save();

  await User.findByIdAndUpdate(request.user._id, {
    name: doctor.name,
    doctorProfile: {
      specialization: doctor.specialization,
      qualification: doctor.qualification,
      experience: doctor.experience,
      fees: doctor.fees,
      availableDays: doctor.availableDays,
      availableSlots: doctor.availableSlots,
      image: doctor.image,
      address: doctor.address,
      availabilityLocation: doctor.availabilityLocation,
      status: doctor.status
    }
  });

  response.status(200).json({
    success: true,
    message: "Doctor profile updated successfully.",
    doctor
  });
});
