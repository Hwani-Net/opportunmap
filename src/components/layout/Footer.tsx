export default function Footer() {
  return (
    <footer
      className="bg-white mt-10"
      style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
    >
      <div className="max-w-[1400px] mx-auto px-8 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p
            className="text-base font-extrabold text-[#1A1A2E] mb-1"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            OpportuMap
          </p>
          <p className="text-xs text-[#9CA3AF]">
            공모전·해커톤·창업지원 통합 캘린더
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm text-[#6B7280]">
          <a
            href="https://www.contestkorea.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#3B5BDB] transition-colors"
          >
            콘테스트코리아
          </a>
          <a
            href="https://linkareer.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#3B5BDB] transition-colors"
          >
            링커리어
          </a>
          <a
            href="https://www.k-startup.go.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#3B5BDB] transition-colors"
          >
            K-Startup
          </a>
        </div>

        <p className="text-xs text-[#C4C4C4]">© 2026 OpportuMap</p>
      </div>
    </footer>
  );
}
