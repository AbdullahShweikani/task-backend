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

    const admin = insertedUsers.find((u) => u.role === "admin")!;
    const users = insertedUsers.filter((u) => u.role === "user");

    const taskData = Array.from({ length: 10 }).map((_, i) => ({
      title: `Task ${i + 1}`,
      description: `Description for Task ${i + 1}`,
      dueDate: new Date(Date.now() + i * 86400000),
      priority: i % 3 === 0 ? "High" : i % 3 === 1 ? "Medium" : "Low",
      status: i % 3 === 0 ? "To Do" : i % 3 === 1 ? "In Progress" : "Done",
      assignedTo: users[i % users.length]._id,
      createdBy: admin._id, // ✅ Created by admin
      isRecurring: i % 2 === 0,
      recurrencePattern: i % 2 === 0 ? "daily" : null,
    }));

    await Task.insertMany(taskData);
    console.log("✅ Tasks seeded");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

seed();
