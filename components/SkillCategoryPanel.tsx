import type { SkillCategory, SkillNode } from "@/types";
import { getCategoryStyle } from "@/lib/style-maps";
import { SkillMasteryBar } from "@/components/SkillMasteryBar";

interface SkillCategoryPanelProps {
  category: SkillCategory;
  nodes: SkillNode[];
  onDeleteCategory?: (category: SkillCategory) => void;
  onDeleteSkill?: (node: SkillNode) => void;
}

export function SkillCategoryPanel({
  category,
  nodes,
  onDeleteCategory,
  onDeleteSkill,
}: SkillCategoryPanelProps) {
  const style = getCategoryStyle(category.id, category.color);

  const avgMastery =
    nodes.length === 0
      ? 0
      : Math.round(nodes.reduce((sum, node) => sum + node.mastery, 0) / nodes.length);

  return (
    <section className="group rounded-lg border border-white/[0.06] bg-[#101216] p-4">
      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className={`text-sm font-medium ${style.text}`}>
            {category.label}
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            {category.description}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="font-mono text-xs text-zinc-400">
            {avgMastery}% avg
          </span>

          {onDeleteCategory && (
            <button
              type="button"
              title={`Xóa category ${category.label}`}
              onClick={() => onDeleteCategory(category)}
              className="flex h-5 w-5 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 text-xs font-bold text-red-300 opacity-100 transition hover:border-red-400/40 hover:bg-red-500/20 hover:text-red-200 [@media(hover:hover)_and_(pointer:fine)]:opacity-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100"
            >
              −
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-col gap-3">
        {nodes.map((node) => (
          <SkillMasteryBar
            key={node.id}
            node={node}
            categoryColor={category.color}
            onDelete={onDeleteSkill}
          />
        ))}
      </div>
    </section>
  );
}