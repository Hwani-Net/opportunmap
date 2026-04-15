import type { Contest } from "../../types/contest";
import ContestCard from "./ContestCard";

interface ListViewProps {
  contests: Contest[];
  onSelectContest: (id: string) => void;
}

export default function ListView({ contests, onSelectContest }: ListViewProps) {
  if (contests.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">🔍</p>
        <p className="text-[#1A1A2E] font-semibold text-base mb-2">
          검색 결과가 없습니다
        </p>
        <p className="text-[#9CA3AF] text-sm">
          필터를 조정하거나 검색어를 변경해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {contests.map((c) => (
        <ContestCard key={c.id} contest={c} onClick={onSelectContest} />
      ))}
    </div>
  );
}
