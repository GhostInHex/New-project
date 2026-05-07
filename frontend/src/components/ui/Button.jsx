export function Button({ children, className = "", variant = "primary", ...props }) {
  const variants = {
    primary:
      "bg-emerald-300 text-slate-950 hover:bg-emerald-200 focus-visible:outline-emerald-200",
    secondary:
      "border border-white/12 bg-white/7 text-slate-100 hover:bg-white/12 focus-visible:outline-white/50",
    ghost: "text-slate-300 hover:bg-white/8 focus-visible:outline-white/40",
  };

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
