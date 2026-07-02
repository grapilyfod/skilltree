"use client";
import { getRandomCategoryColor } from "@/lib/style-maps";
import { useState, useEffect, useMemo } from "react";
import type { TimeBlock, TaskStatus, DailyReview, SkillCategory, SkillNode, SkillCategoryId } from "@/types";
import { TimetableList } from "@/components/TimetableList";
import { KPISummaryBar } from "@/components/KPISummaryBar";
import { TimeBlockForm } from "@/components/TimeBlockForm";
import { DateSelector } from "@/components/DateSelector";
import { DailyReviewModal } from "@/components/DailyReviewModal";
import { DailyReviewCard } from "@/components/DailyReviewCard";
import { SkillTree } from "@/components/SkillTree";
import { WeeklySummaryCard } from "@/components/WeeklySummaryCard";
import { AddSkillCategoryForm } from "@/components/AddSkillCategoryForm";
import { AddSkillNodeForm } from "@/components/AddSkillNodeForm";
import { SKILL_CATEGORIES, SKILL_NODES } from "@/lib/mock-data";
import { calculateKPISummary } from "@/lib/kpi";
import {
  getTimetable,
  getTimetablesMap,
  setTimetable,
  deleteTimetable,
} from "@/lib/date-storage";
import { formatDate, getToday } from "@/lib/date-utils";
import {
  getDailyReviews,
  saveDailyReview,
  deleteDailyReview,
} from "@/lib/review-storage";
import { calculateStreak } from "@/lib/streak-utils";
import { calculateSkillMasteryFromTimetables } from "@/lib/skill-mastery";
import { calculateWeeklySummary } from "@/lib/weekly-summary";
import {
  getStoredSkillCategories,
  saveSkillCategories,
  getStoredSkillNodeDefinitions,
  saveSkillNodeDefinitions,
} from "@/lib/skill-tree-storage";

const PROGRESS_PANELS_VISIBILITY_KEY = "skillforge_show_progress_panels";

interface DashboardClientProps {
  initialBlocks: TimeBlock[];
}

