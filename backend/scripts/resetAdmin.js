import bcrypt from "bcryptjs";
import loadEnv from "../config/loadEnv.js";
import connectDatabase from "../config/db.js";
import User from "../models/User.js";

loadEnv();

const resetAdmin = async () => {
  await connectDatabase();

  const email = process.env.ADMIN_EMAIL || "admin@docease.com";
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "DocEase Admin";

  if (!password) {
    throw new Error("ADMIN_PASSWORD is required to reset the admin account.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const existingAdmin = await User.findOne({ role: "admin" });

  if (existingAdmin) {
    existingAdmin.name = name;
    existingAdmin.email = email;
    existingAdmin.password = hashedPassword;
    existingAdmin.role = "admin";
    await existingAdmin.save();
  } else {
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin"
    });
  }

  console.log(`Admin reset complete: ${email}`);
  process.exit(0);
};

resetAdmin().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
