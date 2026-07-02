import type { DailyReview, SkillNode, TimeBlock, SkillCategoryId, SkillProgressDelta } from "@/types";
import { SKILL_NODES } from "@/lib/mock-data";

/**
 * Increment 7 scoring.
 * Use whole-number deltas so changes are visible in the 0-100 UI.
 * Mastery is recalculated from source data, not incrementally mutated.
 */
const SCORE_TABLE: Record<string, Record<string, number>> = {
  must: {
    done: 3,
    partial: 1.5,
    missed: 0,
    todo: 0,
    active: 0,
  },
  should: {
    done: 2,
    partial: 1,
    missed: 0,
    todo: 0,
    active: 0,
  },
  stretch: {
    done: 1,
    partial: 0.5,
    missed: 0,
    todo: 0,
    active: 0,
  },
};

const DAILY_DISCIPLINE_SKILL_ID = "sk-13";

function clampMastery(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getFallbackSkillNodeId(categoryId: SkillCategoryId, knownNodes: SkillNode[]): string | undefined {
  return knownNodes.find((node) => node.categoryId === categoryId)?.id;
}

function isKnownSkillNodeId(skillNodeId: string | undefined, knownNodes: SkillNode[]): boolean {
  return !!skillNodeId && knownNodes.some((node) => node.id === skillNodeId);
}

/**
 * Old localStorage tasks from Increment 1-6 do not have skillNodeId.
 * If we only fallback to the first node in the category, TCP tasks change
 * "Computer architecture" instead of "Networking fundamentals".
 * This resolver keeps old saved tasks working without requiring localStorage reset.
 *
 * `knownNodes` defaults to the static seed list for old callers, but should be
 * passed the current dynamic skill node list (built-in + custom) wherever
 * available, so custom skillNodeIds resolve correctly instead of being
 * treated as unknown.
 */
export function resolveSkillNodeId(block: TimeBlock, knownNodes: SkillNode[] = SKILL_NODES): string | undefined {
  if (isKnownSkillNodeId(block.skillNodeId, knownNodes)) {
    return block.skillNodeId;
  }

  const title = block.taskTitle.toLowerCase();
  const kpi = block.kpiGoal.toLowerCase();
  const text = `${title} ${kpi}`;

  if (text.includes("tcp") || text.includes("network") || text.includes("ip ") || text.includes("handshake")) {
    return "sk-3";
  }

  if (text.includes("linear") || text.includes("matrix") || text.includes("algebra")) {
    return "sk-2";
  }

  if (text.includes("architecture") || text.includes("cpu") || text.includes("computer architecture")) {
    return "sk-1";
  }

  if (text.includes("scheduler") || text.includes("operating system") || text.includes(" os ") || text.includes("process")) {
    return "sk-4";
  }

  if (text.includes("c programming") || text.includes(" c ") || text.includes("malloc") || text.includes("pointer")) {
    return "sk-5";
  }

  if (text.includes("embedded") || text.includes("firmware") || text.includes("microcontroller")) {
    return "sk-6";
  }

  if (text.includes("crypto") || text.includes("cipher") || text.includes("ecb") || text.includes("cbc")) {
    return "sk-7";
  }

  if (text.includes("exploit") || text.includes("memory safety") || text.includes("buffer overflow")) {
    return "sk-8";
  }

  if (text.includes("c++") || text.includes("cpp")) {
    return "sk-9";
  }

  if (text.includes("heap") || text.includes("data structure") || text.includes("algorithm") || text.includes("dsa")) {
    return "sk-10";
  }

  if (text.includes("english") || text.includes("readme") || text.includes("viết kỹ thuật")) {
    return "sk-11";
  }

  if (text.includes("github") || text.includes("commit") || text.includes("portfolio") || text.includes("open source")) {
    return "sk-12";
  }

  return getFallbackSkillNodeId(block.categoryId, knownNodes);
}

/**
 * Calculate skill delta for a single task block.
 */
export function calculateTaskSkillDelta(block: TimeBlock): number {
  const score = SCORE_TABLE[block.priority]?.[block.status];
  return score ?? 0;
}

/**
 * Recalculate skill mastery from all saved timetables + daily reviews.
 * This avoids double-counting when the user changes status or edits/deletes tasks.
 *
 * `skillNodesBase` is the current set of skill definitions (built-in + custom,
 * loaded from localStorage). Every node in it is included in the result, even
 * custom skills that haven't been trained by any task yet (mastery stays at
 * their base value, e.g. 0 for freshly created skills).
 */
export function calculateSkillMasteryFromTimetables(
  timetables: Record<string, TimeBlock[]>,
  dailyReviews: Record<string, DailyReview>,
  skillNodesBase: SkillNode[] = SKILL_NODES,
): SkillNode[] {
  const masteryMap = new Map<string, SkillNode>(
    skillNodesBase.map((node) => [node.id, { ...node }]),
  );

  for (const blocks of Object.values(timetables)) {
    for (const block of blocks) {
      const skillNodeId = resolveSkillNodeId(block, skillNodesBase);
      if (!skillNodeId) {
        continue;
      }

      const skill = masteryMap.get(skillNodeId);
      if (!skill) {
        continue;
      }

      skill.mastery += calculateTaskSkillDelta(block);
    }
  }

  const discipline = masteryMap.get(DAILY_DISCIPLINE_SKILL_ID);
  if (discipline) {
    for (const review of Object.values(dailyReviews)) {
      if (review.reviewedAt) {
        discipline.mastery += 1;
      }
    }
  }

  return Array.from(masteryMap.values()).map((skill) => ({
    ...skill,
    mastery: clampMastery(skill.mastery),
  }));
}

/**
 * Legacy helper kept for compatibility with older imports.
 * New Increment 7 UI should use calculateSkillMasteryFromTimetables instead.
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
