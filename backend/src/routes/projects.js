import express from "express";
import { Log } from "../models/Log.js";
import { Project } from "../models/Project.js";
import { Rating } from "../models/Rating.js";
import { User } from "../models/User.js";
import { generateDiplomatSummary, generatePrivateCoaching } from "../services/aiService.js";

const router = express.Router();

function normalizeInviteCode(value) {
  return String(value || "").trim().toUpperCase().replace(/\s+/g, "");
}

function generateInviteCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let index = 0; index < 6; index += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return code;
}

async function createUniqueInviteCode() {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const inviteCode = generateInviteCode();
    const existingProject = await Project.exists({ inviteCode });

    if (!existingProject) {
      return inviteCode;
    }
  }

  throw Object.assign(new Error("Could not generate a unique invite code."), { status: 500 });
}

function projectCard(project) {
  return {
    id: project._id,
    name: project.name,
    description: project.description,
    githubRepoUrl: project.githubRepoUrl || "",
    inviteCode: project.inviteCode,
    creatorId: project.creatorId,
    deadline: project.deadline,
    maxMembers: project.maxMembers,
    status: project.status || "active",
    memberCount: project.memberIds.length,
    createdAt: project.createdAt,
  };
}

router.get("/my-projects", async (req, res, next) => {
  try {
    const projects = await Project.find({ memberIds: req.user._id })
      .sort({ updatedAt: -1 })
      .lean();

    res.json({ projects: projects.map(projectCard) });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const name = String(req.body.name || "").trim();
    const description = String(req.body.description || "").trim();
    const githubRepoUrl = String(req.body.githubRepoUrl || "").trim();
    const deadline = new Date(req.body.deadline);
    const maxMembers = Number(req.body.maxMembers || 6);

    if (!name) {
      return res.status(400).json({ message: "Project name is required." });
    }

    if (Number.isNaN(deadline.getTime())) {
      return res.status(400).json({ message: "Choose a valid project deadline." });
    }

    if (!Number.isInteger(maxMembers) || maxMembers < 2 || maxMembers > 20) {
      return res.status(400).json({ message: "Max members must be between 2 and 20." });
    }

    const project = await Project.create({
      name,
      description,
      githubRepoUrl,
      inviteCode: await createUniqueInviteCode(),
      creatorId: req.user._id,
      deadline,
      maxMembers,
      status: "active",
      memberIds: [req.user._id],
    });

    res.status(201).json({ project: projectCard(project) });
  } catch (error) {
    next(error);
  }
});

router.post("/join-preview", async (req, res, next) => {
  try {
    const inviteCode = normalizeInviteCode(req.body.inviteCode);
    const project = await Project.findOne({ inviteCode }).lean();

    if (!project) {
      return res.status(404).json({ message: "No project found for that invite code." });
    }

    res.json({
      project: {
        id: project._id,
        name: project.name,
        description: project.description,
        githubRepoUrl: project.githubRepoUrl || "",
        inviteCode: project.inviteCode,
        deadline: project.deadline,
        maxMembers: project.maxMembers,
        memberCount: project.memberIds.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/join", async (req, res, next) => {
  try {
    const inviteCode = normalizeInviteCode(req.body.inviteCode);
    const project = await Project.findOne({ inviteCode });

    if (!project) {
      return res.status(404).json({ message: "No project found for that invite code." });
    }

    const isAlreadyMember = project.memberIds.some((memberId) => memberId.equals(req.user._id));

    if (!isAlreadyMember && project.memberIds.length >= project.maxMembers) {
      return res.status(409).json({ message: "This project has reached its member limit." });
    }

    if (!isAlreadyMember) {
      project.memberIds.push(req.user._id);
      await project.save();
    }

    res.json({ project: projectCard(project), alreadyMember: isAlreadyMember });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/toggle-status", async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, memberIds: req.user._id });

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    project.status = project.status === "archived" ? "active" : "archived";
    await project.save();

    res.json({ project: projectCard(project) });
  } catch (error) {
    next(error);
  }
});

router.get("/:id/my-feedback", async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, memberIds: req.user._id }).lean();

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const [averages] = await Rating.aggregate([
      {
        $match: {
          projectId: project._id,
          targetUserId: req.user._id,
        },
      },
      {
        $group: {
          _id: "$targetUserId",
          effortScore: { $avg: "$effortScore" },
          qualityScore: { $avg: "$qualityScore" },
          collaborationScore: { $avg: "$collaborationScore" },
        },
      },
    ]);

    if (!averages) {
      return res.json({
        private_coaching:
          "Strictly private coaching will appear here after teammates submit peer reviews for this project. For now, keep using the final reflection as a group-level signal and treat the next project as a fresh chance to make contributions visible.",
        provider: "no-ratings-yet",
      });
    }

    const coaching = await generatePrivateCoaching({
      effortScore: Number(averages.effortScore.toFixed(2)),
      qualityScore: Number(averages.qualityScore.toFixed(2)),
      collaborationScore: Number(averages.collaborationScore.toFixed(2)),
    });

    res.json(coaching);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/timeline", async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, memberIds: req.user._id }).lean();

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const [members, logs] = await Promise.all([
      User.find({ _id: { $in: project.memberIds } })
        .select("_id displayName role avatarColor avatarUrl")
        .lean(),
      Log.find({ projectId: project._id })
        .sort({ timestamp: -1 })
        .populate("userId", "displayName role avatarColor avatarUrl")
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
        githubRepoUrl: project.githubRepoUrl || "",
        inviteCode: project.inviteCode,
        deadline: project.deadline,
        maxMembers: project.maxMembers,
        status: project.status || "active",
      },
      members: members.map((member) => ({
        id: member._id,
        name: member.displayName,
        displayName: member.displayName,
        role: member.role,
        avatarColor: member.avatarColor,
        avatarUrl: member.avatarUrl,
        updateCount: countsByUser.get(member._id.toString()) || 0,
      })),
      logs: logs.map((log) => ({
        id: log._id,
        text: log.text,
        category: log.category,
        githubLink: log.githubLink || "",
        timestamp: log.timestamp,
        user: log.userId
          ? {
              id: log.userId._id,
              name: log.userId.displayName,
              displayName: log.userId.displayName,
              role: log.userId.role,
              avatarColor: log.userId.avatarColor,
              avatarUrl: log.userId.avatarUrl,
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
    const project = await Project.findOne({ _id: req.params.id, memberIds: req.user._id }).lean();

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const [logs, ratingAverages] = await Promise.all([
      Log.find({ projectId: project._id })
        .sort({ timestamp: 1 })
        .populate("userId", "displayName role")
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
