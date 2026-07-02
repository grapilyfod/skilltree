"use client";

import { useState } from "react";
import type { TimeBlock, DailyReview } from "@/types";
import { calculateReviewResult } from "@/lib/streak-utils";
import { getMoodLabel } from "@/lib/streak-utils";

interface DailyReviewModalProps {
  dateStr: string;
  blocks: TimeBlock[];
  existingReview?: DailyReview;
  onSubmit: (review: DailyReview) => void;
  onCancel: () => void;
}

export function DailyReviewModal({
  dateStr,
  blocks,
  existingReview,
  onSubmit,
  onCancel,
}: DailyReviewModalProps) {
  const isEdit = !!existingReview;

  // Calculate must tasks stats
  const mustBlocks = blocks.filter((b) => b.priority === "must");
  const mustDone = mustBlocks.filter((b) => b.status === "done").length;
  const mustPartial = mustBlocks.filter((b) => b.status === "partial").length;
  const mustMissed = mustBlocks.filter((b) => b.status === "missed").length;
  const mustTotal = mustBlocks.length;

  // Calculate result
  const result = calculateReviewResult(mustDone, mustPartial, mustMissed, mustTotal);

  // Form state
  const [mood, setMood] = useState<"easy" | "okay" | "hard">(
    existingReview?.mood ?? "okay",
  );
  const [blockers, setBlockers] = useState(existingReview?.blockers ?? "");
  const [reflection, setReflection] = useState(existingReview?.reflection ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const review: DailyReview = {
      date: dateStr,
      result,
      mood,
      blockers,
      reflection,
      reviewedAt: new Date().toISOString(),
      mustDone,
      mustPartial,
      mustMissed,
      mustTotal,
    };

    onSubmit(review);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg border border-white/[0.06] bg-[#101216] p-6">
        <h2 className="text-lg font-medium text-white">
          {isEdit ? "Chỉnh sửa Review" : "Đánh giá Ngày"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Date and Result Info */}
          <div className="rounded border border-white/[0.06] bg-white/5 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-mono text-zinc-500">{dateStr}</p>
                <p className="mt-1 font-mono text-sm text-zinc-400">
                  Must: {mustDone} done • {mustPartial} partial • {mustMissed} missed / {mustTotal}{" "}
                  total
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Kết quả hôm nay</p>
                <p className="mt-1 text-lg font-semibold text-emerald-300">
                  {result === "achieved"
                    ? "✓ Đạt"
                    : result === "partial"
                      ? "◐ Một phần"
                      : result === "failed"
                        ? "✗ Không đạt"
                        : "⊘ Không có must"}
                </p>
              </div>
            </div>
          </div>

          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-medium text-zinc-400">Cảm xúc hôm nay</label>
            <div className="mt-2 flex gap-2">
              {(["easy", "okay", "hard"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`flex-1 rounded px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${
                    mood === m
                      ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/50"
                      : "bg-white/5 text-zinc-400 hover:bg-white/10"
                  }`}
                >
                  {getMoodLabel(m)}
                </button>
              ))}
            </div>
          </div>

          {/* Blockers */}
          <div>
            <label className="block text-sm font-medium text-zinc-400">Bị kẹt ở đâu?</label>
            <textarea
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded border border-white/[0.06] bg-white/5 px-3 py-2 text-sm text-white placeholder-zinc-600 transition-colors hover:border-white/[0.12] focus:border-white/[0.2] focus:outline-none"
              placeholder="Ghi các điểm bị kẹt hoặc cản trở..."
            />
          </div>

          {/* Reflection */}
          <div>
            <label className="block text-sm font-medium text-zinc-400">Tóm tắt ngày hôm nay</label>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded border border-white/[0.06] bg-white/5 px-3 py-2 text-sm text-white placeholder-zinc-600 transition-colors hover:border-white/[0.12] focus:border-white/[0.2] focus:outline-none"
              placeholder="Ghi lại những gì đã học và những điều cần cải thiện..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded border border-white/[0.06] bg-white/5 px-4 py-2 text-sm font-medium text-zinc-400 transition-all hover:bg-white/10 hover:text-zinc-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-300 ring-1 ring-emerald-500/50 transition-all hover:bg-emerald-500/30"
            >
              {isEdit ? "Cập nhật Review" : "Lưu Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
