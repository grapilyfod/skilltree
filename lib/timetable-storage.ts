import type { TimeBlock } from "@/types";

const BLOCKS_STORAGE_KEY = "skillforge_timeblocks";

/**
 * Get all saved timeblocks from localStorage.
 * Returns array of TimeBlocks or empty array if not found.
 * Safe to call on server (returns []).
 */
export function getBlocks(): TimeBlock[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(BLOCKS_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as TimeBlock[]) : [];
  } catch (error) {
    console.error("Failed to read timeblocks from localStorage:", error);
    return [];
  }
}

/**
 * Save all timeblocks to localStorage.
 */
export function setBlocks(blocks: TimeBlock[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(BLOCKS_STORAGE_KEY, JSON.stringify(blocks));
  } catch (error) {
    console.error("Failed to save timeblocks to localStorage:", error);
  }
}

/**
 * Clear all saved timeblocks from localStorage.
 */
export function resetBlocks(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(BLOCKS_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to reset timeblocks:", error);
  }
}
