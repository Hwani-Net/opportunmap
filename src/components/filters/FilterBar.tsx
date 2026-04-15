import type { FilterState } from "../../hooks/useContests";
import type { Category } from "../../types/contest";
import { CATEGORY_COLORS } from "../../constants";
import { CATEGORY_LABEL } from "../../types/contest";
import { FIELD_OPTIONS, TARGET_OPTIONS, REGION_OPTIONS } from "../../constants";
import { DEFAULT_FILTERS } from "../../hooks/useContests";

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
  const isFiltered =
    filters.field !== "" ||
    filters.target !== "" ||
    filters.region !== "" ||
    filters.search !== "" ||
    filters.showPast ||
    filters.categories.size < 4;

  const resetFilters = () => onUpdate({ ...DEFAULT_FILTERS });

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
        {isFiltered && (
          <button
            onClick={resetFilters}
            aria-label="필터 초기화"
            className="ml-1 text-xs text-[#6B7280] hover:text-[#E03131] transition-colors underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-[#3B5BDB] rounded px-1"
          >
            초기화
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <select
          value={filters.field}
          onChange={(e) => onUpdate({ field: e.target.value })}
          aria-label="분야 필터"
          className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-[#1A1A2E] border-none cursor-pointer outline-none focus:ring-2 focus:ring-[#3B5BDB]"
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
          aria-label="대상 필터"
          className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-[#1A1A2E] border-none cursor-pointer outline-none focus:ring-2 focus:ring-[#3B5BDB]"
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
          aria-label="지역 필터"
          className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-[#1A1A2E] border-none cursor-pointer outline-none focus:ring-2 focus:ring-[#3B5BDB]"
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
