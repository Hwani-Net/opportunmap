import { useMemo } from "react";
import Header from "../components/layout/Header";
import CalendarView from "../components/calendar/CalendarView";
import ListView from "../components/list/ListView";
import FilterBar from "../components/filters/FilterBar";
import ContestDetailModal from "../components/detail/ContestDetailModal";
import { useContests, filterContests } from "../hooks/useContests";
import { useFilters } from "../hooks/useFilters";
import { getContestById } from "../lib/firestore";

export default function HomePage() {
  const { contests, loading, error } = useContests();
  const {
    filters,
    updateFilters,
    viewMode,
    setViewMode,
    detailId,
    setDetailId,
  } = useFilters();

  const filtered = useMemo(
    () => filterContests(contests, filters),
    [contests, filters],
  );
  const selectedContest = detailId
    ? (getContestById(contests, detailId) ?? null)
    : null;

  // Stats
  const now = new Date();
  const activeCount = contests.filter(
    (c) => c.applicationEnd.toDate() >= now,
  ).length;
  const thisWeekEnd = new Date(now);
  thisWeekEnd.setDate(now.getDate() + 7);
  const weekDeadlines = contests.filter((c) => {
    const d = c.applicationEnd.toDate();
    return d >= now && d <= thisWeekEnd;
  }).length;
  const recentlyAdded = contests.length > 7 ? 7 : contests.length;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
        <div className="text-center">
          <p className="text-3xl mb-3">⚠️</p>
          <p className="text-[#6B7280] text-sm">데이터를 불러올 수 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Header
        searchValue={filters.search}
        onSearchChange={(search) => updateFilters({ search })}
      />

      <main className="max-w-[1400px] mx-auto px-8 pb-20">
        {/* View toggle */}
        <div className="flex items-center justify-end mb-6 pt-2">
          <div
            className="flex bg-white rounded-xl p-1"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          >
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                viewMode === "calendar"
                  ? "bg-[#1A1A2E] text-white"
                  : "text-[#6B7280] hover:text-[#1A1A2E]"
              }`}
            >
              캘린더
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-[#1A1A2E] text-white"
                  : "text-[#6B7280] hover:text-[#1A1A2E]"
              }`}
            >
              리스트
            </button>
          </div>
        </div>

        <FilterBar
          filters={filters}
          onUpdate={updateFilters}
          contestCount={filtered.length}
        />

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : viewMode === "calendar" ? (
          <CalendarView contests={filtered} onSelectContest={setDetailId} />
        ) : (
          <ListView contests={filtered} onSelectContest={setDetailId} />
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-3 gap-5 mt-10">
          <div
            className="bg-white rounded-2xl p-6"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          >
            <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">
              진행 중
            </p>
            <p
              className="text-2xl font-extrabold text-[#1A1A2E]"
              style={{ fontFamily: "'Plus Jakarta Sans'" }}
            >
              {activeCount}건
            </p>
          </div>
          <div
            className="bg-white rounded-2xl p-6"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          >
            <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">
              이번 주 마감
            </p>
            <p
              className="text-2xl font-extrabold text-[#E03131]"
              style={{ fontFamily: "'Plus Jakarta Sans'" }}
            >
              {weekDeadlines}건
            </p>
          </div>
          <div
            className="bg-white rounded-2xl p-6"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          >
            <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">
              새로 등록
            </p>
            <p
              className="text-2xl font-extrabold text-[#0CA678]"
              style={{ fontFamily: "'Plus Jakarta Sans'" }}
            >
              {recentlyAdded}건
            </p>
          </div>
        </div>
      </main>

      <ContestDetailModal
        contest={selectedContest}
        onClose={() => setDetailId(null)}
      />
    </div>
  );
}
