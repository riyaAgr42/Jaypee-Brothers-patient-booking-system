import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    response.status(401);
    throw new Error("Not authorized. Token is missing.");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    response.status(401);
    throw new Error("Not authorized. User not found.");
  }

  request.user = user;
  next();
});

export const adminOnly = (request, response, next) => {
  if (request.user?.role !== "admin") {
    response.status(403);
    throw new Error("Access denied. Admin only.");
  }

  next();
};

export const doctorOnly = (request, response, next) => {
  if (request.user?.role !== "doctor") {
    response.status(403);
    throw new Error("Access denied. Doctor only.");
  }

  next();
};
