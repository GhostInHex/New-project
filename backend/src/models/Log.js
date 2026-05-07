import mongoose from "mongoose";

export const LOG_CATEGORIES = ["UI", "Backend", "Research", "Writing", "Planning"];

const logSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 360,
    },
    category: {
      type: String,
      enum: LOG_CATEGORIES,
      required: true,
    },
    githubLink: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true },
);

logSchema.path("text").validate(function validateLineCount(value) {
  return value.split(/\r?\n/).length <= 3;
}, "Log text must be 3 lines or fewer.");

export const Log = mongoose.model("Log", logSchema);
