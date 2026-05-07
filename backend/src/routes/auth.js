import express from "express";
import {
  AUTH_COOKIE_NAME,
  authMiddleware,
  cookieOptions,
  publicUser,
  signSession,
} from "../middleware/auth.js";
import { User } from "../models/User.js";

const router = express.Router();

function setSessionCookie(res, userId) {
  res.cookie(AUTH_COOKIE_NAME, signSession(userId), cookieOptions());
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

router.post("/register", async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");
    const displayName = String(req.body.displayName || "").trim();

    if (!email || !password || !displayName) {
      return res.status(400).json({ message: "Email, password, and display name are required." });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "An account already exists for that email." });
    }

    const user = await User.create({
      email,
      password,
      displayName,
      avatarColor: "from-emerald-300 to-cyan-200",
    });

    setSessionCookie(res, user.id);
    res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Email or password is incorrect." });
    }

    setSessionCookie(res, user.id);
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, cookieOptions());
  res.json({ ok: true });
});

router.get("/me", authMiddleware, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

router.patch("/me", authMiddleware, async (req, res, next) => {
  try {
    const displayName = String(req.body.displayName || "").trim();
    const avatarUrl = String(req.body.avatarUrl || "").trim();

    if (!displayName) {
      return res.status(400).json({ message: "Display name is required." });
    }

    req.user.displayName = displayName;
    req.user.avatarUrl = avatarUrl;
    await req.user.save();

    res.json({ user: publicUser(req.user) });
  } catch (error) {
    next(error);
  }
});

export default router;
