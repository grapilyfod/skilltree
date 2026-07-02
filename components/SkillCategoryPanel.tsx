import type { SkillCategory, SkillNode } from "@/types";
import { getCategoryStyle } from "@/lib/style-maps";
import { SkillMasteryBar } from "@/components/SkillMasteryBar";

interface SkillCategoryPanelProps {
  category: SkillCategory;
  nodes: SkillNode[];
}

export function SkillCategoryPanel({ category, nodes }: SkillCategoryPanelProps) {
  const style = getCategoryStyle(category.id);
  const avgMastery =
    nodes.length === 0
      ? 0
      : Math.round(nodes.reduce((sum, n) => sum + n.mastery, 0) / nodes.length);

  return (
    <section className="rounded-lg border border-white/[0.06] bg-[#101216] p-4">
      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className={`text-sm font-medium ${style.text}`}>{category.label}</h2>
          <p className="mt-0.5 text-xs text-zinc-500">{category.description}</p>
        </div>
        <span className="shrink-0 font-mono text-xs text-zinc-400">{avgMastery}% avg</span>
      </header>

      <div className="flex flex-col gap-3">
        {nodes.map((node) => (
          <SkillMasteryBar key={node.id} node={node} />
        ))}
      </div>
    </section>
  );
}
