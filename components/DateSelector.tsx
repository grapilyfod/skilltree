"use client";

import {
  formatDate,
  getPreviousDay,
  getNextDay,
  isToday,
} from "@/lib/date-utils";

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const dateStr = formatDate(selectedDate);
  const displayDate = selectedDate.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePreviousDay = () => {
    onDateChange(getPreviousDay(selectedDate));
  };

  const handleNextDay = () => {
    onDateChange(getNextDay(selectedDate));
  };

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const newDate = new Date(e.target.value + "T00:00:00");
      onDateChange(newDate);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-between">
      <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row sm:gap-3">
        <div className="flex w-full items-center justify-center gap-2 sm:w-auto sm:gap-3">
          <button
            type="button"
            onClick={handlePreviousDay}
            className="min-h-9 flex-1 rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-violet-200 transition hover:border-violet-400/40 hover:bg-violet-500/20 sm:flex-none"
          >
            ← Hôm qua
          </button>

          <button
            type="button"
            onClick={handleNextDay}
            className="min-h-9 flex-1 rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-violet-200 transition hover:border-violet-400/40 hover:bg-violet-500/20 sm:flex-none"
          >
            Ngày mai →
          </button>
        </div>

        <div className="flex flex-col items-center gap-1 text-center sm:order-none">
          <p className="font-mono text-xs text-zinc-500">{dateStr}</p>
          <p className="text-sm font-bold text-white sm:text-base">
            {displayDate}
          </p>

          {isToday(selectedDate) && (
            <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-300">
              HÔM NAY
            </span>
          )}
        </div>
      </div>

      <input
        type="date"
        value={dateStr}
        onChange={handleDateInput}
        style={{
          backgroundColor: "#1a1d2e",
          color: "#f1f5f9",
        }}
        className="min-h-9 w-full rounded border border-white/[0.06] px-3 py-1.5 text-xs transition-colors hover:border-white/[0.12] focus:border-white/[0.2] focus:outline-none sm:w-auto"
      />
    </div>
  );
}
