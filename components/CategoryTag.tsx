import type { SkillCategory, SkillCategoryId } from "@/types";
import { getCategoryStyle } from "@/lib/style-maps";

interface CategoryTagProps {
  categoryId: SkillCategoryId;
  /** Current category list used to resolve label and color. */
  categories: SkillCategory[];
}

export function CategoryTag({ categoryId, categories }: CategoryTagProps) {
  const category = categories.find((c) => c.id === categoryId);
  const style = getCategoryStyle(categoryId, category?.color);

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold ${style.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {category?.label ?? categoryId}
    </span>
  );
}