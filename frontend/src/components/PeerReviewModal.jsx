import { ShieldCheck, X } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { submitRatings } from "../lib/api.js";
import { PROJECT_ID, demoProfiles } from "../lib/team.js";
import { Button } from "./ui/Button.jsx";

const criteria = [
  ["effortScore", "Effort"],
  ["qualityScore", "Quality"],
  ["collaborationScore", "Collaboration"],
];

function createInitialRatings(activeUserId) {
  return Object.fromEntries(
    demoProfiles
      .filter((profile) => profile.id !== activeUserId)
      .map((profile) => [
        profile.id,
        {
          targetUserId: profile.id,
          effortScore: 3,
          qualityScore: 3,
          collaborationScore: 3,
        },
      ]),
  );
}

export function PeerReviewModal({ activeUser, onClose }) {
  const [ratingsByUser, setRatingsByUser] = useState(() => createInitialRatings(activeUser.id));
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isPending, startTransition] = useTransition();

  const teammates = useMemo(
    () => demoProfiles.filter((profile) => profile.id !== activeUser.id),
    [activeUser.id],
  );

  function updateScore(targetUserId, key, value) {
    setRatingsByUser((current) => ({
      ...current,
      [targetUserId]: {
        ...current[targetUserId],
        [key]: Number(value),
      },
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    startTransition(async () => {
      try {
        await submitRatings({
          projectId: activeUser.projectId || PROJECT_ID,
          reviewerId: activeUser.id,
          ratings: Object.values(ratingsByUser),
        });
        setNotice("Peer review saved anonymously for the final aggregate.");
      } catch (requestError) {
        setError(requestError.message);
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/80 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="peer-review-title">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl rounded-lg border border-white/12 bg-slate-950 p-5 shadow-2xl shadow-black/50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase text-emerald-200/80">End project</p>
            <h2 id="peer-review-title" className="mt-1 text-2xl font-semibold text-slate-50">
              Private peer review
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-lg text-slate-400 transition hover:bg-white/8 hover:text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
            aria-label="Close peer review"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 flex gap-3 rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm leading-6 text-emerald-50">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
          <p>These ratings are completely anonymous and only used for the final AI aggregate.</p>
        </div>

        <div className="mt-6 space-y-4">
          {teammates.map((teammate) => (
            <section key={teammate.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold text-slate-100">{teammate.name}</h3>
                  <p className="text-sm text-slate-500">{teammate.role}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {criteria.map(([key, label]) => (
                    <label key={key} className="block min-w-32">
                      <span className="mb-2 block text-xs font-semibold uppercase text-slate-500">{label}</span>
                      <select
                        value={ratingsByUser[teammate.id][key]}
                        onChange={(event) => updateScore(teammate.id, key, event.target.value)}
                        className="h-11 w-full rounded-lg border border-white/12 bg-slate-950 px-3 text-sm text-slate-100 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
                      >
                        {[1, 2, 3, 4, 5].map((score) => (
                          <option key={score} value={score}>
                            {score}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

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

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving" : "Submit Reviews"}
          </Button>
        </div>
      </form>
    </div>
  );
}
