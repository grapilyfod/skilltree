/**
 * Date utility functions for multi-day timetable management.
 */

/**
 * Format date as YYYY-MM-DD string.
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Parse YYYY-MM-DD string to Date (at midnight UTC).
 */
export function parseDate(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00Z");
}

/**
 * Get previous day.
 */
export function getPreviousDay(date: Date): Date {
  const prev = new Date(date);
  prev.setDate(prev.getDate() - 1);
  return prev;
}

/**
 * Get next day.
 */
export function getNextDay(date: Date): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  return next;
}

/**
 * Check if given date is today.
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return formatDate(date) === formatDate(today);
}

/**
 * Get today's date.
 */
export function getToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}
