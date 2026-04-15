import type { Contest } from "../../types/contest";
import ContestCard from "./ContestCard";

interface ListViewProps {
  contests: Contest[];
  onSelectContest: (id: string) => void;
}

export default function ListView({ contests, onSelectContest }: ListViewProps) {
  if (contests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-4xl mb-4">📭</p>
        <p className="text-[var(--color-text-secondary)]">
          조건에 맞는 공고가 없습니다
        </p>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          필터를 조정해 보세요
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
