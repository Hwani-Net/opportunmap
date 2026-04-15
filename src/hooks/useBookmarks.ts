import { useState, useEffect, useRef } from "react";
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./useAuth";

const LS_KEY = "opportunmap-bookmarks";

function loadLocalBookmarks(): Set<string> {
  const saved = localStorage.getItem(LS_KEY);
  return saved ? new Set(JSON.parse(saved) as string[]) : new Set();
}

function saveLocalBookmarks(bookmarks: Set<string>) {
  localStorage.setItem(LS_KEY, JSON.stringify([...bookmarks]));
}

export function useBookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Set<string>>(loadLocalBookmarks);
  const migratedRef = useRef<string | null>(null); // 중복 마이그레이션 방지

  useEffect(() => {
    if (!user) {
      // 비로그인: localStorage 기반
      setBookmarks(loadLocalBookmarks());
      return;
    }

    const bookmarksCol = collection(db, "users", user.uid, "bookmarks");

    // Firestore 실시간 구독
    const unsubscribe = onSnapshot(bookmarksCol, async (snapshot) => {
      const firestoreIds = new Set(snapshot.docs.map((d) => d.id));

      // 최초 로그인 시 localStorage → Firestore 마이그레이션 (병합)
      if (migratedRef.current !== user.uid) {
        migratedRef.current = user.uid;
        const localIds = loadLocalBookmarks();
        const toMigrate = [...localIds].filter((id) => !firestoreIds.has(id));
        await Promise.all(
          toMigrate.map((id) =>
            setDoc(doc(db, "users", user.uid, "bookmarks", id), {
              contestId: id,
              addedAt: serverTimestamp(),
            }),
          ),
        );
        // 마이그레이션 후 합산 반영 (snapshot 재구독으로 최신화됨)
        return;
      }

      // Firestore 상태를 로컬에도 동기화 (오프라인 fallback)
      saveLocalBookmarks(firestoreIds);
      setBookmarks(new Set(firestoreIds));
    });

    return unsubscribe;
  }, [user]);

  const toggle = async (id: string) => {
    if (!user) {
      // 비로그인: localStorage만
      setBookmarks((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        saveLocalBookmarks(next);
        return next;
      });
      return;
    }

    // 로그인: Firestore 업데이트 (onSnapshot이 상태 반영)
    const ref = doc(db, "users", user.uid, "bookmarks", id);
    if (bookmarks.has(id)) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, { contestId: id, addedAt: serverTimestamp() });
    }
  };

  return { bookmarks, toggle };
}
