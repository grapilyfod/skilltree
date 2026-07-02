import type { SkillNode } from "@/types";
import { getCategoryStyle } from "@/lib/style-maps";

interface SkillMasteryBarProps {
  node: SkillNode;
}

const TICKS = [10, 20, 30, 40, 50, 60, 70, 80, 90];

export function SkillMasteryBar({ node }: SkillMasteryBarProps) {
  const style = getCategoryStyle(node.categoryId);
  const clamped = Math.min(100, Math.max(0, node.mastery));

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-zinc-200">{node.name}</span>
        <span className={`font-mono text-xs ${style.text}`}>{clamped}%</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={`h-full rounded-full ${style.bar} transition-[width] duration-500`}
          style={{ width: `${clamped}%` }}
        />
        <div className="pointer-events-none absolute inset-0">
          {TICKS.map((tick) => (
            <span
              key={tick}
              className="absolute top-0 h-full w-px bg-black/30"
              style={{ left: `${tick}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
