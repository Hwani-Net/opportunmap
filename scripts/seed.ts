import { initializeApp, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { SEED_DATA } from "../src/seed/seedData";
import { config } from "dotenv";

config({ path: ".env.local" });

const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
if (!projectId) {
  console.error("Missing VITE_FIREBASE_PROJECT_ID in .env.local");
  process.exit(1);
}

// Use Application Default Credentials (gcloud auth)
initializeApp({ projectId });
const db = getFirestore();

async function seed() {
  console.log(`Seeding ${SEED_DATA.length} contests to project: ${projectId}`);

  let successCount = 0;
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
      successCount++;
    } catch (err) {
      console.error(`  ✗ Failed: ${contest.title}`, err);
      failCount++;
    }
  }

  console.log(`\nDone! ${successCount} succeeded, ${failCount} failed.`);
  process.exit(failCount > 0 ? 1 : 0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
