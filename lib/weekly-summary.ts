import type { DailyReview, SkillCategory, SkillNode, TimeBlock } from "@/types";
import { formatDate, parseDate } from "@/lib/date-utils";
import { SKILL_CATEGORIES, SKILL_NODES } from "@/lib/mock-data";
import { resolveSkillNodeId } from "@/lib/skill-mastery";

export interface WeeklySummary {
  startDate: string;
  endDate: string;
  totalTasks: number;
  doneTasks: number;
  partialTasks: number;
  failedTasks: number;
  completionRate: number;
  mustTasks: number;
  mustDoneTasks: number;
  reviewDays: number;
  activeDays: number;
  topSkill: {
    id: string;
    name: string;
    points: number;
  } | null;
  focusSkill: {
    id: string;
    name: string;
    reason: string;
  } | null;
}

interface ReviewLike {
  submitted?: boolean;
  completed?: boolean;
  isCompleted?: boolean;
  reviewedAt?: string;
  createdAt?: string;
}

interface BlockWithOptionalMasteryPoints extends TimeBlock {
  masteryPoints?: number;
}

function normalizeStatus(status?: string | null): "done" | "partial" | "failed" | null {
  const value = status?.toString().trim().toLowerCase() ?? "";

  if (!value) {
    return null;
  }

  if (value === "done" || value === "đạt") {
    return "done";
  }

  if (value === "partial" || value === "một phần") {
    return "partial";
  }

  if (value === "failed" || value === "không đạt" || value === "missed") {
    return "failed";
  }

  return null;
}

function getTaskMasteryPoints(block: TimeBlock): number {
  const candidate = block as BlockWithOptionalMasteryPoints;
  if (typeof candidate.masteryPoints === "number" && Number.isFinite(candidate.masteryPoints)) {
    return candidate.masteryPoints;
  }

  switch (block.priority) {
    case "must":
      return 3;
    case "should":
      return 2;
    default:
      return 2;
  }
}

function getReviewCompletion(review: DailyReview | undefined): boolean {
  const candidate = review as DailyReview & ReviewLike | undefined;
  if (!candidate) {
    return false;
  }

  if (candidate.submitted || candidate.completed || candidate.isCompleted) {
    return true;
  }

  return Boolean(candidate.reviewedAt || candidate.createdAt);
}

function getSkillNodeName(
  skillNodeId: string | undefined,
  fallbackCategoryId: string | undefined,
  skillNodes: SkillNode[],
  skillCategories: SkillCategory[],
): string | null {
  if (skillNodeId) {
    const node = skillNodes.find((item) => item.id === skillNodeId);
    if (node) {
      return node.name;
    }
  }

  if (fallbackCategoryId) {
    const category = skillCategories.find((item) => item.id === fallbackCategoryId);
    if (category) {
      return category.label;
    }
  }

  return null;
}

