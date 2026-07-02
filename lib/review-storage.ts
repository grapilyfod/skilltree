import type { DailyReview } from "@/types";

const DAILY_REVIEWS_KEY = "skillforge_daily_reviews";

/**
 * Get all daily reviews from localStorage.
 * Returns { [dateStr: YYYY-MM-DD]: DailyReview }
 * Safe to call on server (returns {}).
 */
export function getDailyReviews(): Record<string, DailyReview> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = window.localStorage.getItem(DAILY_REVIEWS_KEY);
    return stored ? (JSON.parse(stored) as Record<string, DailyReview>) : {};
  } catch (error) {
    console.error("Failed to read daily reviews from localStorage:", error);
    return {};
  }
}

/**
 * Get daily review for a specific date.
 * Returns null if not found.
 */
export function getDailyReview(dateStr: string): DailyReview | null {
  const reviews = getDailyReviews();
  return reviews[dateStr] ?? null;
}

/**
 * Save a daily review.
 */
export function saveDailyReview(review: DailyReview): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const reviews = getDailyReviews();
    reviews[review.date] = review;
    window.localStorage.setItem(DAILY_REVIEWS_KEY, JSON.stringify(reviews));
  } catch (error) {
    console.error("Failed to save daily review:", error);
  }
}

/**
 * Delete a daily review.
 */
export function deleteDailyReview(dateStr: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const reviews = getDailyReviews();
    delete reviews[dateStr];
    window.localStorage.setItem(DAILY_REVIEWS_KEY, JSON.stringify(reviews));
  } catch (error) {
    console.error("Failed to delete daily review:", error);
  }
}

/**
 * Clear all daily reviews.
 */
export function clearAllDailyReviews(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(DAILY_REVIEWS_KEY);
  } catch (error) {
    console.error("Failed to clear daily reviews:", error);
  }
}
