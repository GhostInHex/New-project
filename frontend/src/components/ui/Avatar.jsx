export function Avatar({ profile, size = "lg" }) {
  const name = profile.displayName || profile.name || profile.email || "?";
  const sizes = {
    md: "h-12 w-12 text-lg",
    lg: "h-18 w-18 text-2xl",
  };

  return (
    <div
      aria-hidden="true"
      className={`${sizes[size]} grid shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br ${profile.avatarColor || "from-emerald-300 to-cyan-200"} font-black text-slate-950 shadow-lg shadow-black/30 ring-2 ring-white/20`}
    >
      {profile.avatarUrl ? (
        <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        name.slice(0, 1).toUpperCase()
      )}
    </div>
  );
}
