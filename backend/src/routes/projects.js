import express from "express";
import { Log } from "../models/Log.js";
import { Project } from "../models/Project.js";
import { Rating } from "../models/Rating.js";
import { User } from "../models/User.js";
import { generateDiplomatSummary } from "../services/aiService.js";

const router = express.Router();

router.get("/:id/timeline", async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).lean();

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const [members, logs] = await Promise.all([
      User.find({ projectId: project._id }).select("_id name role avatarColor").lean(),
      Log.find({ projectId: project._id })
        .sort({ timestamp: -1 })
        .populate("userId", "name role avatarColor")
        .lean(),
    ]);

    const countsByUser = new Map(members.map((member) => [member._id.toString(), 0]));

    for (const log of logs) {
      const userId = log.userId?._id?.toString() || log.userId?.toString();
      countsByUser.set(userId, (countsByUser.get(userId) || 0) + 1);
    }

    res.json({
      project: {
        id: project._id,
        name: project.name,
        description: project.description,
      },
      members: members.map((member) => ({
        id: member._id,
        name: member.name,
        role: member.role,
        avatarColor: member.avatarColor,
        updateCount: countsByUser.get(member._id.toString()) || 0,
      })),
      logs: logs.map((log) => ({
        id: log._id,
        text: log.text,
        category: log.category,
        timestamp: log.timestamp,
        user: log.userId
          ? {
              id: log.userId._id,
              name: log.userId.name,
              role: log.userId.role,
              avatarColor: log.userId.avatarColor,
            }
          : null,
      })),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/generate-summary", async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).lean();

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const [logs, ratingAverages] = await Promise.all([
      Log.find({ projectId: project._id })
        .sort({ timestamp: 1 })
        .populate("userId", "name role")
        .select("text category timestamp userId")
        .lean(),
      Rating.aggregate([
        { $match: { projectId: project._id } },
        {
          $group: {
            _id: "$targetUserId",
            effortScore: { $avg: "$effortScore" },
            qualityScore: { $avg: "$qualityScore" },
            collaborationScore: { $avg: "$collaborationScore" },
          },
        },
      ]),
    ]);

    const summary = await generateDiplomatSummary({
      project: {
        id: project._id,
        name: project.name,
        description: project.description,
      },
      logs: logs.map((log) => ({
        category: log.category,
        text: log.text,
        timestamp: log.timestamp,
        authorRole: log.userId?.role || "Teammate",
      })),
      ratingAverages: ratingAverages.map((rating) => ({
        effortScore: Number(rating.effortScore.toFixed(2)),
        qualityScore: Number(rating.qualityScore.toFixed(2)),
        collaborationScore: Number(rating.collaborationScore.toFixed(2)),
      })),
    });

    res.json(summary);
  } catch (error) {
    next(error);
  }
});

export default router;
