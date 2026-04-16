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
  ageGroup: "" | "youth" | "young" | "college" | "senior" | "open";
  excludeTargets: string[];
  organizerType: "" | "gov" | "corp" | "edu" | "foundation";
  teamType: "" | "solo" | "team" | "both";
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
  excludeTargets: [],
  organizerType: "",
  teamType: "",
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
      if (filters.ageGroup === "senior") {
        // 중장년(40+): target에 중장년/40세/일반인 포함 OR target이 비어있거나 제한없음/누구나
        const isSeniorFriendly =
          t.includes("중장년") ||
          t.includes("40세") ||
          t.includes("일반인") ||
          c.target.length === 0 ||
          t.includes("제한없음") ||
          t.includes("누구나");
        if (!isSeniorFriendly) return false;
      }
      if (filters.ageGroup === "open") {
        const hasRestriction =
          c.target.length > 0 &&
          !t.includes("제한없음") &&
          !t.includes("누구나");
        if (hasRestriction) return false;
      }
    }

    // 네거티브 필터 (특정 대상 제외)
    if (filters.excludeTargets.length > 0) {
      const t = c.target.join(" ");
      if (filters.excludeTargets.includes("youth_excl")) {
        // 청소년 전용: target이 청소년만 포함
        const isYouthOnly =
          c.target.length > 0 &&
          t.includes("청소년") &&
          !t.includes("청년") &&
          !t.includes("대학") &&
          !t.includes("일반") &&
          !t.includes("누구나") &&
          !t.includes("제한없음");
        if (isYouthOnly) return false;
      }
      if (filters.excludeTargets.includes("college_excl")) {
        // 대학생 전용: target이 대학생/대학원생 위주
        const isCollegeOnly =
          c.target.length > 0 &&
          t.includes("대학") &&
          !t.includes("청년") &&
          !t.includes("일반") &&
          !t.includes("누구나") &&
          !t.includes("제한없음");
        if (isCollegeOnly) return false;
      }
      if (filters.excludeTargets.includes("young_excl")) {
        // 청년(39세 이하) 전용: target에 청년만 있고 일반 없음
        const isYoungOnly =
          c.target.length > 0 &&
          t.includes("청년") &&
          !t.includes("일반") &&
          !t.includes("누구나") &&
          !t.includes("제한없음");
        if (isYoungOnly) return false;
      }
    }

    // 주최기관 유형 필터
    if (filters.organizerType) {
      const org = c.organizer;
      if (filters.organizerType === "gov") {
        const isGov = /부|처|청|공단|공사|진흥원|센터|재청|위원회/.test(org);
        if (!isGov) return false;
      }
      if (filters.organizerType === "corp") {
        const isCorp = /주식회사|\(주\)|㈜|그룹|Corp|Inc/.test(org);
        if (!isCorp) return false;
      }
      if (filters.organizerType === "edu") {
        const isEdu = /대학교|대학|학교|교육/.test(org);
        if (!isEdu) return false;
      }
      if (filters.organizerType === "foundation") {
        const isFoundation = /재단|협회|학회|연합|연맹/.test(org);
        if (!isFoundation) return false;
      }
    }

    // 참가 형태 필터
    if (filters.teamType) {
      const t = c.target.join(" ");
      const hasSolo = t.includes("개인");
      const hasTeam = t.includes("팀");
      if (filters.teamType === "solo") {
        if (!hasSolo || hasTeam) return false;
      }
      if (filters.teamType === "team") {
        if (!hasTeam || hasSolo) return false;
      }
      if (filters.teamType === "both") {
        const isBoth = (hasSolo && hasTeam) || c.target.length === 0;
        if (!isBoth) return false;
      }
    }

    return true;
  });
}
