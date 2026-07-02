import type { TimeBlock } from "@/types";

/** Converts "HH:mm" into minutes since midnight. */
export function toMinutes(hhmm: string): number {
  const [hours, minutes] = hhmm.split(":").map(Number);
  return hours * 60 + minutes;
}

/** Returns true if `now` falls within [block.startTime, block.endTime). */
export function isBlockActiveAt(block: TimeBlock, now: Date): boolean {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return nowMinutes >= toMinutes(block.startTime) && nowMinutes < toMinutes(block.endTime);
}

/** Formats a Date as "HH:mm:ss" for the live clock display. */
export function formatClock(now: Date): string {
  return now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

/** Formats a Date as a readable day label, e.g. "Thu, 2 Jul". */
export function formatDayLabel(now: Date): string {
  return now.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}
