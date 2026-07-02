import type { DailyReview } from "@/types";
import { formatDate } from "@/lib/date-utils";

interface ReviewLike {
  submitted?: boolean;
  completed?: boolean;
  isCompleted?: boolean;
  reviewedAt?: string;
  createdAt?: string;
}

/**
 * A Daily Review counts as "completed" if any of these fields is truthy:
 * submitted, completed, isCompleted, reviewedAt, createdAt.
 * This intentionally does NOT look at must tasks or review.result —
 * streak tracks whether you showed up and reviewed, not task perfection.
 */
function isReviewCompleted(review: DailyReview | undefined): boolean {
  if (!review) {
    return false;
  }

  const candidate = review as DailyReview & ReviewLike;

  if (candidate.submitted || candidate.completed || candidate.isCompleted) {
    return true;
  }

  return Boolean(candidate.reviewedAt || candidate.createdAt);
}

/**
 * Calculate the current streak from daily reviews.
 * Counts consecutive days from today backwards where the Daily Review is
 * completed (see isReviewCompleted). Does not depend on must tasks or on
 * all tasks being done.
 */
export function calculateStreak(reviews: Record<string, DailyReview>): number {
  let streak = 0;
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Look backwards from today
  while (true) {
    const dateStr = formatDate(currentDate);
    const review = reviews[dateStr];

    if (!isReviewCompleted(review)) {
      // If there's no completed review, check if this is today or in the future
      // If it's today or future, continue looking back; otherwise break
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (currentDate.getTime() > now.getTime()) {
        // Future date, skip
        currentDate.setDate(currentDate.getDate() - 1);
        continue;
      } else if (currentDate.getTime() === now.getTime()) {
        // Today but no review yet, stop
        break;
      } else {
        // Past date without a completed review, streak is broken
        break;
      }
    }

    // Found a completed review
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}

/**
 * Calculate review result based on must tasks status.
 * Returns:
 * - "no_must_tasks" if no must tasks
 * - "achieved" if all must tasks are done
 * - "partial" if at least one must task is done/partial
 * - "failed" otherwise
 */
export function calculateReviewResult(
  mustDone: number,
  mustPartial: number,
  mustMissed: number,
  mustTotal: number,
): "achieved" | "partial" | "failed" | "no_must_tasks" {
  if (mustTotal === 0) {
    return "no_must_tasks";
  }

  if (mustMissed === 0 && mustDone + mustPartial === mustTotal) {
    // All must tasks are either done or partial, but need all done for achieved
    if (mustPartial === 0 && mustDone === mustTotal) {
      return "achieved";
    } else {
      return "partial";
    }
  }

  if (mustDone > 0 || mustPartial > 0) {
    return "partial";
  }

  return "failed";
}

/**
 * Get result label in Vietnamese.
 */
export function getResultLabel(result: "achieved" | "partial" | "failed" | "no_must_tasks"): string {
  const labels = {
    achieved: "Đạt ✓",
    partial: "Đạt một phần ◐",
    failed: "Không đạt ✗",
    no_must_tasks: "Không có must task",
  };
  return labels[result];
}

/**
 * Get mood label in Vietnamese.
 */
export function getMoodLabel(mood: "easy" | "okay" | "hard"): string {
  const labels = {
    easy: "Dễ dàng 😄",
    okay: "Bình thường 😐",
    hard: "Khó khăn 😤",
  };
  return labels[mood];
}
