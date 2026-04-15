import { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../common/SearchBar";
import { useAuth } from "../../hooks/useAuth";

interface HeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export default function Header({ searchValue, onSearchChange }: HeaderProps) {
  const { user, isAdmin, loading, signIn, signOut } = useAuth();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#F7F8FA]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
        <h1
          className="text-lg md:text-xl tracking-tight shrink-0"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            color: "#1A1A2E",
          }}
        >
          OpportuMap
        </h1>

        <div className="hidden md:block w-[360px]">
          <SearchBar value={searchValue} onChange={onSearchChange} />
        </div>

        <div className="flex items-center gap-3">
          {/* 모바일 검색 아이콘 */}
          <button
            className="md:hidden p-2 rounded-lg text-[#6B7280] hover:text-[#1A1A2E] hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#3B5BDB]"
            aria-label="검색"
            onClick={() => setMobileSearchOpen((v) => !v)}
          >
            {mobileSearchOpen ? (
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
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="11" cy="11" r="8" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35"
                />
              </svg>
            )}
          </button>

          {!loading && (
            <>
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#3B5BDB] text-[#3B5BDB] hover:bg-[#3B5BDB] hover:text-white transition-colors"
                    >
                      관리자
                    </Link>
                  )}
                  <span className="text-xs text-gray-500 hidden md:block max-w-[120px] truncate">
                    {user.email}
                  </span>
                  <button
                    onClick={signOut}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <button
                  onClick={signIn}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#3B5BDB" }}
                >
                  로그인
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* 모바일 검색바 확장 영역 */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 bg-[#F7F8FA]">
          <SearchBar value={searchValue} onChange={onSearchChange} autoFocus />
        </div>
      )}
    </header>
  );
}
