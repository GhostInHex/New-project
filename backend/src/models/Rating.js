import mongoose from "mongoose";

const scoreRule = {
  type: Number,
  required: true,
  min: 1,
  max: 5,
};

const ratingSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    effortScore: scoreRule,
    qualityScore: scoreRule,
    collaborationScore: scoreRule,
  },
  { timestamps: true },
);

ratingSchema.index({ projectId: 1, reviewerId: 1, targetUserId: 1 }, { unique: true });

export const Rating = mongoose.model("Rating", ratingSchema);
