"use client";

import { useState } from "react";
import type { SkillCategory, SkillCategoryId } from "@/types";
import { DEFAULT_TARGET_TASK_COUNT } from "@/lib/skill-mastery";

const INPUT_CLASS =
  "mt-1 w-full rounded border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 transition-colors hover:border-white/20 focus:border-white/30 focus:outline-none";
const SELECT_CLASS =
  "mt-1 w-full rounded border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 transition-colors hover:border-white/20 focus:border-white/30 focus:outline-none";
const OPTION_CLASS = "bg-zinc-950 text-zinc-100";

interface AddSkillNodeFormProps {
  categories: SkillCategory[];
  /** Raw user input; caller is responsible for generating the id. */
  onSubmit: (input: {
    categoryId: SkillCategoryId;
    name: string;
    targetTaskCount: number;
  }) => void;
  onCancel: () => void;
  onAlert: (
    title: string,
    message: string,
    variant?: "danger" | "warning" | "info",
  ) => void;
}

export function AddSkillNodeForm({
  categories,
  onSubmit,
  onCancel,
  onAlert,
}: AddSkillNodeFormProps) {
  const [categoryId, setCategoryId] = useState<SkillCategoryId>(categories[0]?.id ?? "");
  const [name, setName] = useState("");
  const [targetTaskCount, setTargetTaskCount] = useState(DEFAULT_TARGET_TASK_COUNT);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryId) {
      onAlert(
        "Chưa chọn category",
        "Vui lòng chọn category trước khi thêm skill.",
        "warning",
      );
      return;
    }

    if (!name.trim()) {
      onAlert(
        "Thiếu tên skill",
        "Vui lòng nhập tên skill trước khi lưu.",
        "warning",
      );
      return;
    }

    if (!Number.isFinite(targetTaskCount) || targetTaskCount < 1) {
      onAlert(
        "Target tasks không hợp lệ",
        "Target tasks phải lớn hơn hoặc bằng 1.",
        "warning",
      );
      return;
    }

    onSubmit({
      categoryId,
      name: name.trim(),
      targetTaskCount: Math.round(targetTaskCount),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-white/[0.06] bg-[#101216] p-6">
        <h2 className="text-lg font-medium text-white">+ Add skill</h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={SELECT_CLASS}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className={OPTION_CLASS}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400">Tên skill</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={INPUT_CLASS}
              placeholder="Ví dụ: Docker basics"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400">
              Target tasks to reach 100%
            </label>
            <input
              type="number"
              min={1}
              value={targetTaskCount}
              onChange={(e) => setTargetTaskCount(Number(e.target.value))}
              className={INPUT_CLASS}
            />
            <p className="mt-1 text-xs text-zinc-500">
              Ví dụ: 10 nghĩa là mỗi task đạt = 10%, mỗi task một phần = 5%.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
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
              Thêm Skill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
