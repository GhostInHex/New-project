export function PinInput({ value, onChange, disabled }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">4-digit PIN</span>
      <input
        autoComplete="one-time-code"
        autoFocus
        disabled={disabled}
        inputMode="numeric"
        maxLength={4}
        pattern="[0-9]*"
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, 4))}
        className="h-13 w-full rounded-lg border border-white/12 bg-slate-950/80 px-4 text-center font-mono text-2xl text-slate-50 outline-none transition placeholder:text-slate-600 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20 disabled:opacity-50"
        placeholder="0000"
      />
    </label>
  );
}
