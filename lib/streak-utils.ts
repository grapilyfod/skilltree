import type { DailyReview } from "@/types";
import { formatDate } from "@/lib/date-utils";

interface ReviewLike {
  submitted?: boolean;
  completed?: boolean;
  isCompleted?: boolean;
  submittedAt?: string;
  reviewedAt?: string;
  createdAt?: string;
}

function getLocalDateFromTimestamp(timestamp: string | undefined): string | null {
  if (!timestamp) {
    return null;
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return formatDate(date);
}

/**
 * A review is streak-eligible only if it was first submitted on the same
 * local calendar day as the review date.
 *
 * Example:
 * - Today is 2026-07-04, user reviews 2026-07-04 => counts.
 * - Today is 2026-07-04, user goes back and reviews 2026-07-03 => saved,
 *   but does NOT count for streak.
 */
export function isReviewSubmittedOnDate(
  review: DailyReview | undefined,
  dateStr: string,
): boolean {
  if (!review || review.date !== dateStr) {
    return false;
  }

  const candidate = review as DailyReview & ReviewLike;

  if (candidate.submitted === false || candidate.completed === false || candidate.isCompleted === false) {
    return false;
  }

  const submittedDate = getLocalDateFromTimestamp(
    candidate.submittedAt ?? candidate.reviewedAt ?? candidate.createdAt,
  );

  return submittedDate === dateStr;
}

/**
 * Calculate the current streak from today backwards.
 *
 * Rules:
 * - Today MUST have a streak-eligible Daily Review, otherwise streak = 0.
 * - A past date counts only if its review was actually submitted on that date.
 * - Backfilling yesterday's review today will save the review, but will not
 *   increase or repair the streak.
 */
export function calculateStreak(
  reviews: Record<string, DailyReview>,
  today: Date = new Date(),
): number {
  let streak = 0;
  const currentDate = new Date(today);
  currentDate.setHours(0, 0, 0, 0);

  const todayStr = formatDate(currentDate);
  if (!isReviewSubmittedOnDate(reviews[todayStr], todayStr)) {
    return 0;
  }

  while (true) {
    const dateStr = formatDate(currentDate);

    if (!isReviewSubmittedOnDate(reviews[dateStr], dateStr)) {
      break;
    }

    streak += 1;
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
