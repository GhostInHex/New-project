import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDatabase } from "../src/config/database.js";
import { Project } from "../src/models/Project.js";
import { User } from "../src/models/User.js";

dotenv.config();

const projectId = new mongoose.Types.ObjectId("665000000000000000000001");
const members = [
  {
    _id: new mongoose.Types.ObjectId("665000000000000000000101"),
    email: "maya@ghost.test",
    password: "password123",
    displayName: "Maya",
    role: "UI systems",
    avatarColor: "from-rose-300 to-amber-200",
  },
  {
    _id: new mongoose.Types.ObjectId("665000000000000000000102"),
    email: "ravi@ghost.test",
    password: "password123",
    displayName: "Ravi",
    role: "Backend",
    avatarColor: "from-cyan-300 to-teal-200",
  },
  {
    _id: new mongoose.Types.ObjectId("665000000000000000000103"),
    email: "nora@ghost.test",
    password: "password123",
    displayName: "Nora",
    role: "Research",
    avatarColor: "from-lime-300 to-emerald-200",
  },
  {
    _id: new mongoose.Types.ObjectId("665000000000000000000104"),
    email: "theo@ghost.test",
    password: "password123",
    displayName: "Theo",
    role: "Writing",
    avatarColor: "from-sky-300 to-indigo-200",
  },
];

await connectDatabase();

await Project.findByIdAndUpdate(
  projectId,
  {
    name: "The Group Project Ghost",
    description: "A low-friction contribution log for a student team.",
    githubRepoUrl: "",
    inviteCode: "GHOST1",
    creatorId: members[0]._id,
    deadline: new Date("2026-05-20T18:00:00.000Z"),
    maxMembers: 6,
    status: "active",
    memberIds: members.map((member) => member._id),
  },
  { upsert: true, new: true },
);

for (const member of members) {
  const user = await User.findById(member._id).select("+password");

  if (user) {
    user.email = member.email;
    user.displayName = member.displayName;
    user.role = member.role;
    user.avatarColor = member.avatarColor;
    user.password = member.password;
    await user.save();
  } else {
    await User.create(member);
  }
}

console.log("Seeded demo project and four email/password accounts.");
await mongoose.disconnect();
