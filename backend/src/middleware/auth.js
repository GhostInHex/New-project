import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const AUTH_COOKIE_NAME = "gpg_session";

export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: "/",
  };
}

export function signSession(userId) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is required.");
  }

  return jwt.sign({ sub: userId }, secret, { expiresIn: "7d" });
}

export function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    name: user.displayName,
    avatarUrl: user.avatarUrl,
    avatarColor: user.avatarColor,
    role: user.role,
  };
}

export async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies?.[AUTH_COOKIE_NAME];

    if (!token) {
      return res.status(401).json({ message: "Please log in to continue." });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({ message: "Session user was not found." });
    }

    req.user = user;
    next();
  } catch (_error) {
    res.clearCookie(AUTH_COOKIE_NAME, cookieOptions());
    res.status(401).json({ message: "Session expired. Please log in again." });
  }
}