export function DashboardClient({ initialBlocks }: DashboardClientProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(getToday());
  const [blocks, setBlocksState] = useState<TimeBlock[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [dailyReviews, setDailyReviews] = useState<Record<string, DailyReview>>({});
  const [showProgressPanels, setShowProgressPanels] = useState(true);
  const [isProgressPreferenceLoaded, setIsProgressPreferenceLoaded] = useState(false);
  // --- Custom Skill Tree Builder state (Increment 9) ---
  // Seeded from SKILL_CATEGORIES / SKILL_NODES on first-ever load, then
  // persisted to localStorage so custom categories/skills survive refresh.
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [skillNodesBase, setSkillNodesBase] = useState<SkillNode[]>([]);
  const [isSkillTreeLoaded, setIsSkillTreeLoaded] = useState(false);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [showAddSkillForm, setShowAddSkillForm] = useState(false);

  const kpiSummary = calculateKPISummary(blocks);
  const selectedDateStr = formatDate(selectedDate);
  const currentDayReview = dailyReviews[selectedDateStr];
  const realStreak = calculateStreak(dailyReviews);

  const calculatedSkillNodes = useMemo(() => {
    const timetables = getTimetablesMap();

    // Include current React state immediately so Skill Tree updates as soon as
    // the user changes task status/adds/edits/deletes a task.
    timetables[selectedDateStr] = blocks;

    return calculateSkillMasteryFromTimetables(timetables, dailyReviews, skillNodesBase);
  }, [blocks, dailyReviews, selectedDateStr, skillNodesBase]);

  const weeklySummary = useMemo(() => {
    const timetables = getTimetablesMap();
    timetables[selectedDateStr] = blocks;

    return calculateWeeklySummary(
      timetables,
      dailyReviews,
      selectedDateStr,
      skillNodesBase,
      skillCategories,
    );
  }, [blocks, dailyReviews, selectedDateStr, skillNodesBase, skillCategories]);

  /**
   * Load daily reviews on mount.
   */
  useEffect(() => {
    const reviews = getDailyReviews();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDailyReviews(reviews);
  }, []);

  /**
   * Load skill categories + skill node definitions on mount.
   * If localStorage is missing or empty, seed from the default
   * SKILL_CATEGORIES / SKILL_NODES mock data (old behavior preserved).
   */
  useEffect(() => {
    const storedCategories = getStoredSkillCategories();
const storedNodes = getStoredSkillNodeDefinitions();

const initialCategories =
  storedCategories.length > 0 ? storedCategories : SKILL_CATEGORIES;

const initialNodes = storedNodes.length > 0 ? storedNodes : SKILL_NODES;

const defaultCategoryIds = new Set(SKILL_CATEGORIES.map((category) => category.id));

const normalizedCategories = initialCategories.map((category) => {
  if (!defaultCategoryIds.has(category.id) && !category.color) {
    return {
      ...category,
      color: getRandomCategoryColor(),
    };
  }

  return category;
});

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSkillCategories(normalizedCategories);
    setSkillNodesBase(initialNodes);
    setIsSkillTreeLoaded(true);
  }, []);

  /**
   * Persist skill categories to localStorage whenever they change
   * (including the very first seed write).
   */
  useEffect(() => {
    if (isSkillTreeLoaded) {
      saveSkillCategories(skillCategories);
    }
  }, [skillCategories, isSkillTreeLoaded]);

  /**
   * Persist skill node definitions to localStorage whenever they change
   * (including the very first seed write).
   */
  useEffect(() => {
    if (isSkillTreeLoaded) {
      saveSkillNodeDefinitions(skillNodesBase);
    }
  }, [skillNodesBase, isSkillTreeLoaded]);

  /**
   * Load timetable for selected date from localStorage on mount and when date changes.
   */
  useEffect(() => {
    const saved = getTimetable(selectedDateStr);
    if (saved.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBlocksState(saved);
    } else {
      // If today and no saved data, use initialBlocks
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (
        formatDate(selectedDate) === formatDate(today) &&
        initialBlocks.length > 0
      ) {
         
        setBlocksState(initialBlocks);
      } else {
        // Other days: start with empty
         
        setBlocksState([]);
      }
    }
     
    setIsLoaded(true);
  }, [selectedDateStr, selectedDate, initialBlocks]);

  /**
   * Persist blocks to localStorage whenever they change for the selected date.
   */
  useEffect(() => {
    if (isLoaded && selectedDateStr) {
      setTimetable(selectedDateStr, blocks);
    }
  }, [blocks, isLoaded, selectedDateStr]);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedValue = window.localStorage.getItem(PROGRESS_PANELS_VISIBILITY_KEY);

    if (savedValue !== null) {
      setShowProgressPanels(savedValue === "true");
    }

    setIsProgressPreferenceLoaded(true);
  }, []);
  useEffect(() => {
    if (typeof window === "undefined" || !isProgressPreferenceLoaded) {
      return;
    }

    window.localStorage.setItem(
      PROGRESS_PANELS_VISIBILITY_KEY,
      String(showProgressPanels),
    );
  }, [showProgressPanels, isProgressPreferenceLoaded]);
  /**
   * Handle status change for a single timeblock.
   */
  const handleBlockStatusChange = (blockId: string, newStatus: TaskStatus) => {
    setBlocksState((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === blockId ? { ...block, status: newStatus } : block,
      ),
    );
  };

  /**
   * Open form to add a new task.
   */
  const handleAddTask = () => {
    setEditingBlock(null);
    setShowForm(true);
  };

  /**
   * Open form to edit an existing task.
   */
  const handleEditTask = (block: TimeBlock) => {
    setEditingBlock(block);
    setShowForm(true);
  };

  /**
   * Delete a task with confirmation.
   */
  const handleDeleteTask = (blockId: string) => {
    if (typeof window !== "undefined" && window.confirm("Bạn chắc chắn muốn xóa task này?")) {
      setBlocksState((prevBlocks) => prevBlocks.filter((b) => b.id !== blockId));
    }
  };

  /**
   * Save or update a timeblock from form submission.
   */
  const handleSaveBlock = (blockData: TimeBlock | Omit<TimeBlock, "id">) => {
    if ("id" in blockData) {
      // Update existing block
      setBlocksState((prevBlocks) =>
        prevBlocks.map((b) => (b.id === blockData.id ? blockData : b)),
      );
    } else {
      // Add new block
      const newBlock: TimeBlock = {
        ...blockData,
        id: crypto.randomUUID(),
        status: "todo",
      };
      setBlocksState((prevBlocks) => [...prevBlocks, newBlock]);
    }
    setShowForm(false);
    setEditingBlock(null);
  };

  /**
   * Reset timetable for selected date only.
   */
  const handleResetDay = () => {
    if (
      typeof window !== "undefined" &&
      window.confirm("Bạn chắc chắn muốn reset tất cả task của ngày này?")
    ) {
      deleteTimetable(selectedDateStr);
      deleteDailyReview(selectedDateStr);

      setDailyReviews((prev) => {
        const next = { ...prev };
        delete next[selectedDateStr];
        return next;
      });

      // If today, reset to initialBlocks; otherwise reset to empty
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (formatDate(selectedDate) === formatDate(today)) {
        setBlocksState(initialBlocks);
      } else {
        setBlocksState([]);
      }
    }
  };

  /**
   * Open daily review modal.
   */
  const handleOpenReview = () => {
    setShowReviewModal(true);
  };

  /**
   * Save daily review and let Skill Tree recalculate from source data.
   */
  const handleSaveReview = (review: DailyReview) => {
    saveDailyReview(review);
    setDailyReviews((prev) => ({
      ...prev,
      [review.date]: review,
    }));
    setShowReviewModal(false);
  };

  /**
   * Add a new custom skill category. Id is generated here so it's guaranteed
   * unique and consistent regardless of which form triggered it.
   */
  const handleAddCategory = (input: { name: string; description: string }) => {
  const newCategory: SkillCategory = {
    id: `cat-${crypto.randomUUID()}`,
    label: input.name,
    description: input.description,
    color: getRandomCategoryColor(
      skillCategories
        .map((category) => category.color)
        .filter((color): color is NonNullable<typeof color> => Boolean(color)),
    ),
  };

  setSkillCategories((prev) => [...prev, newCategory]);
  setShowAddCategoryForm(false);
};

  /**
   * Add a new custom skill node inside an existing category (built-in or custom).
   * Starts at 0 mastery; the Skill Tree will recalculate real mastery from
   * tasks that reference it going forward.
   */
  const handleAddSkill = (input: { categoryId: SkillCategoryId; name: string }) => {
    const newSkill: SkillNode = {
      id: `skill-${crypto.randomUUID()}`,
      categoryId: input.categoryId,
      name: input.name,
      mastery: 0,
    };
    setSkillNodesBase((prev) => [...prev, newSkill]);
    setShowAddSkillForm(false);
  };
