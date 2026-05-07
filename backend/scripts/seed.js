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
    name: "Maya",
    role: "UI systems",
    avatarColor: "from-rose-300 to-amber-200",
    pin: "1111",
  },
  {
    _id: new mongoose.Types.ObjectId("665000000000000000000102"),
    name: "Ravi",
    role: "Backend",
    avatarColor: "from-cyan-300 to-teal-200",
    pin: "2222",
  },
  {
    _id: new mongoose.Types.ObjectId("665000000000000000000103"),
    name: "Nora",
    role: "Research",
    avatarColor: "from-lime-300 to-emerald-200",
    pin: "3333",
  },
  {
    _id: new mongoose.Types.ObjectId("665000000000000000000104"),
    name: "Theo",
    role: "Writing",
    avatarColor: "from-sky-300 to-indigo-200",
    pin: "4444",
  },
];

await connectDatabase();

await Project.findByIdAndUpdate(
  projectId,
  {
    name: "The Group Project Ghost",
    description: "A low-friction contribution log for a student team.",
    memberIds: members.map((member) => member._id),
  },
  { upsert: true, new: true },
);

await Promise.all(
  members.map((member) =>
    User.findByIdAndUpdate(member._id, { ...member, projectId }, { upsert: true, new: true }),
  ),
);

console.log("Seeded demo project and four PIN profiles.");
await mongoose.disconnect();
