import { Save } from "lucide-react";
import { useState, useTransition } from "react";
import { updateMe } from "../lib/api.js";
import { Avatar } from "./ui/Avatar.jsx";
import { Button } from "./ui/Button.jsx";
import { Card } from "./ui/Card.jsx";

export function ProfilePage({ user, onUpdated }) {
  const [displayName, setDisplayName] = useState(user.displayName || user.name || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || "");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event) {
    event.preventDefault();
    setNotice("");
    setError("");

    startTransition(async () => {
      try {
        const data = await updateMe({ displayName, avatarUrl });
        onUpdated(data.user);
        setNotice("Profile updated.");
      } catch (requestError) {
        setError(requestError.message);
      }
    });
  }

  return (
    <Card className="mx-auto w-full max-w-3xl p-5 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <Avatar profile={{ ...user, name: displayName, displayName }} />
        <div>
          <p className="text-sm uppercase text-emerald-200/80">Profile</p>
          <h2 className="mt-1 text-3xl font-semibold text-slate-50">{displayName}</h2>
          <p className="mt-1 text-sm text-slate-400">{user.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-300">Display name</span>
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className="h-12 w-full rounded-lg border border-white/12 bg-slate-950/80 px-4 text-slate-100 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-300">Avatar URL</span>
          <input
            type="url"
            value={avatarUrl}
            onChange={(event) => setAvatarUrl(event.target.value)}
            className="h-12 w-full rounded-lg border border-white/12 bg-slate-950/80 px-4 text-slate-100 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20"
            placeholder="https://example.com/avatar.png"
          />
        </label>

        {error ? (
          <p className="rounded-lg border border-red-300/20 bg-red-400/10 px-3 py-2 text-sm text-red-100" role="alert">
            {error}
          </p>
        ) : null}
        {notice ? (
          <p className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm text-emerald-50" role="status">
            {notice}
          </p>
        ) : null}

        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          <Save className="h-4 w-4" />
          {isPending ? "Saving" : "Save Profile"}
        </Button>
      </form>
    </Card>
  );
}
