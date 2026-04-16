import { useState, useEffect } from "react";
import type { Contest, Category } from "../types/contest";
import { subscribeContests } from "../lib/firestore";

export interface FilterState {
  categories: Set<Category>;
  field: string;
  target: string;
  region: string;
  search: string;
  showPast: boolean;
  prizeRange: "" | "under50" | "50to200" | "200to500" | "over500";
  deadline: "" | "thisWeek" | "thisMonth" | "3months";
  applyStatus: "" | "open" | "upcoming" | "closing7";
  ageGroup: "" | "youth" | "young" | "college" | "open";
}

export const DEFAULT_FILTERS: FilterState = {
  categories: new Set<Category>(["contest", "hackathon", "startup", "grant"]),
  field: "",
  target: "",
  region: "",
  search: "",
  showPast: false,
  prizeRange: "",
  deadline: "",
  applyStatus: "",
  ageGroup: "",
};

export function useContests() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsub = subscribeContests(
      (data) => {
        setContests(data);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );
    return unsub;
  }, []);

  return { contests, loading, error };
}

// prize 문자열에서 만원 단위 숫자 추출
function extractPrize(prize: string): number {
  if (!prize) return 0;
  const match = prize.match(/[\d,]+/);
  if (!match) return 0;
  const num = parseInt(match[0].replace(/,/g, ""), 10);
  if (prize.includes("억")) return num * 10000;
  if (prize.includes("천만")) return num * 1000;
  return num;
}

export function filterContests(
  contests: Contest[],
  filters: FilterState,
): Contest[] {
  const now = new Date();

  return contests.filter((c) => {
    if (!filters.categories.has(c.category)) return false;

    if (!filters.showPast && c.applicationEnd.toDate() < now) return false;

    if (filters.field && !c.field.includes(filters.field)) return false;

    if (filters.target && !c.target.includes(filters.target)) return false;

    if (filters.region && !c.region.includes(filters.region)) return false;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !c.title.toLowerCase().includes(q) &&
        !c.organizer.toLowerCase().includes(q) &&
        !(c.summary ?? "").toLowerCase().includes(q) &&
        !c.field.join(" ").toLowerCase().includes(q)
      )
        return false;
    }

    // 상금 범위 필터
    if (filters.prizeRange) {
      const amount = extractPrize(c.prize ?? "");
      if (filters.prizeRange === "under50" && amount >= 50) return false;
      if (filters.prizeRange === "50to200" && (amount < 50 || amount >= 200))
        return false;
      if (filters.prizeRange === "200to500" && (amount < 200 || amount >= 500))
        return false;
      if (filters.prizeRange === "over500" && amount < 500) return false;
    }

    // 마감 기간 필터
    if (filters.deadline) {
      const endDate = c.applicationEnd.toDate();
      const diffDays =
        (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      if (filters.deadline === "thisWeek" && (diffDays < 0 || diffDays > 7))
        return false;
      if (filters.deadline === "thisMonth" && (diffDays < 0 || diffDays > 30))
        return false;
      if (filters.deadline === "3months" && (diffDays < 0 || diffDays > 90))
        return false;
    }

    // 접수 상태 필터
    if (filters.applyStatus) {
      const endDate = c.applicationEnd.toDate();
      const startDate = c.applicationStart?.toDate();
      const diffDaysToEnd =
        (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      if (filters.applyStatus === "open") {
        const isOpen = (!startDate || startDate <= now) && endDate >= now;
        if (!isOpen) return false;
      }
      if (filters.applyStatus === "upcoming") {
        if (!startDate || startDate <= now) return false;
      }
      if (filters.applyStatus === "closing7") {
        if (diffDaysToEnd < 0 || diffDaysToEnd > 7) return false;
      }
    }

    // 나이/연령 필터
    if (filters.ageGroup) {
      const t = c.target.join(" ");
      if (filters.ageGroup === "youth" && !t.includes("청소년")) return false;
      if (filters.ageGroup === "young" && !t.includes("청년")) return false;
      if (filters.ageGroup === "college" && !t.includes("대학")) return false;
      if (filters.ageGroup === "open") {
        const hasRestriction =
          c.target.length > 0 &&
          !t.includes("제한없음") &&
          !t.includes("누구나");
        if (hasRestriction) return false;
      }
    }

    return true;
  });
}
