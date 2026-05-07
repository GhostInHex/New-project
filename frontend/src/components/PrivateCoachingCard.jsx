import { Lock } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { getMyFeedback } from "../lib/api.js";
import { Card } from "./ui/Card.jsx";

export function PrivateCoachingCard({ projectId }) {
  const [coaching, setCoaching] = useState(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setError("");

    startTransition(async () => {
      try {
        const data = await getMyFeedback(projectId);
        setCoaching(data.private_coaching);
      } catch (requestError) {
        setError(requestError.message);
      }
    });
  }, [projectId]);

  return (
    <Card className="mx-auto mt-6 w-full max-w-5xl border-indigo-300/25 bg-indigo-950/45 p-5 shadow-indigo-950/30 sm:p-6">
      <div className="flex gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-indigo-200/25 bg-indigo-200/10 text-indigo-100">
          <Lock className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm uppercase text-indigo-100/80">Private coaching</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-50">Personal growth note</h2>
          <p className="mt-2 text-sm font-semibold text-indigo-50">
            Strictly Private: Only you can see your personalized coaching feedback.
          </p>
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-lg border border-red-300/20 bg-red-400/10 px-3 py-2 text-sm text-red-100" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-5 rounded-lg border border-white/10 bg-slate-950/45 p-4 text-sm leading-6 text-indigo-50/90">
        {isPending && !coaching ? "Preparing private coaching" : coaching}
      </div>
    </Card>
  );
}
