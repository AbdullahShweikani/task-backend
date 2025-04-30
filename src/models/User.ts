import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 10,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      
    },
  },

  { timestamps: true }
);

export const User = model("User", userSchema);
