import { Activity, RefreshCcw } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getTimeline } from "../lib/api.js";
import { Avatar } from "./ui/Avatar.jsx";
import { Button } from "./ui/Button.jsx";
import { Card } from "./ui/Card.jsx";

function formatDate(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function TimelineDashboard({
  projectId,
  projectStatus = "active",
  refreshKey = 0,
  onEndProject,
  onMembersLoaded,
  onProjectLoaded,
}) {
  const [timeline, setTimeline] = useState(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function loadTimeline() {
    setError("");

    startTransition(async () => {
      try {
        const data = await getTimeline(projectId);
        setTimeline(data);
        onMembersLoaded?.(data.members || []);
        onProjectLoaded?.(data.project);
      } catch (requestError) {
        setError(requestError.message);
      }
    });
  }

  useEffect(() => {
    loadTimeline();
  }, [projectId, refreshKey]);

  const members = timeline?.members || [];
  const logs = timeline?.logs || [];

  return (
    <div className="mx-auto mt-6 grid w-full max-w-5xl gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm uppercase text-slate-500">Silent accountability</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-50">Timeline pulse</h2>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={loadTimeline} disabled={isPending} aria-label="Refresh timeline">
              <RefreshCcw className="h-4 w-4" />
            </Button>
            {projectStatus === "active" ? (
              <Button type="button" variant="secondary" onClick={onEndProject}>
                End Project
              </Button>
            ) : null}
          </div>
        </div>

        <div className="mt-6 h-64 rounded-lg border border-white/8 bg-slate-950/55 p-3">
          {members.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={members} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="rgba(148,163,184,0.16)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#cbd5e1", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(16,185,129,0.08)" }}
                  contentStyle={{
                    background: "#020617",
                    border: "1px solid rgba(255,255,255,0.14)",
                    borderRadius: 8,
                    color: "#f8fafc",
                  }}
                />
                <Bar dataKey="updateCount" name="Updates" fill="#6ee7b7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid h-full place-items-center text-center text-sm text-slate-500">
              {isPending ? "Loading timeline" : "No updates yet"}
            </div>
          )}
        </div>

        {error ? (
          <p className="mt-4 rounded-lg border border-red-300/20 bg-red-400/10 px-3 py-2 text-sm text-red-100" role="alert">
            {error}
          </p>
        ) : null}
      </Card>

      <Card className="p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg border border-emerald-300/20 bg-emerald-300/10 text-emerald-100">
            <Activity className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm uppercase text-slate-500">Team feed</p>
            <h2 className="text-2xl font-semibold text-slate-50">Recent updates</h2>
          </div>
        </div>

        <div className="mt-6 max-h-[27rem] space-y-3 overflow-y-auto pr-1">
          {logs.length ? (
            logs.map((log) => (
              <article key={log.id} className="rounded-lg border border-white/8 bg-white/[0.04] p-4">
                <div className="flex items-start gap-3">
                  {log.user ? <Avatar profile={log.user} size="md" /> : null}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="font-semibold text-slate-100">{log.user?.name || "Teammate"}</h3>
                      <span className="rounded-md border border-emerald-300/20 bg-emerald-300/10 px-2 py-0.5 text-xs font-semibold text-emerald-100">
                        {log.category}
                      </span>
                      <time className="text-xs text-slate-500">{formatDate(log.timestamp)}</time>
                    </div>
                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-300">{log.text}</p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-white/12 p-6 text-center text-sm text-slate-500">
              Updates will appear here after teammates post their daily notes.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
