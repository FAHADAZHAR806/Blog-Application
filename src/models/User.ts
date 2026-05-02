import mongoose, { Schema, Document } from "mongoose";

// Define the User interface for TypeScript
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional because of select: false
  role: "author" | "reader" | "admin";
  profileImage?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
      select: false, // Automatically hide password from API queries
    },
    role: {
      type: String,
      enum: ["author", "reader", "admin"],
      default: "reader",
    },
    profileImage: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
  },
  { timestamps: true },
);

// Check if model exists before creating a new one (Next.js HMR fix)
export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
