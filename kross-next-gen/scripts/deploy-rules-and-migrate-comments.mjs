// Run from kross-next-gen/scripts. Deploys ../firestore.rules and moves
// array-embedded comments into players/{id}/comments.
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(process.cwd() + "/");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, Timestamp, FieldValue } = require("firebase-admin/firestore");
const { getSecurityRules } = require("firebase-admin/security-rules");

initializeApp({ credential: cert(JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"))) });
const db = getFirestore();

// 1) Deploy rules
const source = fs.readFileSync("../firestore.rules", "utf8");
const ruleset = await getSecurityRules().releaseFirestoreRulesetFromSource(source);
console.log("Rules released:", ruleset.name, ruleset.createTime);

// 2) Migrate comments
const usersByName = new Map((await db.collection("users").get()).docs.map((d) => [d.data().name, d.id]));
let moved = 0;
for (const doc of (await db.collection("players").get()).docs) {
  const p = doc.data();
  const updates = {};
  for (const field of ["assessmentHistory", "notes"]) {
    const arr = p[field] || [];
    if (!arr.some((e) => e.comments?.length)) continue;
    for (const entry of arr) {
      for (const c of entry.comments || []) {
        const parsed = new Date(c.date);
        await doc.ref.collection("comments").doc(c.id).set({
          authorId: c.authorId || usersByName.get(c.author) || null,
          author: c.author,
          text: c.text,
          date: c.date,
          parentId: entry.id,
          createdAt: isNaN(parsed) ? FieldValue.serverTimestamp() : Timestamp.fromDate(parsed),
        });
        moved++;
      }
    }
    updates[field] = arr.map(({ comments, ...rest }) => rest);
  }
  if (Object.keys(updates).length) await doc.ref.update(updates);
}
console.log("Comments moved:", moved);
