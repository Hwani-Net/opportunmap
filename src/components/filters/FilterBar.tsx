import type { FilterState } from "../../hooks/useContests";
import type { Category } from "../../types/contest";
import { CATEGORY_COLORS } from "../../constants";
import { CATEGORY_LABEL } from "../../types/contest";
import { FIELD_OPTIONS, TARGET_OPTIONS, REGION_OPTIONS } from "../../constants";
import { DEFAULT_FILTERS } from "../../hooks/useContests";

export type SortBy = "deadline" | "newest" | "prize";

interface FilterBarProps {
  filters: FilterState;
  sortBy: SortBy;
  onUpdate: (updates: Partial<FilterState>) => void;
  onSortChange: (sort: SortBy) => void;
  contestCount: number;
}

const ALL_CATEGORIES: Category[] = ["contest", "hackathon", "startup", "grant"];

export default function FilterBar({
  filters,
  sortBy,
  onUpdate,
  onSortChange,
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

  // 활성 필터 태그 목록
  const activeTags: { label: string; onRemove: () => void }[] = [];
  if (filters.field)
    activeTags.push({
      label: `분야: ${filters.field}`,
      onRemove: () => onUpdate({ field: "" }),
    });
  if (filters.target)
    activeTags.push({
      label: `대상: ${filters.target}`,
      onRemove: () => onUpdate({ target: "" }),
    });
  if (filters.region)
    activeTags.push({
      label: `지역: ${filters.region}`,
      onRemove: () => onUpdate({ region: "" }),
    });

  return (
    <div className="flex flex-col gap-3 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* 카테고리 버튼 + 스크롤 힌트 */}
        <div className="relative flex items-center gap-2.5">
          <div className="flex items-center gap-2.5 overflow-x-auto flex-nowrap pb-1">
            {ALL_CATEGORIES.map((cat) => {
              const isActive = filters.categories.has(cat);
              const colors = CATEGORY_COLORS[cat];
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  aria-pressed={isActive}
                  className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-150 shrink-0"
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
            <span className="text-xs text-[#9CA3AF] ml-2 font-medium shrink-0">
              {contestCount}건
            </span>
          </div>
          {/* 스크롤 힌트 그라데이션 */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-[#F7F8FA]" />
        </div>

        {/* 우측 필터 컨트롤 */}
        <div className="flex items-center gap-2 flex-wrap">
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

          {/* 정렬 드롭다운 (D2) */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortBy)}
            aria-label="정렬"
            className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-[#1A1A2E] border-none cursor-pointer outline-none focus:ring-2 focus:ring-[#3B5BDB]"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          >
            <option value="deadline">마감 임박순</option>
            <option value="newest">최신 등록순</option>
            <option value="prize">상금 높은순</option>
          </select>

          <label className="flex items-center gap-2 ml-2 text-sm text-[#6B7280] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.showPast}
              onChange={(e) => onUpdate({ showPast: e.target.checked })}
              className="rounded"
            />
            마감된 공고 보기
          </label>

          {/* 초기화 버튼 항상 표시 (B4) */}
          <button
            onClick={resetFilters}
            disabled={!isFiltered}
            aria-label="필터 초기화"
            className={`ml-1 text-xs transition-colors underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-[#3B5BDB] rounded px-1 ${
              isFiltered
                ? "text-[#6B7280] hover:text-[#E03131]"
                : "text-[#9CA3AF] opacity-40 cursor-not-allowed"
            }`}
          >
            초기화
          </button>
        </div>
      </div>

      {/* 활성 필터 태그 (D3) */}
      {activeTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeTags.map((tag) => (
            <span
              key={tag.label}
              className="flex items-center gap-1 px-2.5 py-1 bg-[#EEF2FF] text-[#3B5BDB] text-xs font-medium rounded-full"
            >
              {tag.label}
              <button
                onClick={tag.onRemove}
                aria-label={`${tag.label} 필터 제거`}
                className="hover:text-[#1A1A2E] transition-colors ml-0.5"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
