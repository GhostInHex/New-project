import express from "express";
import { Log, LOG_CATEGORIES } from "../models/Log.js";
import { Project } from "../models/Project.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { projectId, text, category } = req.body;
    const cleanText = String(text || "").trim();

    if (!projectId) {
      return res.status(400).json({ message: "A project is required." });
    }

    if (!LOG_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: "Choose a contribution category." });
    }

    if (!cleanText || cleanText.split(/\r?\n/).length > 3 || cleanText.length > 360) {
      return res.status(400).json({ message: "Keep your update to 3 short lines or fewer." });
    }

    const project = await Project.findOne({ _id: projectId, memberIds: req.user._id });

    if (!project) {
      return res.status(403).json({ message: "This account is not part of that project." });
    }

    const log = await Log.create({
      userId: req.user._id,
      projectId,
      text: cleanText,
      category,
    });

    res.status(201).json({ log });
  } catch (error) {
    next(error);
  }
});

export default router;
