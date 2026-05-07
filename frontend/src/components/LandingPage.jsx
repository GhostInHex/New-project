import { LogIn, ShieldCheck, UserPlus } from "lucide-react";
import { FeaturesGrid } from "./FeaturesGrid.jsx";

const previewUpdates = [
  ["Maya", "UI cards polished", "text-emerald-100"],
  ["Ravi", "Mongo query fixed", "text-cyan-100"],
  ["Nora", "Research notes posted", "text-lime-100"],
];

export function LandingPage({ onSignIn, onSignUp }) {
  return (
    <div className="relative min-h-dvh w-full overflow-x-hidden bg-[#0B0F19]">
      <div className="relative isolate min-h-dvh w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(112deg,#020617_0%,#0B0F19_44%,#111827_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_29%_38%,rgba(99,102,241,0.38),transparent_34%),radial-gradient(ellipse_at_72%_20%,rgba(34,211,238,0.24),transparent_27%),radial-gradient(ellipse_at_48%_88%,rgba(139,92,246,0.26),transparent_37%)]" />
          <div className="absolute left-[-14rem] top-[-7rem] h-[38rem] w-[38rem] rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute right-[-10rem] top-[-5rem] h-[44rem] w-[22rem] rotate-[8deg] bg-[linear-gradient(180deg,rgba(125,211,252,0.34),rgba(139,92,246,0.13),transparent)] blur-xl" />
          <div className="absolute bottom-[-16rem] left-[18%] h-[34rem] w-[46rem] rounded-full bg-violet-400/18 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.15] [background-image:radial-gradient(rgba(255,255,255,.72)_1px,transparent_1px)] [background-size:3px_3px]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.58),transparent_24%,transparent_70%,rgba(2,6,23,0.64))]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
          <header className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onSignIn}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.055] px-4 text-sm font-semibold text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
            >
              <LogIn aria-hidden="true" className="h-4 w-4" />
              Sign In
            </button>
            <button
              type="button"
              onClick={onSignUp}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-cyan-100 px-4 text-sm font-semibold text-slate-950 shadow-[0_0_34px_rgba(103,232,249,0.24),inset_0_1px_0_rgba(255,255,255,0.75)] transition duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
            >
              <UserPlus aria-hidden="true" className="h-4 w-4" />
              Sign Up
            </button>
          </header>

          <section className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
            <div className="landing-reveal">
              <p className="text-lg font-light tracking-wide text-cyan-100">
                AI accountability for college group projects
              </p>
              <h1 className="mt-6 max-w-4xl text-balance text-5xl font-thin leading-[0.95] tracking-[-0.07em] text-slate-50 sm:text-6xl lg:text-7xl">
                Group work finally has receipts without the surveillance.
              </h1>
              <p className="mt-7 max-w-2xl text-pretty text-lg font-light leading-8 text-slate-300">
                Create a workspace, invite teammates with a short code, log tiny daily updates, and
                end with private coaching plus a diplomatic group reflection.
              </p>
            </div>

            <div className="landing-reveal landing-reveal-delay relative min-h-[28rem]">
              <div className="absolute right-0 top-6 w-full max-w-md rounded-lg border border-white/12 bg-slate-950/74 p-5 shadow-2xl shadow-indigo-950/40 backdrop-blur">
                <p className="text-sm font-light uppercase tracking-[0.3em] text-slate-500">
                  Workspace
                </p>
                <h2 className="mt-2 text-2xl font-light text-slate-50">Amazon Clone MVP</h2>
                <div className="mt-5 grid gap-3">
                  {previewUpdates.map(([name, update, colorClass]) => (
                    <div
                      key={name}
                      className="rounded-lg border border-white/10 bg-white/[0.04] p-3"
                    >
                      <p className="text-sm font-light text-slate-100">{name}</p>
                      <p className={`mt-1 text-sm font-light ${colorClass}`}>{update}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-4 left-2 w-[19rem] rotate-[-4deg] rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-5 shadow-2xl shadow-indigo-950/40 backdrop-blur">
                <div className="flex items-center gap-2 text-cyan-50">
                  <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                  <p className="text-sm font-light">Private AI coaching</p>
                </div>
                <h3 className="mt-2 text-3xl font-thin leading-tight tracking-[-0.05em] text-slate-50">
                  Strictly private growth notes.
                </h3>
                <p className="mt-3 text-sm font-light leading-6 text-cyan-50/80">
                  Teammates see the group reflection. Each student sees only their own coaching.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#0B0F19]" />
      </div>

      <FeaturesGrid />
    </div>
  );
}
