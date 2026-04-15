import { useState } from "react";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("opportunmap-bookmarks");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const toggle = (id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("opportunmap-bookmarks", JSON.stringify([...next]));
      return next;
    });
  };

  return { bookmarks, toggle };
}
