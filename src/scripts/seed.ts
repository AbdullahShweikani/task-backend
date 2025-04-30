import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Task } from "../models/Task";
import { User } from "../models/User";

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(
      `${process.env.MONGO_URI_LOCAL}/${process.env.DB_NAME}`
    );
    console.log("✅ Connected to DB");

    await User.deleteMany({});
    await Task.deleteMany({});
    console.log("🔄 Cleared existing users and tasks");

    const password = await bcrypt.hash("securepassword123", 10);

    const insertedUsers = await User.insertMany([
      {
        name: "Admin User",
        email: "admin@example.com",
        password,
        role: "admin",
      },
      {
        name: "John Doe",
        email: "john@example.com",
        password,
        role: "user",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password,
        role: "user",
      },
    ]);
    console.log("✅ Users seeded");



    console.log("✅ Tasks seeded");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

seed();
