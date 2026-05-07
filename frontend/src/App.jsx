import { lazy, Suspense, useEffect, useState, useTransition } from "react";
import { AIInsightsCard } from "./components/AIInsightsCard.jsx";
import { AuthPanel } from "./components/AuthPanel.jsx";
import { FloatingNavbar } from "./components/FloatingNavbar.jsx";
import { HubView } from "./components/HubView.jsx";
import { LandingPage } from "./components/LandingPage.jsx";
import { LogEntryForm } from "./components/LogEntryForm.jsx";
import { PrivateCoachingCard } from "./components/PrivateCoachingCard.jsx";
import { ProjectEndedBanner } from "./components/ProjectEndedBanner.jsx";
import { ProfilePage } from "./components/ProfilePage.jsx";
import { getMe, logout, toggleProjectStatus } from "./lib/api.js";

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

function currentPath() {
  return window.location.pathname;
}

export default function App() {
  const [activeUser, setActiveUser] = useState(null);
  const [route, setRoute] = useState(currentPath);
  const [timelineRefreshKey, setTimelineRefreshKey] = useState(0);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [projectMembers, setProjectMembers] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [isBooting, setIsBooting] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    function syncRoute() {
      setRoute(currentPath());
    }

    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getMe();
        setActiveUser(data.user);
        if (route === "/login" || route === "/register") {
          navigate("/hub");
        }
      } catch (_error) {
        setActiveUser(null);
      } finally {
        setIsBooting(false);
      }
    });
  }, []);

  function navigate(path) {
    window.history.pushState({}, "", path);
    setRoute(currentPath());
  }

  function handleAuthed(user, mode) {
    setActiveUser(user);
    navigate(mode === "register" ? "/profile" : "/hub");
  }

  function handleLogout() {
    startTransition(async () => {
      await logout();
      setActiveUser(null);
      setProjectMembers([]);
      setActiveProject(null);
      navigate("/login");
    });
  }

  const isLandingRoute = route === "/" || route === "/landing";
  const isAuthRoute = route === "/login" || route === "/register";
  const activeProjectId = route.startsWith("/project/") ? route.split("/")[2] : null;
  const isProjectStateReady = activeProjectId && String(activeProject?.id) === activeProjectId;
  const isArchived = isProjectStateReady && activeProject?.status === "archived";

  async function handleToggleProjectStatus() {
    if (!activeProjectId) {
      return;
    }

    const data = await toggleProjectStatus(activeProjectId);
    setActiveProject(data.project);
    setTimelineRefreshKey((key) => key + 1);
    setIsReviewOpen(false);
  }

  return (
    <main className="min-h-dvh overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(16,185,129,0.18),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(125,211,252,0.13),transparent_30%),linear-gradient(135deg,#020617_0%,#0f172a_46%,#071014_100%)]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:42px_42px]" />
      {activeUser && !isLandingRoute && !isAuthRoute ? (
        <FloatingNavbar
          activeUser={activeUser}
          route={route}
          activeProjectId={activeProjectId}
          isPending={isPending}
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      ) : null}

      {isLandingRoute ? (
        <LandingPage onSignIn={() => navigate("/login")} onSignUp={() => navigate("/register")} />
      ) : (
      <div className="relative mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-10 max-w-4xl">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-200/80">
              The Group Project Ghost
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black text-slate-50 sm:text-5xl">
              A quieter operating room for messy group projects.
            </h1>
          </div>
          {!activeUser ? (
            <p className="max-w-sm text-sm leading-6 text-slate-400">
              Email sessions now unlock the same supportive timeline, peer review, and AI reflection
              flow for real student accounts.
            </p>
          ) : null}
        </section>

        <div className="flex flex-1 items-center">
          {isBooting ? (
            <div className="mx-auto rounded-lg border border-white/10 bg-slate-950/60 p-5 text-sm text-slate-400">
              Checking session
            </div>
          ) : !activeUser || isAuthRoute ? (
            <AuthPanel
              mode={route === "/register" ? "register" : "login"}
              onModeChange={(mode) => navigate(`/${mode}`)}
              onAuthed={handleAuthed}
            />
          ) : route === "/profile" ? (
            <ProfilePage user={activeUser} onUpdated={setActiveUser} />
          ) : route === "/hub" ? (
            <HubView onOpenProject={(projectId) => navigate(`/project/${projectId}`)} />
          ) : activeProjectId ? (
            <div className="w-full">
              {!isProjectStateReady ? (
                <div className="mx-auto w-full max-w-5xl rounded-lg border border-white/10 bg-slate-950/60 p-5 text-sm text-slate-400">
                  Loading project state
                </div>
              ) : isArchived ? (
                <ProjectEndedBanner
                  project={activeProject}
                  onRestore={handleToggleProjectStatus}
                  isRestoring={isPending}
                />
              ) : (
                <LogEntryForm
                  user={activeUser}
                  projectId={activeProjectId}
                  onSignOut={handleLogout}
                  onLogCreated={() => setTimelineRefreshKey((key) => key + 1)}
                />
              )}
              <Suspense
                fallback={
                  <div className="mx-auto mt-6 w-full max-w-5xl rounded-lg border border-white/10 bg-slate-950/60 p-5 text-sm text-slate-400">
                    Loading team timeline
                  </div>
                }
              >
                <TimelineDashboard
                  projectId={activeProjectId}
                  projectStatus={isProjectStateReady ? activeProject.status : "loading"}
                  refreshKey={timelineRefreshKey}
                  onMembersLoaded={setProjectMembers}
                  onProjectLoaded={setActiveProject}
                  onEndProject={() => setIsReviewOpen(true)}
                />
              </Suspense>
              <AIInsightsCard projectId={activeProjectId} />
              {isArchived ? <PrivateCoachingCard projectId={activeProjectId} /> : null}
            </div>
          ) : (
            <HubView onOpenProject={(projectId) => navigate(`/project/${projectId}`)} />
          )}
        </div>
      </div>
      )}

      {activeUser && isReviewOpen ? (
        <Suspense fallback={null}>
          <PeerReviewModal
            activeUser={activeUser}
            members={projectMembers}
            projectId={activeProjectId}
            onClose={() => setIsReviewOpen(false)}
            onSubmitted={handleToggleProjectStatus}
          />
        </Suspense>
      ) : null}
    </main>
  );
}
