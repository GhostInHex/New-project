import { LockKeyhole, Sparkles } from "lucide-react";

export function LandingHub({ onSignIn, onSignUp }) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#020711] text-slate-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(110deg,#020711_0%,#07151b_42%,#031013_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_34%_48%,rgba(16,185,129,0.34),transparent_36%),radial-gradient(ellipse_at_84%_10%,rgba(34,211,238,0.23),transparent_24%),radial-gradient(ellipse_at_48%_94%,rgba(5,150,105,0.23),transparent_34%)]" />
        <div className="absolute inset-y-0 left-[17%] w-[38rem] -skew-x-12 bg-[linear-gradient(180deg,transparent,rgba(45,212,191,0.16),rgba(16,185,129,0.22),transparent)] blur-2xl" />
        <div className="absolute inset-y-0 right-[-2rem] w-[19rem] bg-[linear-gradient(180deg,rgba(34,211,238,0.18),rgba(16,185,129,0.12),transparent)] blur-xl" />
        <div className="absolute inset-0 opacity-[0.2] [background-image:radial-gradient(rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:3px_3px]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,7,17,0.24),transparent_22%,transparent_72%,rgba(2,7,17,0.48))]" />
      </div>

      <div className="relative mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-5 sm:px-8">
        <header className="flex min-h-24 items-center justify-between border-b border-white/10">
          <button
            type="button"
            onClick={onSignUp}
            className="inline-flex min-h-11 items-center gap-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300"
          >
            <span className="grid h-11 w-11 place-items-center rounded-lg border border-emerald-200/25 bg-emerald-300 text-slate-950 shadow-[0_0_46px_rgba(110,231,183,0.28)]">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="font-display text-2xl font-black text-emerald-100">
              GroupProjectGhost
            </span>
          </button>

          <nav className="flex items-center gap-3" aria-label="Authentication">
            <button
              type="button"
              onClick={onSignIn}
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/12 bg-white/[0.04] px-5 text-sm font-bold text-slate-100 transition hover:border-cyan-200/40 hover:bg-cyan-200/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={onSignUp}
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-emerald-300 px-5 text-sm font-black text-slate-950 shadow-[0_18px_70px_rgba(16,185,129,0.28)] transition hover:-translate-y-0.5 hover:bg-emerald-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
            >
              Sign Up
            </button>
          </nav>
        </header>

        <section className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="landing-reveal">
            <p className="text-lg font-semibold text-emerald-100">
              Collaboration intelligence for college teams
            </p>
            <h1 className="font-display mt-8 max-w-5xl text-5xl font-black leading-[0.92] text-slate-50 sm:text-7xl lg:text-8xl">
              Group projects stop feeling invisible.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-slate-300">
              Not because of surveillance. Not because of professor dashboards. Because every teammate
              can log work, review privately, and close with AI feedback that stays constructive.
            </p>
          </div>

          <aside className="landing-reveal landing-reveal-delay relative min-h-[28rem]">
            <div className="absolute right-3 top-12 w-full max-w-md rotate-1 rounded-lg border border-white/12 bg-black/45 p-6 shadow-[0_32px_110px_rgba(0,0,0,0.52)] backdrop-blur-xl">
              <div className="absolute inset-x-8 -top-5 h-8 rounded-t-lg bg-white/14 blur-[1px]" />
              <p className="text-2xl font-black text-slate-100">Project Ended</p>
              <p className="mt-1 text-sm font-semibold text-cyan-100">Amazon Clone MVP</p>
              <div className="mt-6 space-y-4 text-sm leading-6 text-slate-300">
                <p>
                  AI summary ready: backend tasks were concentrated, but the reflection stays
                  aggregate-only.
                </p>
                <div className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-4">
                  <div className="flex items-center gap-2 text-emerald-100">
                    <LockKeyhole className="h-4 w-4" />
                    <span className="font-bold">Private coaching unlocked</span>
                  </div>
                  <p className="mt-2 text-slate-300">
                    Each student sees only their own growth note.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
