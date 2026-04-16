import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Category } from "../types/contest";
import { type FilterState, DEFAULT_FILTERS } from "./useContests";
import type { SortBy } from "../components/filters/FilterBar";

type ViewMode = "calendar" | "list";

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // isMobile: resize 이벤트로 반응형 감지 (G)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false,
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const categoriesParam = searchParams.get("categories");
  const VALID_CATEGORIES: Category[] = [
    "contest",
    "hackathon",
    "startup",
    "grant",
  ];
  const categories: Set<Category> = categoriesParam
    ? new Set(
        categoriesParam
          .split(",")
          .filter((c): c is Category =>
            VALID_CATEGORIES.includes(c as Category),
          ),
      )
    : new Set(DEFAULT_FILTERS.categories);

  // URL 파라미터 유효값 화이트리스트 (임의값 주입 방지)
  const VALID_PRIZE = [
    "",
    "under50",
    "50to200",
    "200to500",
    "over500",
  ] as const;
  const VALID_DEADLINE = ["", "week1", "week2", "month1", "month3"] as const;
  const VALID_STATUS = ["", "open", "upcoming", "closed"] as const;
  const VALID_AGE = ["", "youth", "senior", "any"] as const;
  const VALID_ORGANIZER = ["", "gov", "corp", "edu", "ngo"] as const;
  const VALID_TEAM = ["", "solo", "team", "both"] as const;
  const VALID_EXCLUDE = ["youth_excl", "college_excl", "young_excl"];

  const rawPrize = searchParams.get("prizeRange") ?? "";
  const rawDeadline = searchParams.get("deadline") ?? "";
  const rawStatus = searchParams.get("applyStatus") ?? "";
  const rawAge = searchParams.get("ageGroup") ?? "";
  const rawOrganizer = searchParams.get("organizerType") ?? "";
  const rawTeam = searchParams.get("teamType") ?? "";
  const rawExclude = searchParams.get("excludeTargets") ?? "";

  const filters: FilterState = {
    categories,
    field: searchParams.get("field") ?? "",
    target: searchParams.get("target") ?? "",
    region: searchParams.get("region") ?? "",
    search: searchParams.get("q") ?? "",
    showPast: searchParams.get("showPast") === "true",
    prizeRange: (VALID_PRIZE.includes(rawPrize as (typeof VALID_PRIZE)[number])
      ? rawPrize
      : "") as FilterState["prizeRange"],
    deadline: (VALID_DEADLINE.includes(
      rawDeadline as (typeof VALID_DEADLINE)[number],
    )
      ? rawDeadline
      : "") as FilterState["deadline"],
    applyStatus: (VALID_STATUS.includes(
      rawStatus as (typeof VALID_STATUS)[number],
    )
      ? rawStatus
      : "") as FilterState["applyStatus"],
    ageGroup: (VALID_AGE.includes(rawAge as (typeof VALID_AGE)[number])
      ? rawAge
      : "") as FilterState["ageGroup"],
    excludeTargets: rawExclude
      ? rawExclude.split(",").filter((v) => VALID_EXCLUDE.includes(v))
      : [],
    organizerType: (VALID_ORGANIZER.includes(
      rawOrganizer as (typeof VALID_ORGANIZER)[number],
    )
      ? rawOrganizer
      : "") as FilterState["organizerType"],
    teamType: (VALID_TEAM.includes(rawTeam as (typeof VALID_TEAM)[number])
      ? rawTeam
      : "") as FilterState["teamType"],
  };

  const viewMode: ViewMode =
    (searchParams.get("view") as ViewMode) ?? (isMobile ? "list" : "calendar");
  const detailId = searchParams.get("detail");
  const sortBy: SortBy = (searchParams.get("sort") as SortBy) ?? "deadline";

  const updateFilters = useCallback(
    (updates: Partial<FilterState>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (updates.categories !== undefined) {
            const cats = Array.from(updates.categories);
            if (cats.length === 4) next.delete("categories");
            else next.set("categories", cats.join(","));
          }
          if (updates.field !== undefined) {
            if (updates.field) next.set("field", updates.field);
            else next.delete("field");
          }
          if (updates.target !== undefined) {
            if (updates.target) next.set("target", updates.target);
            else next.delete("target");
          }
          if (updates.region !== undefined) {
            if (updates.region) next.set("region", updates.region);
            else next.delete("region");
          }
          if (updates.search !== undefined) {
            if (updates.search) next.set("q", updates.search);
            else next.delete("q");
          }
          if (updates.showPast !== undefined) {
            if (updates.showPast) next.set("showPast", "true");
            else next.delete("showPast");
          }
          if (updates.prizeRange !== undefined) {
            if (updates.prizeRange) next.set("prizeRange", updates.prizeRange);
            else next.delete("prizeRange");
          }
          if (updates.deadline !== undefined) {
            if (updates.deadline) next.set("deadline", updates.deadline);
            else next.delete("deadline");
          }
          if (updates.applyStatus !== undefined) {
            if (updates.applyStatus)
              next.set("applyStatus", updates.applyStatus);
            else next.delete("applyStatus");
          }
          if (updates.ageGroup !== undefined) {
            if (updates.ageGroup) next.set("ageGroup", updates.ageGroup);
            else next.delete("ageGroup");
          }
          if (updates.excludeTargets !== undefined) {
            if (updates.excludeTargets.length > 0)
              next.set("excludeTargets", updates.excludeTargets.join(","));
            else next.delete("excludeTargets");
          }
          if (updates.organizerType !== undefined) {
            if (updates.organizerType)
              next.set("organizerType", updates.organizerType);
            else next.delete("organizerType");
          }
          if (updates.teamType !== undefined) {
            if (updates.teamType) next.set("teamType", updates.teamType);
            else next.delete("teamType");
          }
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setViewMode = useCallback(
    (mode: ViewMode) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (mode === "calendar") next.delete("view");
          else next.set("view", mode);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setDetailId = useCallback(
    (id: string | null) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (id) next.set("detail", id);
          else next.delete("detail");
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setSortBy = useCallback(
    (sort: SortBy) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (sort === "deadline") next.delete("sort");
          else next.set("sort", sort);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return {
    filters,
    updateFilters,
    viewMode,
    setViewMode,
    detailId,
    setDetailId,
    sortBy,
    setSortBy,
  };
}
