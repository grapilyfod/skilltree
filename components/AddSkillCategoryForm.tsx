"use client";

import { useState } from "react";

const INPUT_CLASS =
  "mt-1 w-full rounded border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 transition-colors hover:border-white/20 focus:border-white/30 focus:outline-none";

interface AddSkillCategoryFormProps {
  /** Raw user input; caller is responsible for generating the id. */
  onSubmit: (input: { name: string; description: string }) => void;
  onCancel: () => void;
  onAlert: (
    title: string,
    message: string,
    variant?: "danger" | "warning" | "info",
  ) => void;
}

export function AddSkillCategoryForm({
  onSubmit,
  onCancel,
  onAlert,
}: AddSkillCategoryFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      onAlert(
        "Thiếu tên category",
        "Vui lòng nhập tên category trước khi lưu.",
        "warning",
      );
      return;
    }

    onSubmit({ name: name.trim(), description: description.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border border-white/[0.06] bg-[#101216] p-6">
        <h2 className="text-lg font-medium text-white">+ Add category</h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400">Tên category</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={INPUT_CLASS}
              placeholder="Ví dụ: DevOps"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400">Mô tả (tùy chọn)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className={INPUT_CLASS}
              placeholder="Mô tả ngắn về nhánh kỹ năng này"
            />
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
              Thêm Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
