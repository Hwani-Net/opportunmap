import { useState } from "react";
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

type PillGroupProps<T extends string> = {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
};

function PillGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: PillGroupProps<T>) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-[#6B7280] w-16 shrink-0">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() =>
              onChange(opt.value === value ? ("" as T) : opt.value)
            }
            aria-pressed={value === opt.value}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-150 border ${
              value === opt.value
                ? "bg-[#3B5BDB] text-white border-[#3B5BDB]"
                : "bg-white text-[#4B5563] border-[#E5E7EB] hover:border-[#3B5BDB] hover:text-[#3B5BDB]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const PRIZE_OPTIONS: { value: FilterState["prizeRange"]; label: string }[] = [
  { value: "", label: "전체" },
  { value: "under50", label: "50만원 이하" },
  { value: "50to200", label: "50-200만원" },
  { value: "200to500", label: "200-500만원" },
  { value: "over500", label: "500만원 이상" },
];

const DEADLINE_OPTIONS: { value: FilterState["deadline"]; label: string }[] = [
  { value: "", label: "전체" },
  { value: "thisWeek", label: "이번 주 마감" },
  { value: "thisMonth", label: "이번 달 마감" },
  { value: "3months", label: "3개월 이내" },
];

const APPLY_STATUS_OPTIONS: {
  value: FilterState["applyStatus"];
  label: string;
}[] = [
  { value: "", label: "전체" },
  { value: "open", label: "접수 중" },
  { value: "upcoming", label: "접수 예정" },
  { value: "closing7", label: "마감 임박(7일)" },
];

const AGE_GROUP_OPTIONS: {
  value: FilterState["ageGroup"];
  label: string;
}[] = [
  { value: "", label: "전체" },
  { value: "youth", label: "청소년(~19세)" },
  { value: "young", label: "청년(19-39세)" },
  { value: "college", label: "대학(원)생" },
  { value: "senior", label: "중장년(40+)" },
  { value: "open", label: "제한없음" },
];

const EXCLUDE_TARGET_OPTIONS: { value: string; label: string }[] = [
  { value: "youth_excl", label: "청소년 전용 제외" },
  { value: "college_excl", label: "대학생 전용 제외" },
  { value: "young_excl", label: "청년(39세 이하) 전용 제외" },
];

const ORGANIZER_TYPE_OPTIONS: {
  value: FilterState["organizerType"];
  label: string;
}[] = [
  { value: "", label: "전체" },
  { value: "gov", label: "정부·공공기관" },
  { value: "corp", label: "기업·민간" },
  { value: "edu", label: "대학·학교" },
  { value: "foundation", label: "재단·협회" },
];

const TEAM_TYPE_OPTIONS: {
  value: FilterState["teamType"];
  label: string;
}[] = [
  { value: "", label: "전체" },
  { value: "solo", label: "개인 참가" },
  { value: "team", label: "팀 참가" },
  { value: "both", label: "개인·팀 모두" },
];

