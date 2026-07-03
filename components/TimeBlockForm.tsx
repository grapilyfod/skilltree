"use client";

import { useState } from "react";
import type {
  SkillCategory,
  SkillCategoryId,
  SkillNode,
  TaskPriority,
  TimeBlock,
} from "@/types";

const FIELD_CLASS =
  "mt-1 w-full rounded border border-white/[0.06] bg-white/5 px-3 py-2 text-sm text-white placeholder-zinc-600 transition-colors hover:border-white/[0.12] focus:border-white/[0.2] focus:outline-none";
const SELECT_CLASS =
  "mt-1 w-full rounded border border-white/10 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 transition-colors hover:border-white/20 focus:border-white/30 focus:outline-none";
const OPTION_CLASS = "bg-zinc-950 text-zinc-100";

interface TimeBlockFormProps {
  onSubmit: (block: Omit<TimeBlock, "id"> | TimeBlock) => void;
  onCancel: () => void;
  onAlert: (
    title: string,
    message: string,
    variant?: "danger" | "warning" | "info",
  ) => void;
  initialBlock?: TimeBlock;
  skillCategories: SkillCategory[];
  skillNodes: SkillNode[];
}

export function TimeBlockForm({
  onSubmit,
  onCancel,
  onAlert,
  initialBlock,
  skillCategories,
  skillNodes,
}: TimeBlockFormProps) {
  const isEdit = !!initialBlock;

  const getSkillsForCategory = (categoryId: SkillCategoryId) => {
    return skillNodes.filter((skill) => skill.categoryId === categoryId);
  };

  const getFirstSkillOfCategory = (categoryId: SkillCategoryId) => {
    const skills = getSkillsForCategory(categoryId);
    return skills.length > 0 ? skills[0].id : undefined;
  };

  const initialCategoryId = (initialBlock?.categoryId ??
    skillCategories[0]?.id ??
    "") as SkillCategoryId;
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
    evidenceNote: initialBlock?.evidenceNote ?? "",
    evidenceLink: initialBlock?.evidenceLink ?? "",
    reflection: initialBlock?.reflection ?? "",
    skillNodeId: initialSkillNodeId,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "categoryId") {
      const newCategoryId = value as SkillCategoryId;
      setFormData((prev) => ({
        ...prev,
        categoryId: newCategoryId,
        skillNodeId: getFirstSkillOfCategory(newCategoryId),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.taskTitle.trim()) {
      onAlert(
        "Thiếu tiêu đề task",
        "Vui lòng nhập tiêu đề task trước khi lưu.",
        "warning",
      );
      return;
    }

    if (!formData.categoryId.trim()) {
      onAlert(
        "Chưa có danh mục",
        "Vui lòng tạo hoặc chọn danh mục trước khi thêm task.",
        "warning",
      );
      return;
    }

    if (!formData.kpiGoal.trim()) {
      onAlert(
        "Thiếu KPI goal",
        "Vui lòng nhập KPI goal để task có tiêu chí hoàn thành rõ ràng.",
        "warning",
      );
      return;
    }

    if (!formData.evidenceRequired.trim()) {
      onAlert(
        "Thiếu bằng chứng yêu cầu",
        "Vui lòng nhập bằng chứng yêu cầu để biết task cần nộp/kết quả gì.",
        "warning",
      );
      return;
    }

    const submittedData = isEdit
      ? {
          ...initialBlock,
          ...formData,
          id: initialBlock.id,
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
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-white/[0.06] bg-[#101216] p-6">
        <h2 className="text-lg font-medium text-white">
          {isEdit ? "Sửa Task" : "Thêm Task Mới"}
        </h2>

        {skillCategories.length === 0 && (
          <div className="mt-4 rounded border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
            App đang trống category. Hãy tạo category trong Skill Tree trước, rồi quay lại thêm task.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400">
              Tiêu đề Task
            </label>
            <input
              type="text"
              name="taskTitle"
              value={formData.taskTitle}
              onChange={handleChange}
              className={FIELD_CLASS}
              placeholder="Ví dụ: Đọc 1 bài về TCP handshake"
            />
          </div>

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
                className={FIELD_CLASS}
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
                className={FIELD_CLASS}
              />
            </div>
          </div>

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
                {skillCategories.length === 0 && (
                  <option value="" className={OPTION_CLASS}>
                    Chưa có danh mục
                  </option>
                )}
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
                  Bắt buộc
                </option>
                <option value="should" className={OPTION_CLASS}>
                  Nên làm
                </option>
                <option value="stretch" className={OPTION_CLASS}>
                  Bổ sung
                </option>
              </select>
            </div>
          </div>

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

          <div>
            <label className="block text-sm font-medium text-zinc-400">
              KPI Goal
            </label>
            <textarea
              name="kpiGoal"
              value={formData.kpiGoal}
              onChange={handleChange}
              rows={2}
              className={FIELD_CLASS}
              placeholder="Ví dụ: Giải 5 bài heap và commit code lên GitHub"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400">
              Bằng chứng yêu cầu
            </label>
            <textarea
              name="evidenceRequired"
              value={formData.evidenceRequired}
              onChange={handleChange}
              rows={2}
              className={FIELD_CLASS}
              placeholder="Ví dụ: Link commit GitHub + ghi chú ngắn đã học được gì"
            />
          </div>

          <div className="rounded border border-white/[0.06] bg-white/[0.03] p-4">
            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                Evidence / Notes
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Phần này có thể điền sau khi làm task xong để lưu bằng chứng thật.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400">
                  Ghi chú bằng chứng
                </label>
                <textarea
                  name="evidenceNote"
                  value={formData.evidenceNote}
                  onChange={handleChange}
                  rows={2}
                  className={FIELD_CLASS}
                  placeholder="Ví dụ: Đã giải 5 bài, sai 1 bài do nhầm heap min/max"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400">
                  Link bằng chứng
                </label>
                <input
                  type="text"
                  name="evidenceLink"
                  value={formData.evidenceLink}
                  onChange={handleChange}
                  className={FIELD_CLASS}
                  placeholder="Ví dụ: https://github.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400">
                  Reflection sau khi làm
                </label>
                <textarea
                  name="reflection"
                  value={formData.reflection}
                  onChange={handleChange}
                  rows={3}
                  className={FIELD_CLASS}
                  placeholder="Ví dụ: Mình đã hiểu heapify, push/pop nhưng cần luyện thêm bài priority queue"
                />
              </div>
            </div>
          </div>

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
