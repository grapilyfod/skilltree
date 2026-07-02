import type { SkillNode, SkillProgressDelta } from "@/types";
import { SKILL_NODES } from "./mock-data";

const SKILL_MASTERY_KEY = "skillforge_skill_mastery";
const SKILL_DELTAS_BY_DATE_KEY = "skillforge_skill_deltas_by_date";

/**
 * Get stored skill nodes from localStorage, or return initial SKILL_NODES if not found.
 * SSR-safe: returns empty array on server.
 */
export function getStoredSkillNodes(): SkillNode[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(SKILL_MASTERY_KEY);
    if (!stored) {
      return structuredClone(SKILL_NODES);
    }
    return JSON.parse(stored);
  } catch (err) {
    console.error("Failed to load skill nodes from localStorage:", err);
    return structuredClone(SKILL_NODES);
  }
}

/**
 * Save skill nodes to localStorage.
 */
export function saveSkillNodes(skills: SkillNode[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(SKILL_MASTERY_KEY, JSON.stringify(skills));
  } catch (err) {
    console.error("Failed to save skill nodes to localStorage:", err);
  }
}

/**
 * Reset all skill nodes back to initial SKILL_NODES values.
 */
export function resetSkillNodes(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(SKILL_MASTERY_KEY, JSON.stringify(structuredClone(SKILL_NODES)));
    // Also clear deltas to avoid orphaned deltas
    localStorage.removeItem(SKILL_DELTAS_BY_DATE_KEY);
  } catch (err) {
    console.error("Failed to reset skill nodes:", err);
  }
}

/**
 * Get all deltas stored by date.
 * Structure: { [dateStr: YYYY-MM-DD]: SkillProgressDelta[] }
 */
export function getDeltasByDate(): Record<string, SkillProgressDelta[]> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = localStorage.getItem(SKILL_DELTAS_BY_DATE_KEY);
    if (!stored) {
      return {};
    }
    return JSON.parse(stored);
  } catch (err) {
    console.error("Failed to load deltas by date from localStorage:", err);
    return {};
  }
}

/**
 * Save deltas by date to localStorage.
 */
export function saveDeltasByDate(deltas: Record<string, SkillProgressDelta[]>): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(SKILL_DELTAS_BY_DATE_KEY, JSON.stringify(deltas));
  } catch (err) {
    console.error("Failed to save deltas by date to localStorage:", err);
  }
}

/**
 * Get deltas for a specific date.
 */
export function getDeltasForDate(dateStr: string): SkillProgressDelta[] {
  const allDeltas = getDeltasByDate();
  return allDeltas[dateStr] ?? [];
}

/**
 * Save deltas for a specific date, replacing any existing deltas for that date.
 */
export function setDeltasForDate(dateStr: string, deltas: SkillProgressDelta[]): void {
  const allDeltas = getDeltasByDate();
  allDeltas[dateStr] = deltas;
  saveDeltasByDate(allDeltas);
}

/**
 * Remove all deltas for a specific date.
 */
export function clearDeltasForDate(dateStr: string): void {
  const allDeltas = getDeltasByDate();
  delete allDeltas[dateStr];
  saveDeltasByDate(allDeltas);
}

/**
 * Apply deltas to current skill mastery, updating stored skills.
 * Clamps mastery to [0, 100].
 */
export function applyDeltasToSkills(deltas: SkillProgressDelta[]): void {
  const skills = getStoredSkillNodes();

  deltas.forEach((delta) => {
    const skill = skills.find((s) => s.id === delta.skillNodeId);
    if (skill) {
      skill.mastery = Math.max(0, Math.min(100, skill.mastery + delta.delta));
    }
  });

  saveSkillNodes(skills);
}

/**
 * Rollback deltas from current skill mastery, updating stored skills.
 * Clamps mastery to [0, 100].
 */
export function rollbackDeltasFromSkills(deltas: SkillProgressDelta[]): void {
  const skills = getStoredSkillNodes();

  deltas.forEach((delta) => {
    const skill = skills.find((s) => s.id === delta.skillNodeId);
    if (skill) {
      skill.mastery = Math.max(0, Math.min(100, skill.mastery - delta.delta));
    }
  });

  saveSkillNodes(skills);
}

/**
 * Recompute skill mastery from base SKILL_NODES, then apply all stored deltas sequentially.
 * Useful after data corruption or manual resets.
 */
export function recomputeSkillMasteryFromBase(): void {
  if (typeof window === "undefined") {
    return;
  }

  // Reset to base
  const baseSkills = structuredClone(SKILL_NODES);
  const allDeltas = getDeltasByDate();

  // Apply all deltas in chronological order
  const sortedDates = Object.keys(allDeltas).sort();
  for (const dateStr of sortedDates) {
    const deltas = allDeltas[dateStr];
    deltas.forEach((delta) => {
      const skill = baseSkills.find((s) => s.id === delta.skillNodeId);
      if (skill) {
        skill.mastery = Math.max(0, Math.min(100, skill.mastery + delta.delta));
      }
    });
  }

  saveSkillNodes(baseSkills);
}