export default function FilterBar({
  filters,
  sortBy,
  onUpdate,
  onSortChange,
  contestCount,
}: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const activeAdvancedCount =
    [
      filters.prizeRange,
      filters.deadline,
      filters.applyStatus,
      filters.ageGroup,
      filters.organizerType,
      filters.teamType,
    ].filter(Boolean).length + (filters.excludeTargets.length > 0 ? 1 : 0);

  const isFiltered =
    filters.field !== "" ||
    filters.target !== "" ||
    filters.region !== "" ||
    filters.search !== "" ||
    filters.showPast ||
    filters.categories.size < 4 ||
    activeAdvancedCount > 0;

  const resetFilters = () => {
    onUpdate({ ...DEFAULT_FILTERS });
    setShowAdvanced(false);
  };

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
  if (filters.prizeRange) {
    const opt = PRIZE_OPTIONS.find((o) => o.value === filters.prizeRange);
    if (opt)
      activeTags.push({
        label: `상금: ${opt.label}`,
        onRemove: () => onUpdate({ prizeRange: "" }),
      });
  }
  if (filters.deadline) {
    const opt = DEADLINE_OPTIONS.find((o) => o.value === filters.deadline);
    if (opt)
      activeTags.push({
        label: `마감: ${opt.label}`,
        onRemove: () => onUpdate({ deadline: "" }),
      });
  }
  if (filters.applyStatus) {
    const opt = APPLY_STATUS_OPTIONS.find(
      (o) => o.value === filters.applyStatus,
    );
    if (opt)
      activeTags.push({
        label: `접수: ${opt.label}`,
        onRemove: () => onUpdate({ applyStatus: "" }),
      });
  }
  if (filters.ageGroup) {
    const opt = AGE_GROUP_OPTIONS.find((o) => o.value === filters.ageGroup);
    if (opt)
      activeTags.push({
        label: `연령: ${opt.label}`,
        onRemove: () => onUpdate({ ageGroup: "" }),
      });
  }
  if (filters.organizerType) {
    const opt = ORGANIZER_TYPE_OPTIONS.find(
      (o) => o.value === filters.organizerType,
    );
    if (opt)
      activeTags.push({
        label: `주최: ${opt.label}`,
        onRemove: () => onUpdate({ organizerType: "" }),
      });
  }
  if (filters.teamType) {
    const opt = TEAM_TYPE_OPTIONS.find((o) => o.value === filters.teamType);
    if (opt)
      activeTags.push({
        label: `참가: ${opt.label}`,
        onRemove: () => onUpdate({ teamType: "" }),
      });
  }
  if (filters.excludeTargets.length > 0) {
    activeTags.push({
      label: `제외: ${filters.excludeTargets.map((v) => EXCLUDE_TARGET_OPTIONS.find((o) => o.value === v)?.label ?? v).join(", ")}`,
      onRemove: () => onUpdate({ excludeTargets: [] }),
    });
  }

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

          {/* 정렬 드롭다운 */}
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

          {/* 더보기 필터 토글 */}
          <button
            onClick={() => setShowAdvanced((v) => !v)}
            aria-expanded={showAdvanced}
            aria-controls="advanced-filter-panel"
            className={`ml-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border ${
              showAdvanced || activeAdvancedCount > 0
                ? "bg-[#EEF2FF] text-[#3B5BDB] border-[#C5D0F5]"
                : "bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#3B5BDB] hover:text-[#3B5BDB]"
            }`}
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          >
            더 많은 필터
            {activeAdvancedCount > 0 ? ` (${activeAdvancedCount})` : ""}{" "}
            {showAdvanced ? "▲" : "▼"}
          </button>

          {/* 초기화 버튼 항상 표시 */}
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

      {/* 세부 필터 펼침 패널 */}
      {showAdvanced && (
        <div
          id="advanced-filter-panel"
          role="region"
          aria-label="세부 필터"
          className="rounded-xl border border-[#E5E7EB] bg-white px-5 py-4 space-y-3"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
        >
          <PillGroup
            label="상금 범위"
            options={PRIZE_OPTIONS}
            value={filters.prizeRange}
            onChange={(v) => onUpdate({ prizeRange: v })}
          />
          <div className="border-t border-[#F3F4F6]" />
          <PillGroup
            label="마감 기간"
            options={DEADLINE_OPTIONS}
            value={filters.deadline}
            onChange={(v) => onUpdate({ deadline: v })}
          />
          <div className="border-t border-[#F3F4F6]" />
          <PillGroup
            label="접수 상태"
            options={APPLY_STATUS_OPTIONS}
            value={filters.applyStatus}
            onChange={(v) => onUpdate({ applyStatus: v })}
          />
          <div className="border-t border-[#F3F4F6]" />
          <PillGroup
            label="나이/연령"
            options={AGE_GROUP_OPTIONS}
            value={filters.ageGroup}
            onChange={(v) => onUpdate({ ageGroup: v })}
          />
          <div className="border-t border-[#F3F4F6]" />
          <div className="flex flex-wrap items-start gap-2 pl-0">
            <span className="text-xs font-semibold text-[#6B7280] w-16 shrink-0 pt-0.5">
              제외 대상
            </span>
            <div className="flex flex-wrap gap-3">
              {EXCLUDE_TARGET_OPTIONS.map((opt) => {
                const checked = filters.excludeTargets.includes(opt.value);
                return (
                  <label
                    key={opt.value}
                    htmlFor={`excl-${opt.value}`}
                    className="flex items-center gap-2 text-sm cursor-pointer text-[#4B5563] hover:text-[#1A1A2E] select-none"
                  >
                    <input
                      id={`excl-${opt.value}`}
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        const next = checked
                          ? filters.excludeTargets.filter(
                              (v) => v !== opt.value,
                            )
                          : [...filters.excludeTargets, opt.value];
                        onUpdate({ excludeTargets: next });
                      }}
                      className="rounded accent-[#3B5BDB]"
                    />
                    {opt.label}
                  </label>
                );
              })}
            </div>
          </div>
          <div className="border-t border-[#F3F4F6]" />
          <PillGroup
            label="주최기관"
            options={ORGANIZER_TYPE_OPTIONS}
            value={filters.organizerType}
            onChange={(v) => onUpdate({ organizerType: v })}
          />
          <div className="border-t border-[#F3F4F6]" />
          <PillGroup
            label="참가 형태"
            options={TEAM_TYPE_OPTIONS}
            value={filters.teamType}
            onChange={(v) => onUpdate({ teamType: v })}
          />
        </div>
      )}

      {/* 활성 필터 태그 */}
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
                className="hover:text-[#1A1A2E] transition-colors ml-0.5 p-1 -m-1"
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
