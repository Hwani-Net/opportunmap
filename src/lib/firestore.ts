import {
  collection,
  onSnapshot,
  query,
  orderBy,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Contest } from "../types/contest";

const CONTESTS_COLLECTION = "contests";

export function subscribeContests(
  callback: (contests: Contest[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const q = query(
    collection(db, CONTESTS_COLLECTION),
    orderBy("applicationEnd", "asc"),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const contests: Contest[] = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          if (!data.title || !data.category || !data.applicationEnd)
            return null;
          return { id: doc.id, ...data } as Contest;
        })
        .filter((c): c is Contest => c !== null);
      callback(contests);
    },
    (error) => {
      console.error("Firestore subscription error:", error);
      onError?.(error);
    },
  );
}

export function getContestById(
  contests: Contest[],
  id: string,
): Contest | undefined {
  return contests.find((c) => c.id === id);
}
