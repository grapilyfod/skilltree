import type { TimeBlock, DailyKPISummary } from "@/types";
import { calculateKPISummary } from "@/lib/kpi";

interface KPISummaryBarProps {
  blocks?: TimeBlock[];
  summary?: DailyKPISummary;
}

interface Metric {
  label: string;
  value: string;
  accent: string;
}

export function KPISummaryBar({ blocks, summary: propSummary }: KPISummaryBarProps) {
  const summary = propSummary ?? (blocks ? calculateKPISummary(blocks) : undefined);

  if (!summary) {
    return null;
  }

  const metrics: Metric[] = [
    { label: "Tasks hôm nay", value: `${summary.totalTasks}`, accent: "text-zinc-200" },
    { label: "Đạt", value: `${summary.doneCount}`, accent: "text-emerald-300" },
    { label: "Một phần", value: `${summary.partialCount}`, accent: "text-sky-300" },
    { label: "Không đạt", value: `${summary.missedCount}`, accent: "text-red-300" },
    { label: "Streak", value: `${summary.streakDays} ngày`, accent: "text-violet-300" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="rounded-lg border border-white/[0.06] bg-[#101216] px-4 py-3"
        >
          <p className="text-[11px] uppercase tracking-wide text-zinc-500">{metric.label}</p>
          <p className={`mt-1 font-mono text-xl font-medium ${metric.accent}`}>{metric.value}</p>
        </div>
      ))}
    </div>
  );
}