const handleDeleteSkill = (node: SkillNode) => {
  const isDefaultSkill = SKILL_NODES.some((skill) => skill.id === node.id);

  if (isDefaultSkill) {
    window.alert("Không nên xóa default skill. Chỉ xóa custom skill bạn tự tạo.");
    return;
  }

  const timetables = getTimetablesMap();

  const isUsedInSavedTasks = Object.values(timetables).some((dayBlocks) =>
    dayBlocks.some((block) => block.skillNodeId === node.id),
  );

  const isUsedToday = blocks.some((block) => block.skillNodeId === node.id);

  if (isUsedInSavedTasks || isUsedToday) {
    window.alert(
      `Skill "${node.name}" đang được dùng trong task. Hãy edit/xóa các task đó trước.`,
    );
    return;
  }

  if (
    typeof window !== "undefined" &&
    window.confirm(`Xóa skill "${node.name}"?`)
  ) {
    setSkillNodesBase((prev) =>
      prev.filter((skill) => skill.id !== node.id),
    );
  }
};

const handleDeleteCategory = (category: SkillCategory) => {
  const isDefaultCategory = SKILL_CATEGORIES.some(
    (item) => item.id === category.id,
  );

  if (isDefaultCategory) {
    window.alert("Không nên xóa default category. Chỉ xóa custom category bạn tự tạo.");
    return;
  }

  const childSkills = skillNodesBase.filter(
    (node) => node.categoryId === category.id,
  );

  if (childSkills.length > 0) {
    window.alert("Category này còn skill bên trong. Hãy xóa skill trước rồi mới xóa category.");
    return;
  }

  const timetables = getTimetablesMap();

  const isUsedInSavedTasks = Object.values(timetables).some((dayBlocks) =>
    dayBlocks.some((block) => block.categoryId === category.id),
  );

  const isUsedToday = blocks.some((block) => block.categoryId === category.id);

  if (isUsedInSavedTasks || isUsedToday) {
    window.alert(
      `Category "${category.label}" đang được dùng trong task. Hãy edit/xóa các task đó trước.`,
    );
    return;
  }

  if (
    typeof window !== "undefined" &&
    window.confirm(`Xóa category "${category.label}"?`)
  ) {
    setSkillCategories((prev) =>
      prev.filter((item) => item.id !== category.id),
    );
  }
};
  if (!isLoaded || !isSkillTreeLoaded) {
    return null;
  }

  return (
    <>
      <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />

      <KPISummaryBar blocks={blocks} summary={{ ...kpiSummary, streakDays: realStreak }} />

      <div className="flex flex-wrap justify-end gap-3">
        <button
          onClick={() => setShowProgressPanels((current) => !current)}
          className="rounded border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-sky-300 transition-all hover:bg-sky-500/20"
        >
          {showProgressPanels ? "Ẩn progress" : "Hiện progress"}
        </button>

        <button
          onClick={handleOpenReview}
          className="rounded border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-emerald-400 transition-all hover:bg-emerald-500/20"
        >
          {currentDayReview ? "✎ Edit Review" : "📝 Review Day"}
        </button>

        <button
          onClick={handleResetDay}
          className="rounded border border-white/[0.06] bg-white/5 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-zinc-400 transition-all hover:bg-white/10 hover:text-zinc-300"
        >
          Reset Day
        </button>
      </div>

      {showProgressPanels && (
        <>
          {currentDayReview && (
            <DailyReviewCard review={currentDayReview} onEdit={handleOpenReview} />
          )}

          <WeeklySummaryCard summary={weeklySummary} />
        </>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Lịch trình {selectedDateStr}
          </h2>
          <TimetableList
            blocks={blocks}
            categories={skillCategories}
            skillNodes={calculatedSkillNodes}
            onStatusChange={handleBlockStatusChange}
            onAddTask={handleAddTask}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500">
              Skill tree
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddCategoryForm(true)}
                className="rounded border border-white/[0.06] bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-400 transition-all hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
              >
                + Add category
              </button>
              <button
                onClick={() => setShowAddSkillForm(true)}
                className="rounded border border-white/[0.06] bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-400 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-300"
              >
                + Add skill
              </button>
            </div>
          </div>
          <SkillTree
            categories={skillCategories}
            nodes={calculatedSkillNodes}
            onDeleteCategory={handleDeleteCategory}
            onDeleteSkill={handleDeleteSkill}
          />
        </section>
      </div>

      {showForm && (
        <TimeBlockForm
          initialBlock={editingBlock || undefined}
          skillCategories={skillCategories}
          skillNodes={skillNodesBase}
          onSubmit={handleSaveBlock}
          onCancel={() => {
            setShowForm(false);
            setEditingBlock(null);
          }}
        />
      )}

      {showReviewModal && (
        <DailyReviewModal
          dateStr={selectedDateStr}
          blocks={blocks}
          existingReview={currentDayReview}
          onSubmit={handleSaveReview}
          onCancel={() => setShowReviewModal(false)}
        />
      )}

      {showAddCategoryForm && (
        <AddSkillCategoryForm
          onSubmit={handleAddCategory}
          onCancel={() => setShowAddCategoryForm(false)}
        />
      )}

      {showAddSkillForm && (
        <AddSkillNodeForm
          categories={skillCategories}
          onSubmit={handleAddSkill}
          onCancel={() => setShowAddSkillForm(false)}
        />
      )}
    </>
  );
}
