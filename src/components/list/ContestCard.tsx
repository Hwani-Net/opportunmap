import { EyeOff } from "lucide-react";
import type { Contest } from "../../types/contest";
import { CATEGORY_LABEL } from "../../types/contest";
import { CATEGORY_COLORS } from "../../constants";
import { ContestThumbnail } from "../common/ContestThumbnail";

interface ContestCardProps {
  contest: Contest;
  onClick: (id: string) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
  onHide?: () => void;
}

export default function ContestCard({
  contest,
  onClick,
  isBookmarked = false,
  onToggleBookmark,
  onHide,
}: ContestCardProps) {
  const colors = CATEGORY_COLORS[contest.category];
  const deadline = contest.applicationEnd.toDate();
  const now = new Date();
  const daysLeft = Math.ceil(
    (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  const isPast = daysLeft < 0;

  // D-day 뱃지 색상 3단계 (PP-008 개선)
  const getDdayStyle = () => {
    if (isPast) return null;
    if (daysLeft === 0) return { color: "#E03131", pulse: true };
    if (daysLeft <= 7) return { color: "#E03131", pulse: false };
    if (daysLeft <= 14) return { color: "#E8590C", pulse: false };
    if (daysLeft <= 30) return { color: "#F59F00", pulse: false };
    return null;
  };
  const ddayStyle = getDdayStyle();
  const ddayLabel = isPast
    ? "마감됨"
    : daysLeft === 0
      ? "D-Day"
      : `D-${daysLeft}`;

  return (
    <div
      onClick={() => onClick(contest.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(contest.id);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`${contest.title} 상세보기`}
      className="bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 flex focus:outline-none focus:ring-2 focus:ring-[#3B5BDB]"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 12px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 1px 3px rgba(0,0,0,0.04)";
      }}
    >
      <div className="w-1 shrink-0" style={{ backgroundColor: colors.main }} />
      <div className="pl-3 pt-3 pb-3 shrink-0 flex items-start">
        <ContestThumbnail contest={contest} size="sm" />
      </div>
      <div className="flex-1 p-4 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-[11px] font-bold uppercase tracking-wider"
              style={{ color: colors.main }}
            >
              {CATEGORY_LABEL[contest.category]}
            </span>
            {ddayStyle && (
              <span
                className={`text-[11px] font-bold${ddayStyle.pulse ? " animate-pulse" : ""}`}
                style={{ color: ddayStyle.color }}
              >
                {ddayLabel}
              </span>
            )}
            {isPast && (
              <span className="text-[11px] font-bold text-[#9CA3AF]">
                마감됨
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-[#1A1A2E] truncate">
            {contest.title}
          </h3>
          <p className="text-xs text-[#6B7280] mt-0.5">{contest.organizer}</p>

          {/* [PP-029] 분야 태그 */}
          {contest.field && contest.field.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {contest.field.slice(0, 2).map((f) => (
                <span
                  key={f}
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded-md"
                  style={{
                    background: `${colors.main}18`,
                    color: colors.main,
                  }}
                >
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0 max-w-[9rem]">
          <div className="flex items-center gap-1">
            {/* 숨기기 버튼 */}
            {onHide && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onHide();
                }}
                aria-label="캘린더에서 숨기기"
                className="p-1 rounded text-[#9CA3AF] hover:text-[#6B7280] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B5BDB]"
              >
                <EyeOff size={14} />
              </button>
            )}
            {/* [PP-045] 북마크 버튼 */}
            {onToggleBookmark && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(contest.id);
                }}
                aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
                className="p-1 rounded text-[#9CA3AF] hover:text-[#F59F00] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B5BDB]"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill={isBookmarked ? "#F59F00" : "none"}
                  stroke={isBookmarked ? "#F59F00" : "currentColor"}
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </button>
            )}

            {/* [PP-028] 지원하기 버튼 */}
            {contest.applyUrl && (
              <a
                href={contest.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label="지원하기"
                className="p-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B5BDB]"
                style={{ color: colors.main }}
                title="지원하기"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
          </div>

          <p className="text-sm font-semibold text-[#1A1A2E]">
            {deadline.toLocaleDateString("ko-KR", {
              month: "short",
              day: "numeric",
            })}
          </p>
          {contest.prize && (
            <p className="text-xs text-[#6B7280] text-right line-clamp-2 break-keep">
              {contest.prize}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
