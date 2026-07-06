import { cn } from "@/lib/utils";
import type { JobStatus } from "@/lib/mock-data";
import { statusLabels } from "@/lib/mock-data";

const styles: Record<JobStatus, string> = {
  requested: "bg-primary/15 text-primary",
  accepted: "bg-primary/15 text-primary",
  "en-route": "bg-warning/15 text-warning",
  arrived: "bg-warning/15 text-warning",
  "in-progress": "bg-warning/15 text-warning",
  completed: "bg-success/15 text-success",
  cancelled: "bg-destructive/15 text-destructive",
};

export function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        styles[status],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {statusLabels[status]}
    </span>
  );
}
