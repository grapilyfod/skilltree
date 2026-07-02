import type {
  DailyReview,
  SkillCategoryId,
  SkillNode,
  SkillProgressDelta,
  TimeBlock,
} from "@/types";
import { SKILL_NODES } from "@/lib/mock-data";

export const DEFAULT_TARGET_TASK_COUNT = 30;

function clampMastery(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function getSkillTargetTaskCount(skill: SkillNode): number {
  if (
    typeof skill.targetTaskCount === "number" &&
    Number.isFinite(skill.targetTaskCount) &&
    skill.targetTaskCount >= 1
  ) {
    return Math.round(skill.targetTaskCount);
  }

  return DEFAULT_TARGET_TASK_COUNT;
}

export function normalizeSkillNodeDefinition(skill: SkillNode): SkillNode {
  return {
    ...skill,
    targetTaskCount: getSkillTargetTaskCount(skill),
  };
}

export function normalizeSkillNodeDefinitions(skills: SkillNode[]): SkillNode[] {
  return skills.map(normalizeSkillNodeDefinition);
}

function getFallbackSkillNodeId(
  categoryId: SkillCategoryId,
  knownNodes: SkillNode[],
): string | undefined {
  return knownNodes.find((node) => node.categoryId === categoryId)?.id;
}

function isKnownSkillNodeId(
  skillNodeId: string | undefined,
  knownNodes: SkillNode[],
): boolean {
  return !!skillNodeId && knownNodes.some((node) => node.id === skillNodeId);
}

/**
 * Old localStorage tasks from Increment 1-6 do not have skillNodeId.
 * This resolver keeps old saved tasks working without requiring localStorage reset.
 *
 * `knownNodes` defaults to the static seed list for old callers, but should be
 * passed the current dynamic skill node list wherever available.
 */
export function resolveSkillNodeId(
  block: TimeBlock,
  knownNodes: SkillNode[] = SKILL_NODES,
): string | undefined {
  if (isKnownSkillNodeId(block.skillNodeId, knownNodes)) {
    return block.skillNodeId;
  }

  const title = block.taskTitle.toLowerCase();
  const kpi = block.kpiGoal.toLowerCase();
  const text = `${title} ${kpi}`;

  if (
    text.includes("tcp") ||
    text.includes("network") ||
    text.includes("ip ") ||
    text.includes("handshake")
  ) {
    return "sk-3";
  }

  if (text.includes("linear") || text.includes("matrix") || text.includes("algebra")) {
    return "sk-2";
  }

  if (
    text.includes("architecture") ||
    text.includes("cpu") ||
    text.includes("computer architecture")
  ) {
    return "sk-1";
  }

  if (
    text.includes("scheduler") ||
    text.includes("operating system") ||
    text.includes(" os ") ||
    text.includes("process")
  ) {
    return "sk-4";
  }

  if (
    text.includes("c programming") ||
    text.includes(" c ") ||
    text.includes("malloc") ||
    text.includes("pointer")
  ) {
    return "sk-5";
  }

  if (text.includes("embedded") || text.includes("firmware") || text.includes("microcontroller")) {
    return "sk-6";
  }

  if (
    text.includes("crypto") ||
    text.includes("cipher") ||
    text.includes("ecb") ||
    text.includes("cbc")
  ) {
    return "sk-7";
  }

  if (
    text.includes("exploit") ||
    text.includes("memory safety") ||
    text.includes("buffer overflow")
  ) {
    return "sk-8";
  }

  if (text.includes("c++") || text.includes("cpp")) {
    return "sk-9";
  }

  if (
    text.includes("heap") ||
    text.includes("data structure") ||
    text.includes("algorithm") ||
    text.includes("dsa")
  ) {
    return "sk-10";
  }

  if (text.includes("english") || text.includes("readme") || text.includes("viết kỹ thuật")) {
    return "sk-11";
  }

  if (
    text.includes("github") ||
    text.includes("commit") ||
    text.includes("portfolio") ||
    text.includes("open source")
  ) {
    return "sk-12";
  }

  return getFallbackSkillNodeId(block.categoryId, knownNodes);
}

/**
 * Increment 10 task-equivalent scoring.
 * Done = 1, Partial = 0.5, Failed/Missed/Todo/Active = 0.
 * Priority and legacy masteryPoints are intentionally ignored.
 */
export function calculateTaskEquivalentProgress(block: TimeBlock): number {
  if (block.status === "done") {
    return 1;
  }

  if (block.status === "partial") {
    return 0.5;
  }

  return 0;
}

/**
 * Legacy name kept for compatibility with older imports.
 * It now returns task-equivalent progress, not arbitrary mastery points.
 */
export function calculateTaskSkillDelta(block: TimeBlock): number {
  return calculateTaskEquivalentProgress(block);
}

/**
 * Recalculate skill mastery from all saved timetables.
 * Mastery model:
 *   mastery % = completedEquivalentTasks / targetTaskCount * 100
 */
export function calculateSkillMasteryFromTimetables(
  timetables: Record<string, TimeBlock[]>,
  _dailyReviews: Record<string, DailyReview>,
  skillNodesBase: SkillNode[] = SKILL_NODES,
): SkillNode[] {
  const normalizedSkills = normalizeSkillNodeDefinitions(skillNodesBase);
  const masteryMap = new Map<string, SkillNode>(
    normalizedSkills.map((node) => [
      node.id,
      {
        ...node,
        mastery: 0,
        completedEquivalentTasks: 0,
        targetTaskCount: getSkillTargetTaskCount(node),
      },
    ]),
  );

  for (const blocks of Object.values(timetables)) {
    for (const block of blocks) {
      const skillNodeId = resolveSkillNodeId(block, normalizedSkills);
      if (!skillNodeId) {
        continue;
      }

      const skill = masteryMap.get(skillNodeId);
      if (!skill) {
        continue;
      }

      skill.completedEquivalentTasks =
        (skill.completedEquivalentTasks ?? 0) + calculateTaskEquivalentProgress(block);
    }
  }

  return Array.from(masteryMap.values()).map((skill) => {
    const targetTaskCount = getSkillTargetTaskCount(skill);
    const completedEquivalentTasks = Number((skill.completedEquivalentTasks ?? 0).toFixed(1));
    const mastery = targetTaskCount > 0
      ? (completedEquivalentTasks / targetTaskCount) * 100
      : 0;

    return {
      ...skill,
      targetTaskCount,
      completedEquivalentTasks,
      mastery: clampMastery(mastery),
    };
  });
}

/**
 * Legacy helper kept for compatibility with older imports.
 */
export function calculateDailySkillDeltas(
  dateStr: string,
  blocks: TimeBlock[],
): SkillProgressDelta[] {
  const deltas: SkillProgressDelta[] = [];
  const now = new Date().toISOString();

  for (const block of blocks) {
    const skillNodeId = resolveSkillNodeId(block);
    const delta = calculateTaskSkillDelta(block);

    if (skillNodeId && delta !== 0) {
      deltas.push({
        date: dateStr,
        skillNodeId,
        delta,
        sourceBlockId: block.id,
        appliedAt: now,
      });
    }
  }

  return deltas;
}

export function mergeDeltasBySkill(deltas: SkillProgressDelta[]): SkillProgressDelta[] {
  const merged = new Map<string, SkillProgressDelta>();

  for (const delta of deltas) {
    const key = `${delta.date}|${delta.skillNodeId}`;
    const existing = merged.get(key);

    if (existing) {
      existing.delta += delta.delta;
      if (delta.appliedAt < existing.appliedAt) {
        existing.appliedAt = delta.appliedAt;
      }
    } else {
      merged.set(key, { ...delta });
    }
  }

  return Array.from(merged.values());
}
