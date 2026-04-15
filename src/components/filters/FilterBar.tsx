import type { FilterState } from "../../hooks/useContests";
import type { Category } from "../../types/contest";
import { CATEGORY_COLORS } from "../../constants";
import { CATEGORY_LABEL } from "../../types/contest";
import { FIELD_OPTIONS, TARGET_OPTIONS, REGION_OPTIONS } from "../../constants";

interface FilterBarProps {
  filters: FilterState;
  onUpdate: (updates: Partial<FilterState>) => void;
  contestCount: number;
}

const ALL_CATEGORIES: Category[] = ["contest", "hackathon", "startup", "grant"];

export default function FilterBar({
  filters,
  onUpdate,
  contestCount,
}: FilterBarProps) {
  const toggleCategory = (cat: Category) => {
    const next = new Set(filters.categories);
    if (next.has(cat)) {
      if (next.size > 1) next.delete(cat);
    } else {
      next.add(cat);
    }
    onUpdate({ categories: next });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-2.5">
        {ALL_CATEGORIES.map((cat) => {
          const isActive = filters.categories.has(cat);
          const colors = CATEGORY_COLORS[cat];
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-150"
              style={
                isActive
                  ? { background: colors.main, color: "#fff" }
                  : {
                      background: "transparent",
                      color: colors.main,
                      border: `1.5px solid ${colors.main}30`,
                    }
              }
            >
              {CATEGORY_LABEL[cat]}
            </button>
          );
        })}
        <span className="text-xs text-[#9CA3AF] ml-2 font-medium">
          {contestCount}건
        </span>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={filters.field}
          onChange={(e) => onUpdate({ field: e.target.value })}
          className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-[#1A1A2E] border-none cursor-pointer outline-none"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
        >
          <option value="">분야</option>
          {FIELD_OPTIONS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <select
          value={filters.target}
          onChange={(e) => onUpdate({ target: e.target.value })}
          className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-[#1A1A2E] border-none cursor-pointer outline-none"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
        >
          <option value="">대상</option>
          {TARGET_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={filters.region}
          onChange={(e) => onUpdate({ region: e.target.value })}
          className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-[#1A1A2E] border-none cursor-pointer outline-none"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
        >
          <option value="">지역</option>
          {REGION_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 ml-2 text-sm text-[#6B7280] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.showPast}
            onChange={(e) => onUpdate({ showPast: e.target.checked })}
            className="rounded"
          />
          마감 포함
        </label>
      </div>
    </div>
  );
}
