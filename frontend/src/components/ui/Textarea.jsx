export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`min-h-32 w-full resize-none rounded-lg border border-white/12 bg-slate-950/70 px-4 py-3 text-base leading-6 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20 ${className}`}
      {...props}
    />
  );
}
