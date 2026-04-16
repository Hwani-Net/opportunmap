import type { Contest } from "../../types/contest";

const FIELD_CONFIG: Record<
  string,
  { emoji: string; from: string; to: string }
> = {
  AI: { emoji: "🤖", from: "#6366f1", to: "#8b5cf6" },
  데이터: { emoji: "📊", from: "#3b82f6", to: "#06b6d4" },
  디자인: { emoji: "🎨", from: "#ec4899", to: "#f97316" },
  창업: { emoji: "🚀", from: "#f97316", to: "#eab308" },
  환경: { emoji: "🌱", from: "#22c55e", to: "#10b981" },
  핀테크: { emoji: "💰", from: "#14b8a6", to: "#3b82f6" },
  마케팅: { emoji: "📢", from: "#f43f5e", to: "#ec4899" },
  소프트웨어: { emoji: "💻", from: "#6366f1", to: "#3b82f6" },
  블록체인: { emoji: "⛓️", from: "#6b7280", to: "#374151" },
  사회혁신: { emoji: "🤝", from: "#10b981", to: "#3b82f6" },
};

const CATEGORY_CONFIG: Record<
  string,
  { emoji: string; from: string; to: string }
> = {
  contest: { emoji: "🏆", from: "#6366f1", to: "#8b5cf6" },
  hackathon: { emoji: "⚡", from: "#06b6d4", to: "#3b82f6" },
  startup: { emoji: "🚀", from: "#f97316", to: "#eab308" },
  grant: { emoji: "💚", from: "#22c55e", to: "#10b981" },
};

type Size = "sm" | "md" | "lg";
const SIZE_MAP: Record<Size, number> = { sm: 48, md: 80, lg: 120 };
const RADIUS_MAP: Record<Size, number> = { sm: 8, md: 12, lg: 16 };
const FONT_MAP: Record<Size, number> = { sm: 20, md: 32, lg: 48 };

export function ContestThumbnail({
  contest,
  size = "md",
}: {
  contest: Pick<Contest, "category" | "field">;
  size?: Size;
}) {
  const px = SIZE_MAP[size];
  const firstField = contest.field[0];
  const fieldCfg = firstField ? FIELD_CONFIG[firstField] : undefined;
  const config =
    fieldCfg ?? CATEGORY_CONFIG[contest.category] ?? CATEGORY_CONFIG.contest;

  return (
    <div
      style={{
        width: px,
        height: px,
        background: `linear-gradient(135deg, ${config.from}, ${config.to})`,
        borderRadius: RADIUS_MAP[size],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: FONT_MAP[size],
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      {config.emoji}
    </div>
  );
}
