import express from "express";
import { User } from "../models/User.js";

const router = express.Router();

router.post("/verify", async (req, res, next) => {
  try {
    const { userId, pin } = req.body;

    if (!userId || !/^\d{4}$/.test(pin || "")) {
      return res.status(400).json({ message: "Choose a profile and enter a 4-digit PIN." });
    }

    const user = await User.findById(userId).select("+pin");

    if (!user || user.pin !== pin) {
      return res.status(401).json({ message: "That PIN did not match this profile." });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        avatarColor: user.avatarColor,
        projectId: user.projectId,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
