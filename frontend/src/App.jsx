import { lazy, Suspense, useState } from "react";
import { AIInsightsCard } from "./components/AIInsightsCard.jsx";
import { LogEntryForm } from "./components/LogEntryForm.jsx";
import { PINModal } from "./components/PINModal.jsx";
import { ProfileGrid } from "./components/ProfileGrid.jsx";
import { demoProfiles } from "./lib/team.js";

const PeerReviewModal = lazy(() =>
  import("./components/PeerReviewModal.jsx").then((module) => ({
    default: module.PeerReviewModal,
  })),
);
const TimelineDashboard = lazy(() =>
  import("./components/TimelineDashboard.jsx").then((module) => ({
    default: module.TimelineDashboard,
  })),
);

export default function App() {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [timelineRefreshKey, setTimelineRefreshKey] = useState(0);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  function handleVerified(user) {
    setActiveUser(user);
    setSelectedProfile(null);
  }

  return (
    <main className="min-h-dvh overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(16,185,129,0.18),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(125,211,252,0.13),transparent_30%),linear-gradient(135deg,#020617_0%,#0f172a_46%,#071014_100%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-200/80">The Group Project Ghost</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black text-slate-50 sm:text-5xl">
              A quiet daily check-in for teams that want fewer mystery gaps.
            </h1>
          </div>
          <p className="max-w-sm text-sm leading-6 text-slate-400">
            Opt in, unlock your profile, and leave a short contribution note. No class dashboard, no
            public ranking, no weird surveillance energy.
          </p>
        </header>

        <div className="flex flex-1 items-center">
          {activeUser ? (
            <div className="w-full">
              <LogEntryForm
                user={activeUser}
                onSignOut={() => setActiveUser(null)}
                onLogCreated={() => setTimelineRefreshKey((key) => key + 1)}
              />
              <Suspense
                fallback={
                  <div className="mx-auto mt-6 w-full max-w-5xl rounded-lg border border-white/10 bg-slate-950/60 p-5 text-sm text-slate-400">
                    Loading team timeline
                  </div>
                }
              >
                <TimelineDashboard
                  refreshKey={timelineRefreshKey}
                  onEndProject={() => setIsReviewOpen(true)}
                />
              </Suspense>
              <AIInsightsCard />
            </div>
          ) : (
            <ProfileGrid profiles={demoProfiles} onSelect={setSelectedProfile} />
          )}
        </div>
      </div>

      <PINModal
        profile={selectedProfile}
        onClose={() => setSelectedProfile(null)}
        onVerified={handleVerified}
      />
      {activeUser && isReviewOpen ? (
        <Suspense fallback={null}>
          <PeerReviewModal activeUser={activeUser} onClose={() => setIsReviewOpen(false)} />
        </Suspense>
      ) : null}
    </main>
  );
}
