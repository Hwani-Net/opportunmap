import type { Category } from "../../types/contest";
import { CATEGORY_LABEL } from "../../types/contest";
import { CATEGORY_COLORS } from "../../constants";

interface BadgeProps {
  category: Category;
  size?: "sm" | "md";
}

export default function Badge({ category, size = "sm" }: BadgeProps) {
  const colors = CATEGORY_COLORS[category];
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      }`}
      style={{ color: colors.main, backgroundColor: colors.bg }}
    >
      {CATEGORY_LABEL[category]}
    </span>
  );
}
