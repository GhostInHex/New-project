import mongoose from "mongoose";

const pinPattern = /^\d{4}$/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    avatarColor: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "Teammate",
    },
    pin: {
      type: String,
      required: true,
      match: pinPattern,
      select: false,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
