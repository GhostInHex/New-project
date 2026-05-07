import express from "express";
import { Log, LOG_CATEGORIES } from "../models/Log.js";
import { User } from "../models/User.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { userId, projectId, text, category } = req.body;
    const cleanText = String(text || "").trim();

    if (!userId || !projectId) {
      return res.status(400).json({ message: "A profile and project are required." });
    }

    if (!LOG_CATEGORIES.includes(category)) {
      return res.status(400).json({ message: "Choose a contribution category." });
    }

    if (!cleanText || cleanText.split(/\r?\n/).length > 3 || cleanText.length > 360) {
      return res.status(400).json({ message: "Keep your update to 3 short lines or fewer." });
    }

    const user = await User.findOne({ _id: userId, projectId });

    if (!user) {
      return res.status(403).json({ message: "This profile is not part of that project." });
    }

    const log = await Log.create({
      userId,
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
