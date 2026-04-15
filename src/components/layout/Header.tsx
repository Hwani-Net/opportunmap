import SearchBar from "../common/SearchBar";

interface HeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export default function Header({ searchValue, onSearchChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#F7F8FA]">
      <div className="max-w-[1400px] mx-auto px-8 py-5 flex items-center justify-between">
        <h1
          className="text-xl tracking-tight shrink-0"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            color: "#1A1A2E",
          }}
        >
          OpportuMap
        </h1>

        <div className="w-[360px]">
          <SearchBar value={searchValue} onChange={onSearchChange} />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600" />
        </div>
      </div>
    </header>
  );
}
