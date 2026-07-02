import type { CategoryColor, TaskPriority, TaskStatus } from "@/types";

interface CategoryStyle {
  text: string;
  border: string;
  dot: string;
  bar: string;
  bg?: string;
}

export const CATEGORY_COLOR_STYLES: Record<CategoryColor, CategoryStyle> = {
  indigo: {
    text: "text-indigo-300",
    bar: "bg-indigo-400",
    dot: "bg-indigo-400",
    border: "border-indigo-500/40",
    bg: "bg-indigo-500/10",
  },
  purple: {
    text: "text-purple-300",
    bar: "bg-purple-400",
    dot: "bg-purple-400",
    border: "border-purple-500/40",
    bg: "bg-purple-500/10",
  },
  fuchsia: {
    text: "text-fuchsia-300",
    bar: "bg-fuchsia-400",
    dot: "bg-fuchsia-400",
    border: "border-fuchsia-500/40",
    bg: "bg-fuchsia-500/10",
  },
  pink: {
    text: "text-pink-300",
    bar: "bg-pink-400",
    dot: "bg-pink-400",
    border: "border-pink-500/40",
    bg: "bg-pink-500/10",
  },
  orange: {
    text: "text-orange-300",
    bar: "bg-orange-400",
    dot: "bg-orange-400",
    border: "border-orange-500/40",
    bg: "bg-orange-500/10",
  },
  blue: {
    text: "text-blue-300",
    bar: "bg-blue-400",
    dot: "bg-blue-400",
    border: "border-blue-500/40",
    bg: "bg-blue-500/10",
  },
  teal: {
    text: "text-teal-300",
    bar: "bg-teal-400",
    dot: "bg-teal-400",
    border: "border-teal-500/40",
    bg: "bg-teal-500/10",
  },
  emerald: {
    text: "text-emerald-300",
    bar: "bg-emerald-400",
    dot: "bg-emerald-400",
    border: "border-emerald-500/40",
    bg: "bg-emerald-500/10",
  },
  cyan: {
    text: "text-cyan-300",
    bar: "bg-cyan-400",
    dot: "bg-cyan-400",
    border: "border-cyan-500/40",
    bg: "bg-cyan-500/10",
  },
  sky: {
    text: "text-sky-300",
    bar: "bg-sky-400",
    dot: "bg-sky-400",
    border: "border-sky-500/40",
    bg: "bg-sky-500/10",
  },
  violet: {
    text: "text-violet-300",
    bar: "bg-violet-400",
    dot: "bg-violet-400",
    border: "border-violet-500/40",
    bg: "bg-violet-500/10",
  },
  amber: {
    text: "text-amber-300",
    bar: "bg-amber-400",
    dot: "bg-amber-400",
    border: "border-amber-500/40",
    bg: "bg-amber-500/10",
  },
  rose: {
    text: "text-rose-300",
    bar: "bg-rose-400",
    dot: "bg-rose-400",
    border: "border-rose-500/40",
    bg: "bg-rose-500/10",
  },
  lime: {
    text: "text-lime-300",
    bar: "bg-lime-400",
    dot: "bg-lime-400",
    border: "border-lime-500/40",
    bg: "bg-lime-500/10",
  },
};

export const CATEGORY_COLOR_KEYS: CategoryColor[] = [
  "indigo",
  "purple",
  "fuchsia",
  "pink",
  "orange",
  "blue",
  "teal",
  "emerald",
  "cyan",
  "sky",
  "violet",
  "amber",
  "rose",
  "lime",
];

export function getRandomCategoryColor(usedColors: CategoryColor[] = []): CategoryColor {
  const availableColors = CATEGORY_COLOR_KEYS.filter(
    (color) => !usedColors.includes(color),
  );

  const colorPool =
    availableColors.length > 0 ? availableColors : CATEGORY_COLOR_KEYS;

  return colorPool[Math.floor(Math.random() * colorPool.length)];
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

const DEFAULT_CATEGORY_STYLE: CategoryStyle = {
  text: "text-zinc-300",
  border: "border-zinc-500/40",
  dot: "bg-zinc-400",
  bar: "bg-zinc-400",
};

export function getCategoryStyle(
  categoryId: string,
  color?: CategoryColor,
): CategoryStyle {
  if (color) {
    return CATEGORY_COLOR_STYLES[color];
  }

  return CATEGORY_STYLES[categoryId] ?? DEFAULT_CATEGORY_STYLE;
}

interface StatusStyle {
  label: string;
  text: string;
  bg: string;
  ring: string;
}

export const STATUS_STYLES: Record<TaskStatus, StatusStyle> = {
  todo: {
    label: "Chưa đạt",
    text: "text-zinc-400",
    bg: "bg-zinc-800",
    ring: "ring-zinc-700",
  },
  active: {
    label: "Đang làm",
    text: "text-amber-300",
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/50",
  },
  done: {
    label: "Đạt",
    text: "text-emerald-300",
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-500/40",
  },
  partial: {
    label: "Đạt một phần",
    text: "text-sky-300",
    bg: "bg-sky-500/10",
    ring: "ring-sky-500/40",
  },
  missed: {
    label: "Không đạt",
    text: "text-red-300",
    bg: "bg-red-500/10",
    ring: "ring-red-500/40",
  },
};

export const PRIORITY_LABEL: Record<TaskPriority, string> = {
  must: "Bắt buộc",
  should: "Nên làm",
  stretch: "Thưởng thêm",
};