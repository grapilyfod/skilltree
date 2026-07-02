import type { CategoryColor, SkillNode } from "@/types";
import { getCategoryStyle } from "@/lib/style-maps";
import { getSkillTargetTaskCount } from "@/lib/skill-mastery";

interface SkillMasteryBarProps {
  node: SkillNode;
  categoryColor?: CategoryColor;
  onDelete?: (node: SkillNode) => void;
}

export function SkillMasteryBar({
  node,
  categoryColor,
  onDelete,
}: SkillMasteryBarProps) {
  const style = getCategoryStyle(node.categoryId, categoryColor);
  const mastery = Math.min(100, Math.max(0, node.mastery));
  const targetTaskCount = getSkillTargetTaskCount(node);
  const completedEquivalentTasks = Number((node.completedEquivalentTasks ?? 0).toFixed(1));

  return (
    <div className="group flex flex-col gap-1.5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-sm font-medium text-zinc-100">
            {node.name}
          </span>
          <p className="mt-0.5 font-mono text-[11px] text-zinc-500">
            {completedEquivalentTasks} / {targetTaskCount} tasks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`font-mono text-xs ${style.text}`}>
            {mastery}%
          </span>

          {onDelete && (
            <button
              type="button"
              title={`Xóa skill ${node.name}`}
              onClick={() => onDelete(node)}
              className="flex h-4 w-4 items-center justify-center rounded-full border border-red-500/20 text-[10px] font-bold text-red-300 opacity-0 transition hover:bg-red-500/10 group-hover:opacity-100"
            >
              −
            </button>
          )}
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={`h-full rounded-full ${style.bar} transition-all`}
          style={{ width: `${mastery}%` }}
        />
      </div>
    </div>
  );
}
