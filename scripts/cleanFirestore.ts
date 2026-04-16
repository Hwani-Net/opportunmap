import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { SEED_DATA } from "../src/seed/seedData";
import { config } from "dotenv";

config({ path: ".env.local" });

const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
if (!projectId) {
  console.error("Missing VITE_FIREBASE_PROJECT_ID in .env.local");
  process.exit(1);
}

initializeApp({ projectId });
const db = getFirestore();

async function cleanAndReseed() {
  // Step 1: contests 컬렉션 전체 삭제
  console.log("Step 1: contests 컬렉션 전체 삭제 중...");
  const snapshot = await db.collection("contests").get();
  if (snapshot.empty) {
    console.log("  (기존 문서 없음, 삭제 스킵)");
  } else {
    const BATCH_SIZE = 400; // Firestore 배치 최대 500
    let deletedTotal = 0;
    const docs = snapshot.docs;

    for (let i = 0; i < docs.length; i += BATCH_SIZE) {
      const batch = db.batch();
      const chunk = docs.slice(i, i + BATCH_SIZE);
      chunk.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      deletedTotal += chunk.length;
      console.log(`  삭제 진행: ${deletedTotal}/${docs.length}건`);
    }
    console.log(`  ✓ 총 ${deletedTotal}건 삭제 완료`);
  }

  // Step 2: SEED_DATA 전체 재투입
  console.log(`\nStep 2: SEED_DATA ${SEED_DATA.length}건 재투입 중...`);
  let addCount = 0;
  let failCount = 0;

  for (const contest of SEED_DATA) {
    try {
      const doc = {
        ...contest,
        applicationStart: Timestamp.fromDate(contest.applicationStart),
        applicationEnd: Timestamp.fromDate(contest.applicationEnd),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      const ref = await db.collection("contests").add(doc);
      console.log(`  ✓ [${contest.category}] ${contest.title} (${ref.id})`);
      addCount++;
    } catch (err) {
      console.error(`  ✗ Failed: ${contest.title}`, err);
      failCount++;
    }
  }

  console.log(`\n재투입 완료 — 추가: ${addCount}건, 실패: ${failCount}건`);
  process.exit(failCount > 0 ? 1 : 0);
}

cleanAndReseed().catch((err) => {
  console.error("cleanFirestore failed:", err);
  process.exit(1);
});
