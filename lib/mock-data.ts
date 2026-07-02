import type {
  DailyKPISummary,
  SkillCategory,
  SkillNode,
  TimeBlock,
} from "@/types";

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "foundations",
    label: "Foundations",
    description: "Math, OS theory, computer architecture, networking",
  },
  {
    id: "low-level-systems",
    label: "Low-level Systems",
    description: "C/C++, OS internals, embedded, memory & concurrency",
  },
  {
    id: "security",
    label: "Security",
    description: "Cryptography, exploitation basics, secure systems design",
  },
  {
    id: "programming",
    label: "Programming Core",
    description: "Language fluency, tooling, data structures & algorithms",
  },
  {
    id: "career",
    label: "Career & Portfolio",
    description: "English, GitHub, remote-work skills, applications",
  },
];

export const SKILL_NODES: SkillNode[] = [
  { id: "sk-1", categoryId: "foundations", name: "Computer architecture", mastery: 0, targetTaskCount: 30 },
  { id: "sk-2", categoryId: "foundations", name: "Linear algebra for CS", mastery: 0, targetTaskCount: 30 },
  { id: "sk-3", categoryId: "foundations", name: "Networking fundamentals", mastery: 0, targetTaskCount: 30 },
  { id: "sk-4", categoryId: "low-level-systems", name: "Operating systems", mastery: 0, targetTaskCount: 30 },
  { id: "sk-5", categoryId: "low-level-systems", name: "C programming", mastery: 0, targetTaskCount: 30 },
  { id: "sk-6", categoryId: "low-level-systems", name: "Embedded firmware", mastery: 0, targetTaskCount: 30 },
  { id: "sk-7", categoryId: "security", name: "Cryptography basics", mastery: 0, targetTaskCount: 30 },
  { id: "sk-8", categoryId: "security", name: "Memory safety & exploits", mastery: 0, targetTaskCount: 30 },
  { id: "sk-9", categoryId: "programming", name: "C++", mastery: 0, targetTaskCount: 30 },
  { id: "sk-10", categoryId: "programming", name: "Data structures & algorithms", mastery: 0, targetTaskCount: 30 },
  { id: "sk-11", categoryId: "career", name: "Technical English", mastery: 0, targetTaskCount: 30 },
  { id: "sk-12", categoryId: "career", name: "GitHub / open source", mastery: 0, targetTaskCount: 30 },
  { id: "sk-13", categoryId: "career", name: "Learning discipline", mastery: 0, targetTaskCount: 30 },
];

export const TODAY_TIMEBLOCKS: TimeBlock[] = [
  {
    id: "tb-1",
    startTime: "06:30",
    endTime: "07:00",
    taskTitle: "Đọc 1 bài về TCP handshake",
    categoryId: "foundations",
    priority: "should",
    status: "done",
    kpiGoal: "Tóm tắt lại 3 bước bắt tay TCP bằng lời của mình",
    evidenceRequired: "Đoạn tóm tắt 3-5 câu",
    skillNodeId: "sk-3",
  },
  {
    id: "tb-2",
    startTime: "19:00",
    endTime: "20:30",
    taskTitle: "Cài đặt scheduler đơn giản trong C",
    categoryId: "low-level-systems",
    priority: "must",
    status: "active",
    kpiGoal: "Round-robin scheduler chạy được với 3 tiến trình giả lập",
    evidenceRequired: "Link commit GitHub",
    skillNodeId: "sk-4",
  },
  {
    id: "tb-3",
    startTime: "20:30",
    endTime: "21:00",
    taskTitle: "Luyện viết kỹ thuật tiếng Anh",
    categoryId: "career",
    priority: "should",
    status: "todo",
    kpiGoal: "Viết đoạn mô tả README dài 150 từ bằng tiếng Anh",
    evidenceRequired: "Đoạn văn bản đã viết",
    skillNodeId: "sk-11",
  },
  {
    id: "tb-4",
    startTime: "21:00",
    endTime: "21:20",
    taskTitle: "Đọc nhanh về block cipher mode",
    categoryId: "security",
    priority: "stretch",
    status: "todo",
    kpiGoal: "Giải thích khác biệt giữa ECB và CBC",
    evidenceRequired: "3 câu giải thích",
    skillNodeId: "sk-7",
  },
  {
    id: "tb-5",
    startTime: "13:00",
    endTime: "13:30",
    taskTitle: "Ôn tập cấu trúc dữ liệu: heap",
    categoryId: "programming",
    priority: "should",
    status: "missed",
    kpiGoal: "Giải 2 bài tập heap trên giấy",
    evidenceRequired: "Ảnh chụp bài giải",
    skillNodeId: "sk-10",
  },
];

export const KPI_SUMMARY: DailyKPISummary = {
  date: new Date().toISOString().slice(0, 10),
  totalTasks: TODAY_TIMEBLOCKS.length,
  mustTasksTotal: TODAY_TIMEBLOCKS.filter((t) => t.priority === "must").length,
  mustTasksDone: TODAY_TIMEBLOCKS.filter(
    (t) => t.priority === "must" && t.status === "done",
  ).length,
  doneCount: TODAY_TIMEBLOCKS.filter((t) => t.status === "done").length,
  partialCount: TODAY_TIMEBLOCKS.filter((t) => t.status === "partial").length,
  missedCount: TODAY_TIMEBLOCKS.filter((t) => t.status === "missed").length,
  streakDays: 4,
};
