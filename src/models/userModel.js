import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    required: [true, "username is required"],
    unique: [true, "username already taken"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "email already linked to another account"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

// preSave etc. hooks are not in standard practice of Next.js

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;
