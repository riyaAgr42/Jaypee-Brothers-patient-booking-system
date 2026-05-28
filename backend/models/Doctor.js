import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    specialization: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      default: "",
      trim: true
    },
    qualification: {
      type: String,
      default: "",
      trim: true
    },
    experience: {
      type: Number,
      required: true,
      min: 0
    },
    availableDays: {
      type: [String],
      default: []
    },
    startTime: {
      type: String,
      default: ""
    },
    endTime: {
      type: String,
      default: ""
    },
    slotDuration: {
      type: Number,
      default: 30,
      min: 5
    },
    unavailableDays: {
      type: [String],
      default: []
    },
    availableSlots: {
      type: [String],
      default: []
    },
    fees: {
      type: Number,
      required: true,
      min: 0
    },
    image: {
      type: String,
      default: ""
    },
    address: {
      type: String,
      default: "",
      trim: true
    },
    availabilityLocation: {
      type: String,
      default: "",
      trim: true
    },
    about: {
      type: String,
      default: "",
      trim: true
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "available", "unavailable"],
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);

export default Doctor;
