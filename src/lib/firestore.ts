import {
  collection,
  onSnapshot,
  query,
  orderBy,
  type Unsubscribe,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
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

export async function addContest(
  data: Omit<Contest, "id" | "createdAt">,
): Promise<string> {
  const payload = {
    ...data,
    applicationStart:
      data.applicationStart instanceof Timestamp
        ? data.applicationStart
        : Timestamp.fromDate(
            new Date(data.applicationStart as unknown as string),
          ),
    applicationEnd:
      data.applicationEnd instanceof Timestamp
        ? data.applicationEnd
        : Timestamp.fromDate(
            new Date(data.applicationEnd as unknown as string),
          ),
    createdAt: Timestamp.now(),
  };
  const docRef = await addDoc(collection(db, CONTESTS_COLLECTION), payload);
  return docRef.id;
}

export async function updateContest(
  id: string,
  data: Partial<Omit<Contest, "id">>,
): Promise<void> {
  const payload: Record<string, unknown> = { ...data };
  if (data.applicationStart && !(data.applicationStart instanceof Timestamp)) {
    payload.applicationStart = Timestamp.fromDate(
      new Date(data.applicationStart as unknown as string),
    );
  }
  if (data.applicationEnd && !(data.applicationEnd instanceof Timestamp)) {
    payload.applicationEnd = Timestamp.fromDate(
      new Date(data.applicationEnd as unknown as string),
    );
  }
  await updateDoc(doc(db, CONTESTS_COLLECTION, id), payload);
}

export async function deleteContest(id: string): Promise<void> {
  await deleteDoc(doc(db, CONTESTS_COLLECTION, id));
}
