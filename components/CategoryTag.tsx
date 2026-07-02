import type { SkillCategory, SkillCategoryId } from "@/types";
import { getCategoryStyle } from "@/lib/style-maps";

interface CategoryTagProps {
  categoryId: SkillCategoryId;
  /** Current category list (built-in + custom) used to resolve the display label. */
  categories: SkillCategory[];
}

export function CategoryTag({ categoryId, categories }: CategoryTagProps) {
  const style = getCategoryStyle(categoryId);
  const category = categories.find((c) => c.id === categoryId);

  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono ${style.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {category?.label ?? categoryId}
    </span>
  );
}
