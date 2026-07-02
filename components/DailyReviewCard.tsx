"use client";

import type { DailyReview } from "@/types";
import { getResultLabel } from "@/lib/streak-utils";

interface DailyReviewCardProps {
  review: DailyReview;
  onEdit: (review: DailyReview) => void;
}

export function DailyReviewCard({ review, onEdit }: DailyReviewCardProps) {
  const reviewDate = new Date(review.reviewedAt);
  const reviewTime = reviewDate.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white">{getResultLabel(review.result)}</h3>
            <span className="text-xs font-mono text-zinc-500">({review.date})</span>
          </div>

          <div className="mt-2 space-y-1 text-xs text-zinc-400">
            <p>
              <span className="text-zinc-500">Must tasks:</span> {review.mustDone} đạt •{" "}
              {review.mustPartial} một phần • {review.mustMissed} không đạt /{" "}
              {review.mustTotal} tổng
            </p>
            <p>
              <span className="text-zinc-500">Review lúc:</span> {reviewTime}
            </p>
          </div>

          {review.blockers && (
            <div className="mt-2 rounded border border-white/[0.06] bg-black/20 p-2">
              <p className="text-[11px] uppercase tracking-wide text-zinc-500">Bị kẹt ở đâu?</p>
              <p className="mt-1 text-xs text-zinc-300">{review.blockers}</p>
            </div>
          )}

          {review.reflection && (
            <div className="mt-2 rounded border border-white/[0.06] bg-black/20 p-2">
              <p className="text-[11px] uppercase tracking-wide text-zinc-500">Tóm tắt</p>
              <p className="mt-1 text-xs text-zinc-300">{review.reflection}</p>
            </div>
          )}
        </div>

        <button
          onClick={() => onEdit(review)}
          className="rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-500 transition-all hover:text-zinc-300 hover:bg-white/10"
          title="Chỉnh sửa review"
        >
          ✎
        </button>
      </div>
    </div>
  );
}
