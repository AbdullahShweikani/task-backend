import mongoose from "mongoose";
import { config } from "dotenv";

config();
export async function connectDatabase() {
  const dbType = process.env.DB_TYPE;

  if (dbType === "mongo") {
    try {
      await mongoose.connect(process.env.MONGO_URI_LOCAL!, {
        dbName: process.env.DB_NAME,
      });
      console.log("🟢 Connected to MongoDB");
    } catch (err) {
      console.error("🔴 MongoDB connection error:", err);
      process.exit(1);
    }
  } else if (dbType === "sql") {
    try {
      console.log("🟢 Connected to MySQL via Prisma");
    } catch (err) {
      console.error("🔴 MySQL connection error:", err);
      process.exit(1);
    }
  } else {
    console.error('🔴 Invalid DB_TYPE. Must be "mongo" or "mysql"');
    process.exit(1);
  }
}
