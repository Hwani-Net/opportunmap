import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "opportunmap_hidden";

export function useHiddenContests() {
  const [hiddenIds, setHiddenIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hiddenIds));
  }, [hiddenIds]);

  const hide = useCallback((id: string) => {
    setHiddenIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const show = useCallback((id: string) => {
    setHiddenIds((prev) => prev.filter((i) => i !== id));
  }, []);

  const isHidden = useCallback(
    (id: string) => hiddenIds.includes(id),
    [hiddenIds],
  );

  const clearAll = useCallback(() => setHiddenIds([]), []);

  return {
    hiddenIds,
    hide,
    show,
    isHidden,
    clearAll,
    hiddenCount: hiddenIds.length,
  };
}
