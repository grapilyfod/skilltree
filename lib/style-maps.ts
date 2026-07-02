import type { TaskStatus, TaskPriority } from "@/types";

interface CategoryStyle {
  text: string;
  border: string;
  dot: string;
  bar: string;
}

export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  foundations: {
    text: "text-violet-300",
    border: "border-violet-500/40",
    dot: "bg-violet-400",
    bar: "bg-violet-400",
  },
  "low-level-systems": {
    text: "text-teal-300",
    border: "border-teal-500/40",
    dot: "bg-teal-400",
    bar: "bg-teal-400",
  },
  security: {
    text: "text-amber-300",
    border: "border-amber-500/40",
    dot: "bg-amber-400",
    bar: "bg-amber-400",
  },
  programming: {
    text: "text-rose-300",
    border: "border-rose-500/40",
    dot: "bg-rose-400",
    bar: "bg-rose-400",
  },
  career: {
    text: "text-emerald-300",
    border: "border-emerald-500/40",
    dot: "bg-emerald-400",
    bar: "bg-emerald-400",
  },
};

/** Neutral style used for any category id not in CATEGORY_STYLES (e.g. custom categories). */
const DEFAULT_CATEGORY_STYLE: CategoryStyle = {
  text: "text-zinc-300",
  border: "border-zinc-500/40",
  dot: "bg-zinc-400",
  bar: "bg-zinc-400",
};

/**
 * Safe lookup for a category's visual style. Falls back to a neutral style
 * for custom categories that aren't part of the hand-picked palette above.
 */
export function getCategoryStyle(categoryId: string): CategoryStyle {
  return CATEGORY_STYLES[categoryId] ?? DEFAULT_CATEGORY_STYLE;
}

interface StatusStyle {
  label: string;
  text: string;
  bg: string;
  ring: string;
}

export const STATUS_STYLES: Record<TaskStatus, StatusStyle> = {
  todo: { label: "Chưa đạt", text: "text-zinc-400", bg: "bg-zinc-800", ring: "ring-zinc-700" },
  active: { label: "Đang làm", text: "text-amber-300", bg: "bg-amber-500/10", ring: "ring-amber-500/50" },
  done: { label: "Đạt", text: "text-emerald-300", bg: "bg-emerald-500/10", ring: "ring-emerald-500/40" },
  partial: { label: "Đạt một phần", text: "text-sky-300", bg: "bg-sky-500/10", ring: "ring-sky-500/40" },
  missed: { label: "Không đạt", text: "text-red-300", bg: "bg-red-500/10", ring: "ring-red-500/40" },
};

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  must: "Bắt buộc",
  should: "Nên làm",
  stretch: "Thưởng thêm",
};
