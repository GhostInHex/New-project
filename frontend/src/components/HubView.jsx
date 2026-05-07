import { CalendarDays, LogIn, Plus, Users } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { getMyProjects, joinProject, previewJoinProject } from "../lib/api.js";
import { Button } from "./ui/Button.jsx";
import { Card } from "./ui/Card.jsx";
import { CreateProjectModal } from "./CreateProjectModal.jsx";

function formatDeadline(value) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(value),
  );
}

function daysLeft(value) {
  const diff = new Date(value).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function HubView({ onOpenProject }) {
  const [projects, setProjects] = useState([]);
  const [inviteCode, setInviteCode] = useState("");
  const [previewProject, setPreviewProject] = useState(null);
  const [joinedProject, setJoinedProject] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [error, setError] = useState("");
  const [joinError, setJoinError] = useState("");
  const [isPending, startTransition] = useTransition();

  function loadProjects() {
    setError("");

    startTransition(async () => {
      try {
        const data = await getMyProjects();
        setProjects(data.projects || []);
      } catch (requestError) {
        setError(requestError.message);
      }
    });
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function handleProjectCreated(project) {
    setProjects((current) => [project, ...current.filter((item) => item.id !== project.id)]);
  }

  function handleJoin(event) {
    event.preventDefault();
    setJoinError("");
    setJoinedProject(null);

    startTransition(async () => {
      try {
        if (!previewProject || previewProject.inviteCode !== inviteCode) {
          const data = await previewJoinProject({ inviteCode });
          setPreviewProject(data.project);
          return;
        }

        const data = await joinProject({ inviteCode });
        setJoinedProject(data.project);
        setPreviewProject(null);
        setProjects((current) => [
          data.project,
          ...current.filter((project) => project.id !== data.project.id),
        ]);
      } catch (requestError) {
        setJoinError(requestError.message);
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <Card className="p-5 sm:p-6">
          <p className="text-sm uppercase text-emerald-200/80">Create</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">Spin up a workspace</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Start a group project, set a deadline, and share a short invite code with teammates.
          </p>
          <Button type="button" onClick={() => setIsCreateOpen(true)} className="mt-6">
            <Plus className="h-4 w-4" />
            Create Project
          </Button>
        </Card>

        <Card className="p-5 sm:p-6">
          <p className="text-sm uppercase text-cyan-100/80">Join</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">Enter invite code</h2>
          <form onSubmit={handleJoin} className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              value={inviteCode}
              onChange={(event) => {
                setInviteCode(event.target.value.toUpperCase().slice(0, 6));
                setPreviewProject(null);
              }}
              className="h-12 flex-1 rounded-lg border border-white/12 bg-slate-950/80 px-4 font-mono text-slate-100 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
              placeholder="GHOST1"
              required
            />
            <Button type="submit" disabled={isPending}>
              <LogIn className="h-4 w-4" />
              {previewProject ? "Confirm Join" : "Find Project"}
            </Button>
          </form>

          {joinError ? (
            <p className="mt-4 rounded-lg border border-red-300/20 bg-red-400/10 px-3 py-2 text-sm text-red-100" role="alert">
              {joinError}
            </p>
          ) : null}

          {joinedProject ? (
            <div className="mt-4 rounded-lg border border-cyan-200/20 bg-cyan-200/10 p-4">
              <p className="text-sm text-cyan-50">
                Joined {joinedProject.name}. Open the project when ready.
              </p>
              <Button type="button" variant="secondary" onClick={() => onOpenProject(joinedProject.id)} className="mt-3">
                Open Project
              </Button>
            </div>
          ) : null}

          {previewProject ? (
            <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm text-slate-300">You are joining:</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-50">{previewProject.name}</h3>
              <p className="mt-2 text-sm text-slate-500">
                {previewProject.memberCount}/{previewProject.maxMembers} members
              </p>
            </div>
          ) : null}
        </Card>
      </div>

      <section className="mt-6">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase text-slate-500">Active projects</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-50">Project hub</h2>
          </div>
          <Button type="button" variant="ghost" onClick={loadProjects} disabled={isPending}>
            Refresh
          </Button>
        </div>

        {error ? (
          <p className="rounded-lg border border-red-300/20 bg-red-400/10 px-3 py-2 text-sm text-red-100" role="alert">
            {error}
          </p>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={() => onOpenProject(project.id)}
              className="rounded-lg border border-white/10 bg-slate-950/62 p-5 text-left transition hover:-translate-y-1 hover:border-emerald-300/45 hover:bg-white/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
            >
              <h3 className="text-xl font-semibold text-slate-50">{project.name}</h3>
              <p className="mt-2 min-h-10 text-sm leading-5 text-slate-400">
                {project.description || "No description yet"}
              </p>
              <div className="mt-5 grid gap-2 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-emerald-200" />
                  {formatDeadline(project.deadline)} · {daysLeft(project.deadline)} days
                </span>
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4 text-cyan-100" />
                  {project.memberCount}/{project.maxMembers} members
                </span>
              </div>
              <code className="mt-5 inline-flex rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs font-bold text-emerald-100">
                {project.inviteCode}
              </code>
            </button>
          ))}
        </div>

        {!projects.length && !isPending ? (
          <div className="rounded-lg border border-dashed border-white/12 p-8 text-center text-sm text-slate-500">
            Create a project or join with a code to fill the hub.
          </div>
        ) : null}
      </section>

      {isCreateOpen ? (
        <CreateProjectModal
          onClose={() => setIsCreateOpen(false)}
          onCreated={handleProjectCreated}
        />
      ) : null}
    </div>
  );
}
