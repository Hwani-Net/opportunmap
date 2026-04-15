import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useContests } from "../hooks/useContests";
import { deleteContest } from "../lib/firestore";
import { CATEGORY_LABEL } from "../types/contest";
import type { Contest } from "../types/contest";
import ContestForm from "../components/admin/ContestForm";

export default function AdminPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const { contests, loading: contestsLoading } = useContests();
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Contest | undefined>(undefined);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <p className="text-gray-400 text-sm">인증 확인 중...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div
          className="bg-white rounded-2xl px-8 py-10 text-center"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
        >
          <p
            className="text-xl mb-2"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              color: "#1A1A2E",
            }}
          >
            접근 권한이 없습니다
          </p>
          <p className="text-sm text-gray-400">
            관리자 계정으로 로그인해주세요.
          </p>
        </div>
      </div>
    );
  }

  const handleDelete = async (contest: Contest) => {
    if (!window.confirm(`"${contest.title}" 공고를 정말 삭제하시겠습니까?`))
      return;
    try {
      await deleteContest(contest.id);
    } catch (err) {
      alert("삭제 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  const openAdd = () => {
    setEditTarget(undefined);
    setShowForm(true);
  };

  const openEdit = (contest: Contest) => {
    setEditTarget(contest);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditTarget(undefined);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-2xl"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              color: "#1A1A2E",
            }}
          >
            관리자 대시보드
          </h1>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#3B5BDB" }}
          >
            <span className="text-lg leading-none">+</span>
            공고 추가
          </button>
        </div>

        {/* 공고 목록 */}
        <div
          className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
        >
          {contestsLoading ? (
            <div className="px-6 py-10 text-center text-gray-400 text-sm">
              불러오는 중...
            </div>
          ) : contests.length === 0 ? (
            <div className="px-6 py-10 text-center text-gray-400 text-sm">
              등록된 공고가 없습니다.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 w-16">
                    카테고리
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400">
                    제목
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 w-28">
                    주최
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 w-28">
                    마감일
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 w-16">
                    상태
                  </th>
                  <th className="px-5 py-3 w-24" />
                </tr>
              </thead>
              <tbody>
                {contests.map((contest) => {
                  const endDate = contest.applicationEnd?.toDate?.();
                  const endStr = endDate
                    ? endDate.toLocaleDateString("ko-KR", {
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : "-";
                  return (
                    <tr
                      key={contest.id}
                      className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <span className="text-xs font-semibold text-gray-500">
                          {CATEGORY_LABEL[contest.category] ?? contest.category}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-medium text-[#1A1A2E] max-w-xs truncate">
                        {contest.title}
                      </td>
                      <td className="px-5 py-3 text-gray-500 truncate">
                        {contest.organizer}
                      </td>
                      <td className="px-5 py-3 text-gray-500">{endStr}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            contest.isActive
                              ? "bg-green-50 text-green-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {contest.isActive ? "활성" : "비활성"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => openEdit(contest)}
                            className="text-xs font-semibold text-[#3B5BDB] hover:underline"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDelete(contest)}
                            className="text-xs font-semibold text-red-400 hover:text-red-600 hover:underline"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-4 text-right">
          총 {contests.length}건
        </p>
      </div>

      {showForm && (
        <ContestForm
          editContest={editTarget}
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
