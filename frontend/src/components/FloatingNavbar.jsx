import { Compass, LayoutDashboard, LogOut, UserRound } from "lucide-react";

export function FloatingNavbar({
  activeUser,
  route,
  activeProjectId,
  isPending,
  onNavigate,
  onLogout,
}) {
  return (
    <div className="pointer-events-none relative z-50 flex justify-center px-3 pt-4 sm:px-6 sm:pt-6">
      <header className="liquid-navbar pointer-events-auto w-full max-w-5xl rounded-[2rem] border border-white/18 bg-slate-950/[0.42] px-3 py-2 shadow-[0_24px_90px_rgba(2,6,23,0.46),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-24px_52px_rgba(14,165,233,0.08)] backdrop-blur-2xl supports-[backdrop-filter]:bg-slate-950/[0.34] sm:rounded-[2.25rem] sm:px-4">
        <div className="liquid-navbar__wash" aria-hidden="true" />
        <div className="relative flex items-center gap-2">
          <div className="group inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full px-3 text-left sm:px-4">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-cyan-200/25 bg-cyan-200/12 text-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_0_24px_rgba(34,211,238,0.18)] transition duration-300 group-hover:border-cyan-100/50 group-hover:bg-cyan-200/18">
              <Compass aria-hidden="true" className="h-4 w-4" />
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="block text-sm font-semibold leading-4 text-slate-50">
                Group Project Ghost
              </span>
              <span className="mt-0.5 block text-xs font-light leading-4 text-cyan-100/70">
                Calm collaboration intelligence
              </span>
            </span>
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            {activeUser ? (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate("/hub")}
                  className={`liquid-cta secondary hidden min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 sm:inline-flex ${
                    route === "/hub" ? "is-active" : ""
                  }`}
                >
                  <LayoutDashboard aria-hidden="true" className="h-4 w-4" />
                  Hub
                </button>
                {activeProjectId ? (
                  <button
                    type="button"
                    onClick={() => onNavigate(`/project/${activeProjectId}`)}
                    className="liquid-cta secondary hidden min-h-11 items-center rounded-full px-4 text-sm font-semibold transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 lg:inline-flex"
                  >
                    Project
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => onNavigate("/profile")}
                  className={`liquid-cta secondary min-h-11 rounded-full px-3 text-sm font-semibold transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 sm:px-4 ${
                    route === "/profile" ? "is-active" : ""
                  }`}
                  aria-label="Open profile"
                >
                  <UserRound aria-hidden="true" className="h-4 w-4 sm:hidden" />
                  <span className="hidden sm:inline">Profile</span>
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  disabled={isPending}
                  className="liquid-cta ghost min-h-11 rounded-full px-3 text-sm font-semibold transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
                  aria-label="Log out"
                >
                  <LogOut aria-hidden="true" className="h-4 w-4 sm:hidden" />
                  <span className="hidden sm:inline">Log Out</span>
                </button>
              </>
            ) : null}
          </div>
        </div>
      </header>
    </div>
  );
}
