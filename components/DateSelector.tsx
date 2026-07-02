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
      <div className="flex items-center gap-3">
        <button
          onClick={handlePreviousDay}
          className="rounded border border-white/[0.06] bg-white/5 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-zinc-400 transition-all hover:bg-white/10 hover:text-zinc-300"
        >
          ← Hôm qua
        </button>

        <div className="flex flex-col items-center gap-1">
          <p className="text-xs font-mono text-zinc-500">{dateStr}</p>
          <p className="text-sm font-medium text-white">{displayDate}</p>
          {isToday(selectedDate) && (
            <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-300">
              HÔM NAY
            </span>
          )}
        </div>

        <button
          onClick={handleNextDay}
          className="rounded border border-white/[0.06] bg-white/5 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-zinc-400 transition-all hover:bg-white/10 hover:text-zinc-300"
        >
          Ngày mai →
        </button>
      </div>

      <input
        type="date"
        value={dateStr}
        onChange={handleDateInput}
        style={{
          backgroundColor: "#1a1d2e",
          color: "#f1f5f9",
        }}
        className="rounded border border-white/[0.06] px-3 py-1.5 text-xs transition-colors hover:border-white/[0.12] focus:border-white/[0.2] focus:outline-none"
      />
    </div>
  );
}
