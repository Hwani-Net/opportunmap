import type { Contest } from "../../types/contest";
import { CATEGORY_LABEL } from "../../types/contest";
import { CATEGORY_COLORS } from "../../constants";

interface ContestCardProps {
  contest: Contest;
  onClick: (id: string) => void;
}

export default function ContestCard({ contest, onClick }: ContestCardProps) {
  const colors = CATEGORY_COLORS[contest.category];
  const deadline = contest.applicationEnd.toDate();
  const now = new Date();
  const daysLeft = Math.ceil(
    (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );
  const isPast = daysLeft < 0;

  return (
    <article
      onClick={() => onClick(contest.id)}
      className="bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-0.5 flex"
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
      <div className="flex-1 p-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-[11px] font-bold uppercase tracking-wider"
              style={{ color: colors.main }}
            >
              {CATEGORY_LABEL[contest.category]}
            </span>
            {!isPast && daysLeft <= 7 && (
              <span className="text-[11px] font-bold text-[#E03131]">
                D-{daysLeft}
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-[#1A1A2E] truncate">
            {contest.title}
          </h3>
          <p className="text-xs text-[#9CA3AF] mt-0.5">{contest.organizer}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm font-semibold text-[#1A1A2E]">
            {deadline.toLocaleDateString("ko-KR", {
              month: "short",
              day: "numeric",
            })}
          </p>
          {contest.prize && (
            <p className="text-xs text-[#6B7280] mt-0.5">{contest.prize}</p>
          )}
        </div>
      </div>
    </article>
  );
}
