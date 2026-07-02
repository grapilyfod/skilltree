import type { CategoryColor, SkillNode } from "@/types";
import { getCategoryStyle } from "@/lib/style-maps";

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

  return (
    <div className="group flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-zinc-100">
          {node.name}
        </span>

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