import type { TimeBlock } from "@/types";
const TIMETABLES_STORAGE_KEY = "skillforge_timetables";

/**
 * Get entire timetables map from localStorage.
 * Returns { [dateStr: YYYY-MM-DD]: TimeBlock[] }
 * Safe to call on server (returns {}).
 */
export function getTimetablesMap(): Record<string, TimeBlock[]> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = window.localStorage.getItem(TIMETABLES_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Record<string, TimeBlock[]>) : {};
  } catch (error) {
    console.error("Failed to read timetables from localStorage:", error);
    return {};
  }
}

/**
 * Save entire timetables map to localStorage.
 */
export function setTimetablesMap(timetables: Record<string, TimeBlock[]>): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(TIMETABLES_STORAGE_KEY, JSON.stringify(timetables));
  } catch (error) {
    console.error("Failed to save timetables to localStorage:", error);
  }
}

/**
 * Get timetable for a specific date (YYYY-MM-DD).
 * Returns empty array if not found.
 */
export function getTimetable(dateStr: string): TimeBlock[] {
  const map = getTimetablesMap();
  return map[dateStr] ?? [];
}

/**
 * Save timetable for a specific date (YYYY-MM-DD).
 */
export function setTimetable(dateStr: string, blocks: TimeBlock[]): void {
  const map = getTimetablesMap();
  map[dateStr] = blocks;
  setTimetablesMap(map);
}

/**
 * Delete timetable for a specific date (YYYY-MM-DD).
 */
export function deleteTimetable(dateStr: string): void {
  const map = getTimetablesMap();
  delete map[dateStr];
  setTimetablesMap(map);
}

/**
 * Clear all timetables from localStorage.
 */
export function clearAllTimetables(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(TIMETABLES_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear timetables:", error);
  }
}
