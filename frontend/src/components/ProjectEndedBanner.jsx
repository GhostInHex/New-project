import { RotateCcw } from "lucide-react";
import { Button } from "./ui/Button.jsx";
import { Card } from "./ui/Card.jsx";

export function ProjectEndedBanner({ project, onRestore, isRestoring }) {
  return (
    <Card className="mx-auto w-full max-w-5xl border-indigo-300/20 bg-indigo-300/8 p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase text-indigo-100/80">Project Ended</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-50">{project?.name}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-50/85">
            This workspace is archived. Logs and reviews are preserved exactly as they were, and
            teammates can still read the timeline, group reflection, and private coaching.
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={onRestore} disabled={isRestoring}>
          <RotateCcw className="h-4 w-4" />
          {isRestoring ? "Restoring" : "Restore Project"}
        </Button>
      </div>
    </Card>
  );
}
