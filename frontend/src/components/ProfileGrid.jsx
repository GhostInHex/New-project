import { LockKeyhole } from "lucide-react";
import { Avatar } from "./ui/Avatar.jsx";
import { Card } from "./ui/Card.jsx";

export function ProfileGrid({ profiles, onSelect }) {
  return (
    <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {profiles.map((profile) => (
        <button
          key={profile.id}
          type="button"
          onClick={() => onSelect(profile)}
          className="group min-h-48 rounded-lg border border-white/10 bg-slate-950/52 p-4 text-left transition duration-200 hover:-translate-y-1 hover:border-emerald-300/45 hover:bg-white/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
          aria-label={`Unlock ${profile.name}'s profile`}
        >
          <Card className="flex h-full flex-col justify-between border-white/8 bg-slate-900/55 p-4 shadow-none">
            <div className="flex items-start justify-between gap-3">
              <Avatar profile={profile} />
              <LockKeyhole className="h-5 w-5 text-slate-500 transition group-hover:text-emerald-200" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-50">{profile.name}</h2>
              <p className="mt-1 text-sm text-slate-400">{profile.role}</p>
            </div>
          </Card>
        </button>
      ))}
    </div>
  );
}
