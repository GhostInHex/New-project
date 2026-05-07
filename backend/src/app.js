import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from "./routes/auth.js";
import logRoutes from "./routes/logs.js";
import projectRoutes from "./routes/projects.js";
import ratingRoutes from "./routes/ratings.js";
import { authMiddleware } from "./middleware/auth.js";
import { notFound, errorHandler } from "./middleware/errors.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "group-project-ghost" });
});

app.use("/api/auth", authRoutes);
app.use("/api/logs", authMiddleware, logRoutes);
app.use("/api/projects", authMiddleware, projectRoutes);
app.use("/api/ratings", authMiddleware, ratingRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
