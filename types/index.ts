/**
 * Core domain types for SkillForge.
 * Keep this file the single source of truth for shared shapes —
 * components and mock data should import from here, never redeclare.
 */

export type TaskStatus = "todo" | "active" | "done" | "partial" | "missed";

export type TaskPriority = "must" | "should" | "stretch";

/**
 * Category ids used to be a fixed literal union (5 built-in branches).
 * Increment 9 adds custom categories created at runtime with generated ids
 * (e.g. "cat-<uuid>"), so this is now a plain string. The 5 default ids
 * ("foundations", "low-level-systems", "security", "programming", "career")
 * remain valid values, just no longer type-checked as a closed set.
 */
export type SkillCategoryId = string;

export type CategoryColor =
  | "indigo"
  | "purple"
  | "fuchsia"
  | "pink"
  | "orange"
  | "blue"
  | "teal"
  | "emerald"
  | "cyan"
  | "sky"
  | "violet"
  | "amber"
  | "rose"
  | "lime";

export interface SkillCategory {
  id: string;
  label: string;
  description: string;
  color?: CategoryColor;
}

export interface SkillNode {
  id: string;
  categoryId: SkillCategoryId;
  name: string;
  /** Mastery percentage, 0–100. */
  mastery: number;
  /** Number of completed task-equivalents needed for this skill to reach 100%. */
  targetTaskCount?: number;
  /** Computed from done + partial tasks; used only for display. */
  completedEquivalentTasks?: number;
}

export interface TimeBlock {
  id: string;
  /** 24h "HH:mm" format, local time. */
  startTime: string;
  endTime: string;
  taskTitle: string;
  categoryId: SkillCategoryId;
  priority: TaskPriority;
  status: TaskStatus;
  /** What "done" concretely looks like for this block. */
  kpiGoal: string;
  /** What the user must submit to prove completion. */
  evidenceRequired: string;
  /** Actual proof or notes submitted after doing the task. */
  evidenceNote?: string;
  /** External proof link, for example GitHub, Google Drive, Notion, or an article. */
  evidenceLink?: string;
  /** Short self-reflection after completing or attempting this task. */
  reflection?: string;
  /** Linked skill node this block trains, if any. */
  skillNodeId?: string;
  carriedFromId?: string;
  carriedFromDate?: string;
}

export interface DailyKPISummary {
  date: string;
  totalTasks: number;
  mustTasksTotal: number;
  mustTasksDone: number;
  doneCount: number;
  partialCount: number;
  missedCount: number;
  streakDays: number;
}

export type DailyReviewResult = "achieved" | "partial" | "failed" | "no_must_tasks";

export type ReviewMood = "easy" | "okay" | "hard";

export interface DailyReview {
  date: string; // YYYY-MM-DD
  result: DailyReviewResult;
  mood: ReviewMood;
  blockers: string;
  reflection: string;
  /** First time this review was submitted. Used for streak eligibility. */
  submittedAt?: string; // ISO timestamp
  /** Last time this review was saved/edited. */
  reviewedAt: string; // ISO timestamp
  mustDone: number;
  mustPartial: number;
  mustMissed: number;
  mustTotal: number;
}

export interface SkillProgressDelta {
  date: string; // YYYY-MM-DD
  skillNodeId: string;
  delta: number; // points added/removed from mastery
  sourceBlockId: string; // which task generated this delta
  appliedAt: string; // ISO timestamp
}
