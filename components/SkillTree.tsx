import type { SkillCategory, SkillNode } from "@/types";
import { SkillCategoryPanel } from "@/components/SkillCategoryPanel";
import { SKILL_CATEGORIES, SKILL_NODES } from "@/lib/mock-data";

interface SkillTreeProps {
  categories?: SkillCategory[];
  nodes?: SkillNode[];
  onDeleteCategory?: (category: SkillCategory) => void;
  onDeleteSkill?: (node: SkillNode) => void;
}

export function SkillTree({
  categories = SKILL_CATEGORIES,
  nodes = SKILL_NODES,
  onDeleteCategory,
  onDeleteSkill,
}: SkillTreeProps) {
  const displayCategories = categories.length > 0 ? categories : SKILL_CATEGORIES;
  const displayNodes = nodes.length > 0 ? nodes : SKILL_NODES;

  return (
    <div className="flex flex-col gap-3">
      {displayCategories.map((category) => (
        <SkillCategoryPanel
          key={category.id}
          category={category}
          nodes={displayNodes.filter((node) => node.categoryId === category.id)}
          onDeleteCategory={onDeleteCategory}
          onDeleteSkill={onDeleteSkill}
        />
      ))}
    </div>
  );
}