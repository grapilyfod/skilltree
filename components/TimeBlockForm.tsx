"use client";

import { useState } from "react";
import type { SkillCategory, SkillNode, TimeBlock, SkillCategoryId, TaskPriority } from "@/types";

const SELECT_CLASS =
  "mt-1 w-full rounded border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 transition-colors hover:border-white/20 focus:border-white/30 focus:outline-none";
const OPTION_CLASS = "bg-zinc-950 text-zinc-100";

interface TimeBlockFormProps {
  onSubmit: (block: Omit<TimeBlock, "id"> | TimeBlock) => void;
  onCancel: () => void;
  initialBlock?: TimeBlock;
  /** Current skill categories (built-in + custom). */
  skillCategories: SkillCategory[];
  /** Current skill node definitions (built-in + custom). */
  skillNodes: SkillNode[];
}

export function TimeBlockForm({
  onSubmit,
  onCancel,
  initialBlock,
  skillCategories,
  skillNodes,
}: TimeBlockFormProps) {
  const isEdit = !!initialBlock;

  // Helper: get skills for a category
  const getSkillsForCategory = (categoryId: SkillCategoryId) => {
    return skillNodes.filter((skill) => skill.categoryId === categoryId);
  };

  // Helper: get first skill of a category
  const getFirstSkillOfCategory = (categoryId: SkillCategoryId) => {
    const skills = getSkillsForCategory(categoryId);
    return skills.length > 0 ? skills[0].id : undefined;
  };

  const initialCategoryId = (initialBlock?.categoryId ?? skillCategories[0]?.id ?? "programming") as SkillCategoryId;
  const initialSkillNodeId =
    initialBlock?.skillNodeId ?? getFirstSkillOfCategory(initialCategoryId);

  const [formData, setFormData] = useState({
    taskTitle: initialBlock?.taskTitle ?? "",
    startTime: initialBlock?.startTime ?? "06:00",
    endTime: initialBlock?.endTime ?? "07:00",
    categoryId: initialCategoryId,
    priority: (initialBlock?.priority ?? "should") as TaskPriority,
    kpiGoal: initialBlock?.kpiGoal ?? "",
    evidenceRequired: initialBlock?.evidenceRequired ?? "",
    skillNodeId: initialSkillNodeId,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // When category changes, reset skillNodeId to first skill of new category
    if (name === "categoryId") {
      const newCategoryId = value as SkillCategoryId;
      setFormData((prev) => ({
        ...prev,
        [name]: newCategoryId,
        skillNodeId: getFirstSkillOfCategory(newCategoryId),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.taskTitle.trim()) {
      alert("Vui lòng nhập tiêu đề task");
      return;
    }
    if (!formData.kpiGoal.trim()) {
      alert("Vui lòng nhập KPI goal");
      return;
    }
    if (!formData.evidenceRequired.trim()) {
      alert("Vui lòng nhập bằng chứng yêu cầu");
      return;
    }

    const submittedData = isEdit
      ? {
          id: initialBlock.id,
          ...formData,
          status: initialBlock.status,
        }
      : {
          ...formData,
          status: "todo" as const,
        };

    onSubmit(submittedData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg border border-white/[0.06] bg-[#101216] p-6">
        <h2 className="text-lg font-medium text-white">
          {isEdit ? "Sửa Task" : "Thêm Task Mới"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium text-zinc-400">
              Tiêu đề Task
            </label>
            <input
              type="text"
              name="taskTitle"
              value={formData.taskTitle}
              onChange={handleChange}
              className="mt-1 w-full rounded border border-white/[0.06] bg-white/5 px-3 py-2 text-sm text-white placeholder-zinc-600 transition-colors hover:border-white/[0.12] focus:border-white/[0.2] focus:outline-none"
              placeholder="Ví dụ: Đọc 1 bài về TCP handshake"
            />
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400">
                Bắt đầu lúc
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="mt-1 w-full rounded border border-white/[0.06] bg-white/5 px-3 py-2 text-sm text-white transition-colors hover:border-white/[0.12] focus:border-white/[0.2] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400">
                Kết thúc lúc
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="mt-1 w-full rounded border border-white/[0.06] bg-white/5 px-3 py-2 text-sm text-white transition-colors hover:border-white/[0.12] focus:border-white/[0.2] focus:outline-none"
              />
            </div>
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400">
                Danh mục
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className={SELECT_CLASS}
              >
                {skillCategories.map((cat) => (
                  <option key={cat.id} value={cat.id} className={OPTION_CLASS}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400">
                Mức độ ưu tiên
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={SELECT_CLASS}
              >
                <option value="must" className={OPTION_CLASS}>
                  Must
                </option>
                <option value="should" className={OPTION_CLASS}>
                  Should
                </option>
                <option value="stretch" className={OPTION_CLASS}>
                  Stretch
                </option>
              </select>
            </div>
          </div>

          {/* Skill Selector */}
          <div>
            <label className="block text-sm font-medium text-zinc-400">
              Kỹ năng
            </label>
            <select
              name="skillNodeId"
              value={formData.skillNodeId ?? ""}
              onChange={handleChange}
              className={SELECT_CLASS}
            >
              <option value="" className={OPTION_CLASS}>
                Không chọn kỹ năng
              </option>
              {getSkillsForCategory(formData.categoryId).map((skill) => (
                <option key={skill.id} value={skill.id} className={OPTION_CLASS}>
                  {skill.name}
                </option>
              ))}
            </select>
          </div>

          {/* KPI Goal */}
          <div>
            <label className="block text-sm font-medium text-zinc-400">
              KPI Goal
            </label>
            <textarea
              name="kpiGoal"
              value={formData.kpiGoal}
              onChange={handleChange}
              rows={2}
              className="mt-1 w-full rounded border border-white/[0.06] bg-white/5 px-3 py-2 text-sm text-white placeholder-zinc-600 transition-colors hover:border-white/[0.12] focus:border-white/[0.2] focus:outline-none"
              placeholder="Ví dụ: Tóm tắt lại 3 bước bắt tay TCP bằng lời của mình"
            />
          </div>

          {/* Evidence Required */}
          <div>
            <label className="block text-sm font-medium text-zinc-400">
              Bằng chứng Yêu cầu
            </label>
            <textarea
              name="evidenceRequired"
              value={formData.evidenceRequired}
              onChange={handleChange}
              rows={2}
              className="mt-1 w-full rounded border border-white/[0.06] bg-white/5 px-3 py-2 text-sm text-white placeholder-zinc-600 transition-colors hover:border-white/[0.12] focus:border-white/[0.2] focus:outline-none"
              placeholder="Ví dụ: Đoạn tóm tắt 3-5 câu"
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
              {isEdit ? "Cập nhật" : "Thêm Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
