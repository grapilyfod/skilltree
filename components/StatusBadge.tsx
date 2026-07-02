import type { TaskStatus } from "@/types";
import { STATUS_STYLES } from "@/lib/style-maps";

interface StatusBadgeProps {
  status: TaskStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = STATUS_STYLES[status];
  const isActive = status === "active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-mono uppercase tracking-wide ring-1 ${style.text} ${style.bg} ${style.ring}`}
    >
      {isActive && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-400" />
        </span>
      )}
      {style.label}
    </span>
  );
}
