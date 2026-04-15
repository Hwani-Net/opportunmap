import { useEffect, useState } from "react";
import type { Contest } from "../../types/contest";
import { CATEGORY_LABEL } from "../../types/contest";
import { CATEGORY_COLORS } from "../../constants";

interface ContestDetailModalProps {
  contest: Contest | null;
  onClose: () => void;
}

export default function ContestDetailModal({
  contest,
  onClose,
}: ContestDetailModalProps) {
  const [checked, setChecked] = useState<boolean[]>(() => {
    if (!contest) return [];
    const saved = localStorage.getItem(`checklist-${contest.id}`);
    return saved
      ? JSON.parse(saved)
      : new Array(contest.checklist.length).fill(false);
  });

  useEffect(() => {
    if (!contest) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    document.body.classList.add("detail-modal-open");
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
      document.body.classList.remove("detail-modal-open");
    };
  }, [contest, onClose]);

  if (!contest) return null;

  const colors = CATEGORY_COLORS[contest.category];
  const start = contest.applicationStart.toDate();
  const end = contest.applicationEnd.toDate();
  const fmt = (d: Date) =>
    d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const toggleCheck = (i: number) => {
    const next = checked.map((v, idx) => (idx === i ? !v : v));
    setChecked(next);
    localStorage.setItem(`checklist-${contest.id}`, JSON.stringify(next));
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
        style={{ boxShadow: "0 24px 48px rgba(0,0,0,0.12)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Color accent bar at top */}
        <div className="h-1 w-full" style={{ background: colors.main }} />

        <div className="px-7 pt-6 pb-2 flex items-start justify-between">
          <div>
            <span
              className="text-[11px] font-bold uppercase tracking-wider"
              style={{ color: colors.main }}
            >
              {CATEGORY_LABEL[contest.category]}
            </span>
            <h2
              className="text-xl mt-1"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                color: "#1A1A2E",
              }}
            >
              {contest.title}
            </h2>
            <p className="text-sm text-[#6B7280] mt-1">{contest.organizer}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="text-[#9CA3AF] hover:text-[#1A1A2E] transition-colors p-1 shrink-0 focus:outline-none focus:ring-2 focus:ring-[#3B5BDB] rounded"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-7 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#F7F8FA] rounded-xl p-3.5">
              <p className="text-[11px] text-[#6B7280] font-medium mb-1">
                접수 기간
              </p>
              <p className="text-sm font-semibold text-[#1A1A2E]">
                {fmt(start)}
              </p>
              <p className="text-sm font-semibold text-[#1A1A2E]">
                ~ {fmt(end)}
              </p>
            </div>
            {contest.prize && (
              <div className="bg-[#F7F8FA] rounded-xl p-3.5">
                <p className="text-[11px] text-[#6B7280] font-medium mb-1">
                  상금 / 지원금
                </p>
                <p className="text-sm font-semibold text-[#1A1A2E]">
                  {contest.prize}
                </p>
              </div>
            )}
            <div className="bg-[#F7F8FA] rounded-xl p-3.5">
              <p className="text-[11px] text-[#6B7280] font-medium mb-1">
                대상
              </p>
              <p className="text-sm font-semibold text-[#1A1A2E]">
                {contest.target.join(", ")}
              </p>
            </div>
            <div className="bg-[#F7F8FA] rounded-xl p-3.5">
              <p className="text-[11px] text-[#6B7280] font-medium mb-1">
                지역
              </p>
              <p className="text-sm font-semibold text-[#1A1A2E]">
                {contest.region}
              </p>
            </div>
          </div>

          {/* [PP-036] eligibility 렌더링 추가 */}
          {contest.eligibility && (
            <div className="bg-[#F7F8FA] rounded-xl p-3.5">
              <p className="text-[11px] text-[#6B7280] font-medium mb-1">
                지원 자격
              </p>
              <p className="text-sm text-[#1A1A2E] leading-relaxed">
                {contest.eligibility}
              </p>
            </div>
          )}

          {contest.summary && (
            <div>
              <p className="text-[11px] text-[#6B7280] font-medium mb-2">
                요약
              </p>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                {contest.summary}
              </p>
            </div>
          )}

          {/* [PP-038] 체크리스트 localStorage 저장 */}
          {contest.checklist.length > 0 && (
            <div>
              <p className="text-[11px] text-[#6B7280] font-medium mb-2">
                필요 서류
              </p>
              <div className="space-y-1.5">
                {contest.checklist.map((item, i) => (
                  <label
                    key={i}
                    className="flex items-center gap-2.5 text-sm text-[#1A1A2E] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked[i] ?? false}
                      onChange={() => toggleCheck(i)}
                      className="rounded-sm w-4 h-4"
                    />
                    <span
                      className={
                        checked[i] ? "line-through text-[#9CA3AF]" : ""
                      }
                    >
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-7 pb-6 flex gap-3">
          <a
            href={contest.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 text-center text-sm font-bold text-white rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: colors.main }}
          >
            지원하기 →
          </a>
          <a
            href={contest.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 text-sm font-semibold text-[#6B7280] bg-[#F7F8FA] rounded-xl hover:bg-[#EDEEF0] transition-colors"
          >
            원문
          </a>
        </div>
      </div>
    </div>
  );
}
