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
}

export const DEFAULT_FILTERS: FilterState = {
  categories: new Set<Category>(["contest", "hackathon", "startup", "grant"]),
  field: "",
  target: "",
  region: "",
  search: "",
  showPast: false,
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

    if (filters.region && c.region !== filters.region) return false;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !c.title.toLowerCase().includes(q) &&
        !c.organizer.toLowerCase().includes(q)
      )
        return false;
    }

    return true;
  });
}