export function calculateWeeklySummary(
  timetables: Record<string, TimeBlock[]>,
  dailyReviews: Record<string, DailyReview>,
  selectedDateStr: string,
  skillNodes: SkillNode[] = SKILL_NODES,
  skillCategories: SkillCategory[] = SKILL_CATEGORIES,
): WeeklySummary {
  const startDate = parseDate(selectedDateStr);
  const range: string[] = [];

  for (let index = 6; index >= 0; index -= 1) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() - index);
    range.push(formatDate(day));
  }

  const summary: WeeklySummary = {
  startDate: range[0],
  endDate: range[range.length - 1],
  totalTasks: 0,
  doneTasks: 0,
  partialTasks: 0,
  failedTasks: 0,
  completionRate: 0,
  mustTasks: 0,
  mustDoneTasks: 0,
  activeDays: 0,
  reviewDays: 0,
  topSkill: null,
  focusSkill: null,
};

  const skillPoints = new Map<string, number>();
  const weakTaskCounts = new Map<string, number>();
  const weakSkillNames = new Map<string, string>();
  const weakSkillCategoryIds = new Map<string, string>();

  for (const dateStr of range) {
  const blocks = timetables[dateStr] ?? [];

  if (blocks.length > 0) {
    summary.activeDays += 1;
  }

  for (const block of blocks) {
    summary.totalTasks += 1;

      const normalizedStatus = normalizeStatus(block.status);
      if (normalizedStatus === "done") {
        summary.doneTasks += 1;
      } else if (normalizedStatus === "partial") {
        summary.partialTasks += 1;
      } else if (normalizedStatus === "failed") {
        summary.failedTasks += 1;
      }

      if (block.priority === "must") {
        summary.mustTasks += 1;
        if (normalizedStatus === "done") {
          summary.mustDoneTasks += 1;
        }
      }

      if (normalizedStatus === "done") {
        const resolvedSkillNodeId = resolveSkillNodeId(block, skillNodes);
        if (resolvedSkillNodeId) {
          skillPoints.set(resolvedSkillNodeId, (skillPoints.get(resolvedSkillNodeId) ?? 0) + getTaskMasteryPoints(block));
        }
      } else if (normalizedStatus === "partial") {
        const resolvedSkillNodeId = resolveSkillNodeId(block, skillNodes);
        if (resolvedSkillNodeId) {
          skillPoints.set(resolvedSkillNodeId, (skillPoints.get(resolvedSkillNodeId) ?? 0) + getTaskMasteryPoints(block) * 0.5);
        }
      } else if (normalizedStatus === "failed") {
        const resolvedSkillNodeId = resolveSkillNodeId(block, skillNodes);
        if (resolvedSkillNodeId) {
          const categoryId = block.categoryId;
          weakTaskCounts.set(resolvedSkillNodeId, (weakTaskCounts.get(resolvedSkillNodeId) ?? 0) + 1);
          weakSkillNames.set(resolvedSkillNodeId, getSkillNodeName(resolvedSkillNodeId, categoryId, skillNodes, skillCategories) ?? resolvedSkillNodeId);
          weakSkillCategoryIds.set(resolvedSkillNodeId, categoryId);
        }
      }

      if (normalizedStatus === "partial") {
        const resolvedSkillNodeId = resolveSkillNodeId(block, skillNodes);
        if (resolvedSkillNodeId) {
          const categoryId = block.categoryId;
          weakTaskCounts.set(resolvedSkillNodeId, (weakTaskCounts.get(resolvedSkillNodeId) ?? 0) + 1);
          weakSkillNames.set(resolvedSkillNodeId, getSkillNodeName(resolvedSkillNodeId, categoryId, skillNodes, skillCategories) ?? resolvedSkillNodeId);
          weakSkillCategoryIds.set(resolvedSkillNodeId, categoryId);
        }
      }
    }
  }

  summary.completionRate = summary.totalTasks > 0
    ? ((summary.doneTasks + summary.partialTasks * 0.5) / summary.totalTasks) * 100
    : 0;

  const topSkillEntry = Array.from(skillPoints.entries()).sort((left, right) => right[1] - left[1])[0];
  if (topSkillEntry) {
    const [skillNodeId, points] = topSkillEntry;
    const node = skillNodes.find((item) => item.id === skillNodeId);
    summary.topSkill = {
      id: skillNodeId,
      name: node?.name ?? skillNodeId,
      points: Number(points.toFixed(1)),
    };
  }

  const focusSkillEntry = Array.from(weakTaskCounts.entries()).sort((left, right) => right[1] - left[1])[0];
  if (focusSkillEntry) {
    const [skillNodeId, count] = focusSkillEntry;
    const fallbackCategoryId = weakSkillCategoryIds.get(skillNodeId);
    const name = weakSkillNames.get(skillNodeId) ?? getSkillNodeName(skillNodeId, fallbackCategoryId, skillNodes, skillCategories) ?? skillNodeId;
    summary.focusSkill = {
      id: skillNodeId,
      name,
      reason: `${count} task chưa đạt hoặc chỉ đạt một phần`,
    };
  }

  for (const dateStr of range) {
    const review = dailyReviews[dateStr];
    if (getReviewCompletion(review)) {
      summary.reviewDays += 1;
    }
  }

  return summary;
}
