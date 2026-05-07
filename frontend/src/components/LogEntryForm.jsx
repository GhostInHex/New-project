import { Github, SendHorizontal, X } from "lucide-react";
import { useState, useTransition } from "react";
import { createLog } from "../lib/api.js";
import { Avatar } from "./ui/Avatar.jsx";
import { Button } from "./ui/Button.jsx";
import { Card } from "./ui/Card.jsx";
import { Textarea } from "./ui/Textarea.jsx";

const categories = ["UI", "Backend", "Research", "Writing", "Planning"];

function normalizeThreeLines(value) {
  return value.split(/\r?\n/).slice(0, 3).join("\n").slice(0, 360);
}

export function LogEntryForm({ user, projectId, onSignOut, onLogCreated }) {
  const [category, setCategory] = useState(categories[0]);
  const [text, setText] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [isGithubOpen, setIsGithubOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const remaining = 360 - text.length;

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    startTransition(async () => {
      try {
        await createLog({
          projectId,
          category,
          text,
          githubLink,
        });
        setText("");
        setGithubLink("");
        setIsGithubOpen(false);
        setNotice("Update posted. Tiny receipts, future-you will thank us.");
        onLogCreated?.();
      } catch (requestError) {
        setError(requestError.message);
      }
    });
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-5 lg:grid-cols-[0.85fr_1.15fr]">
      <Card className="p-5">
        <div className="flex items-center gap-4">
          <Avatar profile={user} />
          <div>
            <p className="text-sm uppercase text-emerald-200/80">Unlocked profile</p>
            <h1 className="text-3xl font-semibold text-slate-50">
              {user.displayName || user.name}
            </h1>
            <p className="mt-1 text-slate-400">{user.role}</p>
          </div>
        </div>

        <div className="mt-8 space-y-4 text-sm leading-6 text-slate-300">
          <p>
            Log what moved today. This is for shared clarity inside the team, not for scoring or
            calling anyone out.
          </p>
          <p className="rounded-lg border border-emerald-300/15 bg-emerald-300/8 p-3 text-emerald-50">
            Good updates are short: what changed, what is blocked, and what you are picking up next.
          </p>
        </div>

        <Button type="button" variant="secondary" onClick={onSignOut} className="mt-8 w-full">
          Switch profile
        </Button>
      </Card>

      <Card className="p-5 sm:p-6">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase text-slate-500">Daily contribution</p>
              <h2 className="text-2xl font-semibold text-slate-50">Post an update</h2>
            </div>
            <p className="text-sm text-slate-500">{remaining} characters left</p>
          </div>

          <fieldset className="mt-6">
            <legend className="mb-3 text-sm font-medium text-slate-300">Category</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {categories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`min-h-11 rounded-lg border px-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 ${
                    category === item
                      ? "border-emerald-300 bg-emerald-300 text-slate-950"
                      : "border-white/12 bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                  aria-pressed={category === item}
                >
                  {item}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-4">
            <button
              type="button"
              onClick={() => setIsGithubOpen((value) => !value)}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-400 transition hover:bg-white/8 hover:text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
              aria-expanded={isGithubOpen}
            >
              <Github className="h-4 w-4" />
              Relevant PR / Link
            </button>

            <div
              className={`grid transition-all duration-200 ${
                isGithubOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <label className="mt-3 block">
                  <span className="sr-only">Attach a relevant PR or Link (Optional)</span>
                  <span className="relative block">
                    <Github className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="url"
                      value={githubLink}
                      onChange={(event) => setGithubLink(event.target.value)}
                      className="h-11 w-full rounded-lg border border-white/12 bg-slate-950/70 py-2 pl-11 pr-12 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
                      placeholder="Attach a relevant PR or Link (Optional)"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setGithubLink("");
                        setIsGithubOpen(false);
                      }}
                      className="absolute right-1 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-slate-500 transition hover:bg-white/8 hover:text-slate-200"
                      aria-label="Remove GitHub link"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                </label>
              </div>
            </div>
          </div>

          <label className="mt-6 block">
            <span className="mb-3 block text-sm font-medium text-slate-300">Update</span>
            <Textarea
              value={text}
              onChange={(event) => setText(normalizeThreeLines(event.target.value))}
              placeholder={"Example:\nFinished the empty state cards.\nNeed copy review tomorrow."}
              aria-describedby="log-help"
            />
          </label>
          <p id="log-help" className="mt-2 text-sm text-slate-500">
            Maximum 3 lines. Keep it factual and kind.
          </p>

          {error ? (
            <p className="mt-4 rounded-lg border border-red-300/20 bg-red-400/10 px-3 py-2 text-sm text-red-100" role="alert">
              {error}
            </p>
          ) : null}
          {notice ? (
            <p className="mt-4 rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm text-emerald-50" role="status">
              {notice}
            </p>
          ) : null}

          <Button type="submit" disabled={!text.trim() || isPending} className="mt-6 w-full sm:w-auto">
            <SendHorizontal className="h-4 w-4" />
            {isPending ? "Posting" : "Post Update"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
