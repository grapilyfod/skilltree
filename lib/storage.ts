import type { TaskStatus } from "@/types";

const STORAGE_KEY = "skillforge_task_statuses";

/**
 * Get all saved task statuses from localStorage.
 * Returns a Map of blockId -> TaskStatus.
 * Safe to call on server (returns empty Map) and client.
 */
export function getTaskStatuses(): Record<string, TaskStatus> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Record<string, TaskStatus>) : {};
  } catch (error) {
    console.error("Failed to read task statuses from localStorage:", error);
    return {};
  }
}

/**
 * Save a single task status to localStorage.
 * Merges with existing statuses.
 */
export function setTaskStatus(blockId: string, status: TaskStatus): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const current = getTaskStatuses();
    current[blockId] = status;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (error) {
    console.error("Failed to save task status to localStorage:", error);
  }
}

/**
 * Clear all saved task statuses from localStorage.
 */
export function resetTaskStatuses(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to reset task statuses:", error);
  }
}
