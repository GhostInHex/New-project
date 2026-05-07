export function Card({ children, className = "" }) {
  return (
    <section
      className={`rounded-lg border border-white/10 bg-slate-950/68 shadow-2xl shadow-black/30 backdrop-blur ${className}`}
    >
      {children}
    </section>
  );
}
