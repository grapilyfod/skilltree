"use client";

import { useEffect, useState } from "react";
import type { SkillCategory, SkillNode, TimeBlock, TaskStatus } from "@/types";
import { isBlockActiveAt } from "@/lib/time";
import { TimeBlockCard } from "@/components/TimeBlockCard";

interface TimetableListProps {
  blocks: TimeBlock[];
  /** Current skill categories (built-in + custom). */
  categories: SkillCategory[];
  /** Current skill node definitions (built-in + custom). */
  skillNodes: SkillNode[];
  /** Callback fired when user changes a block's status. */
  onStatusChange?: (blockId: string, newStatus: TaskStatus) => void;
  /** Callback fired when user clicks Add Task button. */
  onAddTask?: () => void;
  /** Callback fired when user clicks Edit button on a card. */
  onEdit?: (block: TimeBlock) => void;
  /** Callback fired when user clicks Delete button on a card. */
  onDelete?: (blockId: string) => void;
}

export function TimetableList({
  blocks,
  categories,
  skillNodes,
  onStatusChange,
  onAddTask,
  onEdit,
  onDelete,
}: TimetableListProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Set the initial time only after mount so server and client markup match;
    // "now" is inherently client-only state used purely for active-block detection.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const intervalId = setInterval(() => setNow(new Date()), 1000 * 15);
    return () => clearInterval(intervalId);
  }, []);

  const sorted = [...blocks].sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="flex flex-col gap-3">
      {onAddTask && (
        <button
          onClick={onAddTask}
          className="rounded border border-white/[0.06] bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-400 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-300"
        >
          + Thêm Task
        </button>
      )}
      <ul className="flex flex-col gap-3">
        {sorted.map((block) => (
          <TimeBlockCard
            key={block.id}
            block={block}
            isNow={now !== null && isBlockActiveAt(block, now)}
            categories={categories}
            skillNodes={skillNodes}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  );
}
