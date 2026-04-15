import { useMemo, useState, lazy, Suspense } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
const CalendarView = lazy(() => import("../components/calendar/CalendarView"));
import ListView from "../components/list/ListView";
import FilterBar from "../components/filters/FilterBar";
import ContestDetailModal from "../components/detail/ContestDetailModal";
import { useContests, filterContests } from "../hooks/useContests";
import { useFilters } from "../hooks/useFilters";
import { useBookmarks } from "../hooks/useBookmarks";
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
  const { bookmarks, toggle: toggleBookmark } = useBookmarks();
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const filtered = useMemo(
    () => filterContests(contests, filters),
    [contests, filters],
  );

  const displayed = useMemo(
    () =>
      showBookmarksOnly
        ? filtered.filter((c) => bookmarks.has(c.id))
        : filtered,
    [filtered, showBookmarksOnly, bookmarks],
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
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  const recentlyAdded = contests.filter((c) =>
    c.createdAt ? c.createdAt.toDate() >= sevenDaysAgo : false,
  ).length;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA]">
        <div className="text-center">
          <p className="text-[#6B7280] text-sm mb-4">
            데이터를 불러올 수 없습니다
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#3B5BDB" }}
          >
            다시 시도
          </button>
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

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 pb-20">
        {/* [PP-001] 가치 제안 문구 */}
        <div className="pt-6 pb-2">
          <h1
            className="text-2xl font-extrabold text-[#1A1A2E]"
            style={{ fontFamily: "'Plus Jakarta Sans'" }}
          >
            공모전·해커톤·지원금, 한 곳에서
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            마감일 놓치지 마세요.{" "}
            {activeCount > 0 ? `${activeCount}개 공고를` : "공고를"} 캘린더로
            한눈에.
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <div className="flex items-center gap-2">
            {/* [PP-045] 북마크 필터 버튼 */}
            <button
              onClick={() => setShowBookmarksOnly((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#3B5BDB] ${
                showBookmarksOnly
                  ? "bg-[#F59F00] text-white"
                  : "bg-white text-[#6B7280] hover:text-[#1A1A2E]"
              }`}
              style={
                showBookmarksOnly
                  ? {}
                  : { boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }
              }
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={showBookmarksOnly ? "white" : "none"}
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              북마크{bookmarks.size > 0 ? ` ${bookmarks.size}` : ""}
            </button>
          </div>

          <div
            className="flex bg-white rounded-xl p-1"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          >
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#3B5BDB] ${
                viewMode === "calendar"
                  ? "bg-[#1A1A2E] text-white"
                  : "text-[#6B7280] hover:text-[#1A1A2E]"
              }`}
            >
              캘린더
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#3B5BDB] ${
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
          contestCount={displayed.length}
        />

        {loading ? (
          viewMode === "list" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 animate-pulse"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                >
                  <div className="h-4 bg-[#F3F4F6] rounded mb-3 w-1/3" />
                  <div className="h-5 bg-[#F3F4F6] rounded mb-2 w-3/4" />
                  <div className="h-4 bg-[#F3F4F6] rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-24">
              <div className="w-6 h-6 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
            </div>
          )
        ) : viewMode === "calendar" ? (
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-24">
                <div className="w-6 h-6 border-2 border-[#3B5BDB] border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <CalendarView contests={displayed} onSelectContest={setDetailId} />
          </Suspense>
        ) : (
          <ListView
            contests={displayed}
            onSelectContest={setDetailId}
            bookmarks={bookmarks}
            onToggleBookmark={toggleBookmark}
          />
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-3 gap-3 md:gap-5 mt-10">
          <div
            className="bg-white rounded-2xl p-4 md:p-6"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          >
            <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">
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
            className="bg-white rounded-2xl p-4 md:p-6"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          >
            <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">
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
            className="bg-white rounded-2xl p-4 md:p-6"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
          >
            <p className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">
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

      <Footer />

      <ContestDetailModal
        key={selectedContest?.id ?? "closed"}
        contest={selectedContest}
        onClose={() => setDetailId(null)}
      />
    </div>
  );
}
