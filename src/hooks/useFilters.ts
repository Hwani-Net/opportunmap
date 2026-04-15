import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type { Category } from "../types/contest";
import { type FilterState, DEFAULT_FILTERS } from "./useContests";

type ViewMode = "calendar" | "list";

export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoriesParam = searchParams.get("categories");
  const categories: Set<Category> = categoriesParam
    ? new Set(categoriesParam.split(",") as Category[])
    : new Set(DEFAULT_FILTERS.categories);

  const filters: FilterState = {
    categories,
    field: searchParams.get("field") ?? "",
    target: searchParams.get("target") ?? "",
    region: searchParams.get("region") ?? "",
    search: searchParams.get("q") ?? "",
    showPast: searchParams.get("showPast") === "true",
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
  const viewMode: ViewMode =
    (searchParams.get("view") as ViewMode) ?? (isMobile ? "list" : "calendar");
  const detailId = searchParams.get("detail");

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

  return {
    filters,
    updateFilters,
    viewMode,
    setViewMode,
    detailId,
    setDetailId,
  };
}
