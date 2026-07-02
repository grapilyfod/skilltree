import type { SkillCategory, SkillNode } from "@/types";

const CATEGORIES_KEY = "skillforge_categories";
const SKILL_NODES_KEY = "skillforge_skill_nodes";

/**
 * Get stored skill categories from localStorage.
 * Returns [] if missing, invalid, or on the server — caller decides how to seed.
 */
export function getStoredSkillCategories(): SkillCategory[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(CATEGORIES_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored) as SkillCategory[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to read skill categories from localStorage:", err);
    return [];
  }
}

/**
 * Persist the full list of skill categories (built-in + custom).
 */
export function saveSkillCategories(categories: SkillCategory[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (err) {
    console.error("Failed to save skill categories to localStorage:", err);
  }
}

/**
 * Get stored skill node definitions from localStorage.
 * These are the *definitions* (id, categoryId, name, base mastery) — not the
 * live recalculated mastery shown in the Skill Tree.
 * Returns [] if missing, invalid, or on the server — caller decides how to seed.
 */
export function getStoredSkillNodeDefinitions(): SkillNode[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(SKILL_NODES_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored) as SkillNode[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to read skill nodes from localStorage:", err);
    return [];
  }
}

/**
 * Persist the full list of skill node definitions (built-in + custom).
 */
export function saveSkillNodeDefinitions(nodes: SkillNode[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(SKILL_NODES_KEY, JSON.stringify(nodes));
  } catch (err) {
    console.error("Failed to save skill nodes to localStorage:", err);
  }
}
