import { LogIn, UserPlus } from "lucide-react";
import { useState, useTransition } from "react";
import { login, register } from "../lib/api.js";
import { Button } from "./ui/Button.jsx";
import { Card } from "./ui/Card.jsx";

export function AuthPanel({ mode, onModeChange, onAuthed }) {
  const isRegister = mode === "register";
  const [email, setEmail] = useState(isRegister ? "" : "maya@ghost.test");
  const [password, setPassword] = useState(isRegister ? "" : "password123");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        const data = isRegister
          ? await register({ email, password, displayName })
          : await login({ email, password });
        onAuthed(data.user, mode);
      } catch (requestError) {
        setError(requestError.message);
      }
    });
  }

  return (
    <Card className="mx-auto w-full max-w-md p-5 sm:p-6">
      <div className="mb-6">
        <p className="text-sm uppercase text-emerald-200/80">
          {isRegister ? "Create account" : "Welcome back"}
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-50">
          {isRegister ? "Start a calmer group project." : "Open the project hub."}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Email sessions replace PIN profiles so one account can manage multiple project teams.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister ? (
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-300">Display name</span>
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="h-12 w-full rounded-lg border border-white/12 bg-slate-950/80 px-4 text-slate-100 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
              required
            />
          </label>
        ) : null}

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-300">Email</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 w-full rounded-lg border border-white/12 bg-slate-950/80 px-4 text-slate-100 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-300">Password</span>
          <input
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 w-full rounded-lg border border-white/12 bg-slate-950/80 px-4 text-slate-100 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
            required
            minLength={8}
          />
        </label>

        {error ? (
          <p className="rounded-lg border border-red-300/20 bg-red-400/10 px-3 py-2 text-sm text-red-100" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" disabled={isPending} className="w-full">
          {isRegister ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
          {isPending ? "Checking" : isRegister ? "Create Account" : "Log In"}
        </Button>
      </form>

      <button
        type="button"
        onClick={() => onModeChange(isRegister ? "login" : "register")}
        className="mt-5 min-h-11 w-full rounded-lg text-sm font-semibold text-slate-300 transition hover:bg-white/8 hover:text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
      >
        {isRegister ? "Already have an account? Log in" : "Need an account? Register"}
      </button>
    </Card>
  );
}
