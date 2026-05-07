import { CalendarClock, Copy, X } from "lucide-react";
import { useState, useTransition } from "react";
import { createProject } from "../lib/api.js";
import { Button } from "./ui/Button.jsx";

export function CreateProjectModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [maxMembers, setMaxMembers] = useState(6);
  const [createdProject, setCreatedProject] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        const data = await createProject({ name, description, deadline, maxMembers });
        setCreatedProject(data.project);
        onCreated(data.project);
      } catch (requestError) {
        setError(requestError.message);
      }
    });
  }

  async function copyCode() {
    await navigator.clipboard.writeText(createdProject.inviteCode);
    setCopied(true);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/80 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="create-project-title">
      <div className="w-full max-w-lg rounded-lg border border-white/12 bg-slate-950 p-5 shadow-2xl shadow-black/50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase text-emerald-200/80">Create workspace</p>
            <h2 id="create-project-title" className="mt-1 text-2xl font-semibold text-slate-50">
              New project
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-lg text-slate-400 transition hover:bg-white/8 hover:text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
            aria-label="Close create project"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {createdProject ? (
          <div className="mt-6 rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-4">
            <p className="text-sm text-emerald-50">Invite code generated for {createdProject.name}</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <code className="flex min-h-12 flex-1 items-center rounded-lg border border-white/12 bg-slate-950 px-4 text-xl font-black text-slate-50">
                {createdProject.inviteCode}
              </code>
              <Button type="button" onClick={copyCode}>
                <Copy className="h-4 w-4" />
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">Project name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="h-12 w-full rounded-lg border border-white/12 bg-slate-950/80 px-4 text-slate-100 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-300">Description</span>
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="h-12 w-full rounded-lg border border-white/12 bg-slate-950/80 px-4 text-slate-100 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
                placeholder="Amazon clone MVP, OS scheduler, research sprint"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-[1fr_9rem]">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">Deadline</span>
                <input
                  type="date"
                  value={deadline}
                  onChange={(event) => setDeadline(event.target.value)}
                  className="h-12 w-full rounded-lg border border-white/12 bg-slate-950/80 px-4 text-slate-100 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-300">Max members</span>
                <input
                  type="number"
                  min="2"
                  max="20"
                  value={maxMembers}
                  onChange={(event) => setMaxMembers(Number(event.target.value))}
                  className="h-12 w-full rounded-lg border border-white/12 bg-slate-950/80 px-4 text-slate-100 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
                  required
                />
              </label>
            </div>

            {error ? (
              <p className="rounded-lg border border-red-300/20 bg-red-400/10 px-3 py-2 text-sm text-red-100" role="alert">
                {error}
              </p>
            ) : null}

            <Button type="submit" disabled={isPending} className="w-full">
              <CalendarClock className="h-4 w-4" />
              {isPending ? "Creating" : "Create Project"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
