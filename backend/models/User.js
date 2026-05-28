import mongoose from "mongoose";

const doctorProfileSchema = new mongoose.Schema(
  {
    specialization: {
      type: String,
      default: "",
      trim: true
    },
    experience: {
      type: Number,
      default: 0,
      min: 0
    },
    fees: {
      type: Number,
      default: 0,
      min: 0
    },
    availableSlots: {
      type: [String],
      default: []
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
    status: {
      type: String,
      enum: ["pending", "available", "unavailable"],
      default: "pending"
    }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      default: "",
      trim: true
    },
    gender: {
      type: String,
      enum: ["", "male", "female", "other"],
      default: ""
    },
    age: {
      type: Number,
      min: 0,
      default: 0
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient"
    },
    doctorProfile: {
      type: doctorProfileSchema,
      default: () => ({})
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
