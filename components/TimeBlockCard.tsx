import type { SkillCategory, SkillNode, TaskStatus, TimeBlock } from "@/types";
import { getCategoryStyle, PRIORITY_STYLES } from "@/lib/style-maps";
import { resolveSkillNodeId } from "@/lib/skill-mastery";
import { CategoryTag } from "@/components/CategoryTag";
import { StatusBadge } from "@/components/StatusBadge";

interface TimeBlockCardProps {
  block: TimeBlock;
  /** True when the current wall-clock time falls inside this block's window. */
  isNow: boolean;
  /** Current skill categories, built-in + custom. */
  categories: SkillCategory[];
  /** Current skill node definitions, built-in + custom. */
  skillNodes: SkillNode[];
  /** Callback fired when user clicks status button; receives blockId and new status. */
  onStatusChange?: (blockId: string, newStatus: TaskStatus) => void;
  /** Callback fired when user clicks Edit button. */
  onEdit?: (block: TimeBlock) => void;
  /** Callback fired when user clicks Delete button. */
  onDelete?: (blockId: string) => void;
}

function getSafeEvidenceUrl(value?: string): string | null {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(normalized);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

export function TimeBlockCard({
  block,
  isNow,
  categories,
  skillNodes,
  onStatusChange,
  onEdit,
  onDelete,
}: TimeBlockCardProps) {
  const categoryStyle = getCategoryStyle(block.categoryId);
  const skillNodeId = resolveSkillNodeId(block, skillNodes);
  const skillNode = skillNodes.find((node) => node.id === skillNodeId);
  const priorityStyle = PRIORITY_STYLES[block.priority];
  const evidenceLink = getSafeEvidenceUrl(block.evidenceLink);
  const hasEvidenceDetails = Boolean(
    block.evidenceNote?.trim() || block.evidenceLink?.trim() || block.reflection?.trim(),
  );

  return (
    <li
      className={`group relative rounded-lg border bg-[#101216] p-4 transition-colors ${
        isNow ? `${categoryStyle.border} bg-[#14171d]` : "border-white/[0.06]"
      }`}
    >
      {isNow && (
        <span
          className={`absolute -left-px bottom-4 top-4 w-0.5 rounded-full opacity-70 ${categoryStyle.dot}`}
        />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-zinc-500">
            <span>{block.startTime}</span>
            <span className="text-zinc-700">→</span>
            <span>{block.endTime}</span>

            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}
            >
              {priorityStyle.label}
            </span>

            {isNow && (
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-white">
                NOW
              </span>
            )}
          </div>

          <h3 className="text-sm font-medium text-zinc-100">
            {block.taskTitle}
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <CategoryTag categoryId={block.categoryId} categories={categories} />

            {skillNode && (
              <span className="rounded bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
                Skill: {skillNode.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-start gap-2">
          <StatusBadge status={block.status} />

          {(onEdit || onDelete) && (
            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(block)}
                  className="rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-500 hover:bg-white/10 hover:text-zinc-300"
                  title="Sửa"
                >
                  ✎
                </button>
              )}

              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(block.id)}
                  className="rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                  title="Xóa"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-1 gap-1.5 border-t border-white/[0.06] pt-3 text-xs text-zinc-400 sm:grid-cols-2">
        <div>
          <dt className="text-zinc-600">KPI</dt>
          <dd>{block.kpiGoal}</dd>
        </div>

        <div>
          <dt className="text-zinc-600">Yêu cầu bằng chứng</dt>
          <dd>{block.evidenceRequired}</dd>
        </div>
      </dl>

      {hasEvidenceDetails && (
        <div className="mt-3 grid grid-cols-1 gap-2 border-t border-white/[0.06] pt-3 text-xs sm:grid-cols-2">
          {block.evidenceNote?.trim() && (
            <div className="rounded border border-emerald-500/20 bg-emerald-500/5 p-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                Evidence note
              </p>
              <p className="mt-1 whitespace-pre-wrap text-zinc-300">
                {block.evidenceNote}
              </p>
            </div>
          )}

          {block.evidenceLink?.trim() && (
            <div className="rounded border border-sky-500/20 bg-sky-500/5 p-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-sky-300">
                Link bằng chứng
              </p>
              {evidenceLink ? (
                <a
                  href={evidenceLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex max-w-full truncate text-sky-200 underline-offset-2 hover:underline"
                >
                  Mở link bằng chứng
                </a>
              ) : (
                <p className="mt-1 break-all text-zinc-300">{block.evidenceLink}</p>
              )}
            </div>
          )}

          {block.reflection?.trim() && (
            <div className="rounded border border-violet-500/20 bg-violet-500/5 p-2 sm:col-span-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-300">
                Reflection
              </p>
              <p className="mt-1 whitespace-pre-wrap text-zinc-300">
                {block.reflection}
              </p>
            </div>
          )}
        </div>
      )}

      {onStatusChange && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-white/[0.06] pt-3">
          <button
            type="button"
            onClick={() => onStatusChange(block.id, "done")}
            className={`flex-1 rounded px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${
              block.status === "done"
                ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/50"
                : "bg-white/5 text-zinc-400 hover:bg-white/10"
            }`}
          >
            ✓ Đạt
          </button>

          <button
            type="button"
            onClick={() => onStatusChange(block.id, "partial")}
            className={`flex-1 rounded px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${
              block.status === "partial"
                ? "bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/50"
                : "bg-white/5 text-zinc-400 hover:bg-white/10"
            }`}
          >
            ◐ Một phần
          </button>

          <button
            type="button"
            onClick={() => onStatusChange(block.id, "missed")}
            className={`flex-1 rounded px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${
              block.status === "missed"
                ? "bg-red-500/20 text-red-300 ring-1 ring-red-500/50"
                : "bg-white/5 text-zinc-400 hover:bg-white/10"
            }`}
          >
            ✗ Không đạt
          </button>
        </div>
      )}
    </li>
  );
}
