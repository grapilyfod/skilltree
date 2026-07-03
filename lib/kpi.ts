import type { TimeBlock, DailyKPISummary } from "@/types";

/**
 * Calculate KPI summary dynamically from current timeblocks state.
 * - Must-KPI: count tasks with priority === "must" AND status === "done"
 * - Done count: count tasks with status === "done"
 * - Partial count: count tasks with status === "partial"
 * - Missed count: count tasks with status === "missed"
 */
export function calculateKPISummary(blocks: TimeBlock[]): DailyKPISummary {
  const mustBlocks = blocks.filter((b) => b.priority === "must");
  const mustDoneBlocks = mustBlocks.filter((b) => b.status === "done");
  const doneBlocks = blocks.filter((b) => b.status === "done");
  const partialBlocks = blocks.filter((b) => b.status === "partial");
  const missedBlocks = blocks.filter((b) => b.status === "missed");

  return {
    date: new Date().toISOString().slice(0, 10),
    totalTasks: blocks.length,
    mustTasksTotal: mustBlocks.length,
    mustTasksDone: mustDoneBlocks.length,
    doneCount: doneBlocks.length,
    partialCount: partialBlocks.length,
    missedCount: missedBlocks.length,
    streakDays: 0,
  };
}
