import { config } from "dotenv";
import mongoose from "mongoose";
import { User } from "./models/userSchema.js";

config({ path: "./config/config.env" });

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in config.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "HOSPITAL_MANAGEMENT",
    });
    console.log("Connected to database.");

    const existing = await User.findOne({ role: "Admin" });
    if (existing) {
      console.log(`Admin already exists: ${existing.email}`);
      process.exit(0);
    }

    await User.create({
      firstName: "Admin",
      lastName: "MedCare",
      email,
      phone: "1234567890",
      aadhaar: "123456789012",
      dob: "1990-01-01",
      gender: "Male",
      password,
      role: "Admin",
    });

    console.log(`Admin created with email: ${email}`);
    process.exit(0);
  } catch (err) {
    console.error("Failed to seed admin:", err.message);
    process.exit(1);
  }
};

seedAdmin();
