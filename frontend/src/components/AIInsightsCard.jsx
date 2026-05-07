import { Sparkles } from "lucide-react";
import { useState, useTransition } from "react";
import { generateSummary } from "../lib/api.js";
import { Button } from "./ui/Button.jsx";
import { Card } from "./ui/Card.jsx";

export function AIInsightsCard({ projectId }) {
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    setError("");

    startTransition(async () => {
      try {
        const data = await generateSummary(projectId);
        setInsights(data);
      } catch (requestError) {
        setError(requestError.message);
      }
    });
  }

  return (
    <Card className="mx-auto mt-6 w-full max-w-5xl p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-cyan-200/20 bg-cyan-200/10 text-cyan-100">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm uppercase text-slate-500">AI diplomat</p>
            <h2 className="text-2xl font-semibold text-slate-50">Constructive group reflection</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Generates a neutral aggregate from logs and anonymous ratings. Negative patterns stay
              de-identified by design.
            </p>
          </div>
        </div>
        <Button type="button" onClick={handleGenerate} disabled={isPending}>
          {isPending ? "Generating" : "Generate Summary"}
        </Button>
      </div>

      {error ? (
        <p className="mt-4 rounded-lg border border-red-300/20 bg-red-400/10 px-3 py-2 text-sm text-red-100" role="alert">
          {error}
        </p>
      ) : null}

      {insights ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-lg border border-white/8 bg-white/[0.04] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold uppercase text-slate-500">Reflection</h3>
              <span className="rounded-full border border-cyan-200/15 bg-cyan-200/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                {insights.provider === "gemini" ? "Gemini live" : "Ghost cache"}
              </span>
            </div>
            <div className="mt-3 space-y-4 whitespace-pre-line text-sm leading-6 text-slate-300">
              {insights.summary}
            </div>
          </section>

          <div className="grid gap-4">
            <section className="rounded-lg border border-emerald-300/15 bg-emerald-300/8 p-4">
              <h3 className="text-sm font-semibold uppercase text-emerald-100">Key strengths</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-emerald-50">
                {(insights.key_strengths || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-lg border border-cyan-200/15 bg-cyan-200/8 p-4">
              <h3 className="text-sm font-semibold uppercase text-cyan-100">Areas for alignment</h3>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-cyan-50">
                {(insights.areas_for_alignment || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
