import { X } from "lucide-react";
import { useState, useTransition } from "react";
import { verifyPin } from "../lib/api.js";
import { Avatar } from "./ui/Avatar.jsx";
import { Button } from "./ui/Button.jsx";
import { PinInput } from "./ui/PinInput.jsx";

export function PINModal({ profile, onClose, onVerified }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!profile) {
    return null;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        const data = await verifyPin({ userId: profile.id, pin });
        onVerified(data.user);
      } catch (requestError) {
        setError(requestError.message);
      }
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/78 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pin-modal-title"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-white/12 bg-slate-950 p-5 shadow-2xl shadow-black/50"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar profile={profile} size="md" />
            <div>
              <h2 id="pin-modal-title" className="text-lg font-semibold text-slate-50">
                Unlock {profile.name}
              </h2>
              <p className="text-sm text-slate-400">Your update session stays on this device.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-lg text-slate-400 transition hover:bg-white/8 hover:text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
            aria-label="Close PIN dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <PinInput value={pin} onChange={setPin} disabled={isPending} />

        {error ? (
          <p className="mt-3 rounded-lg border border-red-300/20 bg-red-400/10 px-3 py-2 text-sm text-red-100" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex gap-3">
          <Button type="submit" disabled={pin.length !== 4 || isPending} className="flex-1">
            {isPending ? "Checking" : "Unlock"}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
