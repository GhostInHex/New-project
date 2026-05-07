import express from "express";
import mongoose from "mongoose";
import { Rating } from "../models/Rating.js";
import { User } from "../models/User.js";

const router = express.Router();

function isScore(value) {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}

router.post("/", async (req, res, next) => {
  try {
    const { projectId, reviewerId, ratings } = req.body;

    if (!projectId || !reviewerId || !Array.isArray(ratings) || ratings.length === 0) {
      return res.status(400).json({ message: "Send a reviewer, project, and teammate ratings." });
    }

    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(reviewerId)) {
      return res.status(400).json({ message: "Invalid project or reviewer." });
    }

    const members = await User.find({ projectId }).select("_id").lean();
    const memberIds = new Set(members.map((member) => member._id.toString()));

    if (!memberIds.has(reviewerId)) {
      return res.status(403).json({ message: "Reviewer is not part of this project." });
    }

    const documents = ratings.map((rating) => {
      const targetUserId = String(rating.targetUserId || "");

      if (!memberIds.has(targetUserId)) {
        throw Object.assign(new Error("All ratings must target teammates in this project."), {
          status: 400,
        });
      }

      if (targetUserId === reviewerId) {
        throw Object.assign(new Error("Skip your own profile in peer review."), { status: 400 });
      }

      if (
        !isScore(rating.effortScore) ||
        !isScore(rating.qualityScore) ||
        !isScore(rating.collaborationScore)
      ) {
        throw Object.assign(new Error("Each score must be a whole number from 1 to 5."), {
          status: 400,
        });
      }

      return {
        projectId,
        reviewerId,
        targetUserId,
        effortScore: rating.effortScore,
        qualityScore: rating.qualityScore,
        collaborationScore: rating.collaborationScore,
      };
    });

    const operations = documents.map((document) => ({
      updateOne: {
        filter: {
          projectId: document.projectId,
          reviewerId: document.reviewerId,
          targetUserId: document.targetUserId,
        },
        update: { $set: document },
        upsert: true,
      },
    }));

    await Rating.bulkWrite(operations);

    res.status(201).json({ submitted: documents.length });
  } catch (error) {
    next(error);
  }
});

export default router;
