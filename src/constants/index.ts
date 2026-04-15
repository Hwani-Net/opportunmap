import type { Category } from "../types/contest";

export const CATEGORY_COLORS: Record<
  Category,
  { main: string; bg: string; text: string }
> = {
  contest: { main: "#3B5BDB", bg: "rgba(59,91,219,0.06)", text: "#3B5BDB" },
  hackathon: { main: "#0CA678", bg: "rgba(12,166,120,0.06)", text: "#0CA678" },
  startup: { main: "#E8590C", bg: "rgba(232,89,12,0.06)", text: "#E8590C" },
  grant: { main: "#E03131", bg: "rgba(224,49,49,0.06)", text: "#E03131" },
};

export const FIELD_OPTIONS = [
  "AI/SW",
  "디자인",
  "사회혁신",
  "과학/공학",
  "문화/예술",
  "마케팅",
  "창업",
  "데이터",
  "영상/미디어",
  "기타",
] as const;

export const TARGET_OPTIONS = [
  "대학생",
  "대학원생",
  "일반인",
  "예비창업자",
  "스타트업",
  "직장인",
] as const;

export const REGION_OPTIONS = [
  "전국",
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "광주",
  "대전",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
  "온라인",
] as const;
