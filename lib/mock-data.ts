import type {
  DailyKPISummary,
  SkillCategory,
  SkillNode,
  TimeBlock,
} from "@/types";

export const SKILL_CATEGORIES: SkillCategory[] = [];

export const SKILL_NODES: SkillNode[] = [];

export const TODAY_TIMEBLOCKS: TimeBlock[] = [];

export const KPI_SUMMARY: DailyKPISummary = {
  date: new Date().toISOString().slice(0, 10),
  totalTasks: 0,
  mustTasksTotal: 0,
  mustTasksDone: 0,
  doneCount: 0,
  partialCount: 0,
  missedCount: 0,
  streakDays: 0,
};