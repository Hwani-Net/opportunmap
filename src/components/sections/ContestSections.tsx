import { useState } from "react";
import type { Contest } from "../../types/contest";
import { ContestThumbnail } from "../common/ContestThumbnail";

interface ContestSectionsProps {
  contests: Contest[];
  onSelectContest: (id: string) => void;
}

function getDaysLeft(date: Date): number {
  return Math.ceil((date.getTime() - Date.now()) / 86400000);
}

function extractPrize(prize: string): number {
  if (!prize) return 0;
  const match = prize.match(/[\d,]+/);
  if (!match) return 0;
  const num = parseInt(match[0].replace(/,/g, ""), 10);
  if (prize.includes("억")) return num * 10000;
  if (prize.includes("천만")) return num * 1000;
  return num;
}

function DBadge({ daysLeft }: { daysLeft: number }) {
  const color =
    daysLeft <= 1 ? "#E03131" : daysLeft <= 3 ? "#E8590C" : "#F59F00";
  const label = daysLeft === 0 ? "D-Day" : `D-${daysLeft}`;
  return (
    <span
      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
      style={{ background: `${color}18`, color }}
    >
      {label}
    </span>
  );
}

function SectionCard({
  contest,
  onSelect,
  showDays,
  showPrize,
}: {
  contest: Contest;
  onSelect: (id: string) => void;
  showDays?: boolean;
  showPrize?: boolean;
}) {
  const deadline = contest.applicationEnd.toDate();
  const daysLeft = getDaysLeft(deadline);

  return (
    <button
      onClick={() => onSelect(contest.id)}
      className="flex-shrink-0 w-[188px] bg-white rounded-xl p-3 text-left transition-all duration-150 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#3B5BDB]"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 12px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 1px 3px rgba(0,0,0,0.06)";
      }}
    >
      <ContestThumbnail contest={contest} size="sm" />
      <p className="mt-2 text-[12px] font-semibold text-[#1A1A2E] line-clamp-2 leading-snug">
        {contest.title}
      </p>
      <p className="mt-1 text-[10px] text-[#9CA3AF]">{contest.organizer}</p>
      <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
        {showDays && daysLeft >= 0 && <DBadge daysLeft={daysLeft} />}
        {showPrize && contest.prize && (
          <span className="text-[10px] font-semibold text-[#22c55e] truncate max-w-[120px]">
            {contest.prize}
          </span>
        )}
        {!showDays && !showPrize && (
          <span className="text-[10px] text-[#9CA3AF]">
            {deadline.toLocaleDateString("ko-KR", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>
    </button>
  );
}

function HScrollRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
      {children}
    </div>
  );
}

const FIELD_TABS = ["AI", "디자인", "창업", "데이터", "환경", "핀테크"];

export function ContestSections({
  contests,
  onSelectContest,
}: ContestSectionsProps) {
  const [activeField, setActiveField] = useState("AI");
  const now = Date.now();

  // 섹션 A: 마감임박 D-7 이내, 마감 안 된 것
  const urgentContests = contests
    .filter((c) => {
      const d = getDaysLeft(c.applicationEnd.toDate());
      return d >= 0 && d <= 7;
    })
    .sort(
      (a, b) =>
        a.applicationEnd.toDate().getTime() -
        b.applicationEnd.toDate().getTime(),
    )
    .slice(0, 6);

  // 섹션 B: 상금 TOP 5
  const topPrizeContests = [...contests]
    .filter((c) => c.applicationEnd.toDate().getTime() > now && c.prize)
    .sort((a, b) => extractPrize(b.prize) - extractPrize(a.prize))
    .slice(0, 5);

  // 섹션 C: 분야별 탭
  const fieldContests = contests
    .filter(
      (c) =>
        c.field.includes(activeField) &&
        c.applicationEnd.toDate().getTime() > now,
    )
    .slice(0, 4);

  // 섹션 D: 신규 등록 (applicationStart 최신순)
  const newContests = [...contests]
    .filter((c) => c.applicationEnd.toDate().getTime() > now)
    .sort(
      (a, b) =>
        b.applicationStart.toDate().getTime() -
        a.applicationStart.toDate().getTime(),
    )
    .slice(0, 4);

  if (contests.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* 섹션 A: 마감임박 */}
      {urgentContests.length > 0 && (
        <section>
          <h2 className="text-base font-bold text-[#1A1A2E] mb-3">
            🔥 마감임박
          </h2>
          <HScrollRow>
            {urgentContests.map((c) => (
              <SectionCard
                key={c.id}
                contest={c}
                onSelect={onSelectContest}
                showDays
              />
            ))}
          </HScrollRow>
        </section>
      )}

      {/* 섹션 B: 상금 TOP */}
      {topPrizeContests.length > 0 && (
        <section>
          <h2 className="text-base font-bold text-[#1A1A2E] mb-3">
            💰 상금 TOP
          </h2>
          <HScrollRow>
            {topPrizeContests.map((c) => (
              <SectionCard
                key={c.id}
                contest={c}
                onSelect={onSelectContest}
                showPrize
              />
            ))}
          </HScrollRow>
        </section>
      )}

      {/* 섹션 C: 분야별 */}
      <section>
        <h2 className="text-base font-bold text-[#1A1A2E] mb-3">🏷️ 분야별</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide mb-3">
          {FIELD_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveField(tab)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B5BDB]"
              style={
                activeField === tab
                  ? { background: "#3B5BDB", color: "#fff" }
                  : { background: "#F3F4F6", color: "#6B7280" }
              }
            >
              {tab}
            </button>
          ))}
        </div>
        {fieldContests.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {fieldContests.map((c) => (
              <SectionCard key={c.id} contest={c} onSelect={onSelectContest} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#9CA3AF] text-center py-4">
            해당 분야 공고가 없습니다.
          </p>
        )}
      </section>

      {/* 섹션 D: 신규 등록 */}
      {newContests.length > 0 && (
        <section>
          <h2 className="text-base font-bold text-[#1A1A2E] mb-3">
            ✨ 신규 등록
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {newContests.map((c) => (
              <SectionCard key={c.id} contest={c} onSelect={onSelectContest} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
