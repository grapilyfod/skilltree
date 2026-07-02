import type { WeeklySummary } from "@/lib/weekly-summary";

interface WeeklySummaryCardProps {
  summary: WeeklySummary;
}

export function WeeklySummaryCard({ summary }: WeeklySummaryCardProps) {
  const completionPercent = Number(summary.completionRate.toFixed(0));

  return (
    <section className="rounded-xl border border-white/[0.06] bg-[#101216] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">7-Day Progress</p>
          <h3 className="mt-1 text-lg font-semibold text-white">
            {summary.startDate} → {summary.endDate}
          </h3>
        </div>
        <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
          {completionPercent}% completion
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-white/[0.06] bg-black/20 p-3">
        <div className="flex items-center justify-between text-sm text-zinc-400">
          <span>Tasks</span>
          <span className="font-mono text-zinc-300">{summary.totalTasks}</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-zinc-400">
          <div className="rounded border border-emerald-500/20 bg-emerald-500/10 p-2 text-center">
            <p className="text-emerald-300">Đạt</p>
            <p className="mt-1 font-mono text-sm text-white">{summary.doneTasks}</p>
          </div>
          <div className="rounded border border-sky-500/20 bg-sky-500/10 p-2 text-center">
            <p className="text-sky-300">Một phần</p>
            <p className="mt-1 font-mono text-sm text-white">{summary.partialTasks}</p>
          </div>
          <div className="rounded border border-red-500/20 bg-red-500/10 p-2 text-center">
            <p className="text-red-300">Không đạt</p>
            <p className="mt-1 font-mono text-sm text-white">{summary.failedTasks}</p>
          </div>
        </div>
        <div className="mt-3 space-y-2 border-t border-white/[0.06] pt-3 text-sm text-zinc-400">
          <div className="flex items-center justify-between">
            <span>Active days</span>
            <span className="font-mono text-zinc-300">
              {summary.activeDays}/7 ngày
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>Reviews</span>
            <span className="font-mono text-zinc-300">
              {summary.reviewDays}/7 ngày
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-white/[0.06] bg-black/20 p-3">
          <p className="text-[11px] uppercase tracking-wide text-zinc-500">Top skill</p>
          {summary.topSkill ? (
            <div className="mt-2">
              <p className="text-sm font-medium text-white">{summary.topSkill.name}</p>
              <p className="mt-1 font-mono text-xs text-emerald-300">+{summary.topSkill.points} pts</p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-zinc-400">Chưa có dữ liệu điểm mạnh</p>
          )}
        </div>

        <div className="rounded-lg border border-white/[0.06] bg-black/20 p-3">
          <p className="text-[11px] uppercase tracking-wide text-zinc-500">Focus next</p>
          {summary.focusSkill ? (
            <div className="mt-2">
              <p className="text-sm font-medium text-white">{summary.focusSkill.name}</p>
              <p className="mt-1 text-xs text-amber-300">{summary.focusSkill.reason}</p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-zinc-400">Không có skill cần cải thiện</p>
          )}
        </div>
      </div>
    </section>
  );
}
