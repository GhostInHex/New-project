export function Avatar({ profile, size = "lg" }) {
  const sizes = {
    md: "h-12 w-12 text-lg",
    lg: "h-18 w-18 text-2xl",
  };

  return (
    <div
      aria-hidden="true"
      className={`${sizes[size]} grid shrink-0 place-items-center rounded-full bg-gradient-to-br ${profile.avatarColor} font-black text-slate-950 shadow-lg shadow-black/30 ring-2 ring-white/20`}
    >
      {profile.name.slice(0, 1)}
    </div>
  );
}
