// Import Customers CSV -> Firestore "players" (KROSS Next Gen schema)
// npm i firebase-admin csv-parse
// node import-players.mjs ./Customers.csv                       (dry run)
// node import-players.mjs ./Customers1.csv ./Customers2.csv      (หลายไฟล์ได้)
// node import-players.mjs ./Customers1.csv ./Customers2.csv --write

import fs from "node:fs";
import crypto from "node:crypto";
import { parse } from "csv-parse/sync";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const CSV_PATHS = process.argv.slice(2).filter((a) => !a.startsWith("--"));
if (!CSV_PATHS.length) CSV_PATHS.push("./Customers.csv");
const WRITE = process.argv.includes("--write");
const COLLECTION = "players";
const SERVICE_ACCOUNT = "./serviceAccountKey.json";

// ===== ตั้งค่า =====
// ใส่ ID จาก CSV ถ้าต้องการเฉพาะบางคน เช่น ["67278", "103750"] — เว้นว่าง = ใช้ FILTER
const ONLY_IDS = [];
// ค่าเริ่มต้น: เฉพาะคนที่มี membership — เปลี่ยนเป็น () => true ถ้าจะเอาทั้งหมด
const FILTER = (r) => !!clean(r["Memberships"]);
// true = เก็บ customerId/email/phone เพิ่มจาก schema (ช่วยจับคู่ตอน import ซ้ำ)
// false = เขียนตาม schema เป๊ะ ๆ
const KEEP_CSV_FIELDS = false;
// ==================

function clean(v) {
  return v === undefined || v === null || String(v).trim() === "" ? null : String(v).trim();
}
const newId = () => `player_${crypto.randomBytes(4).toString("hex")}`;
const normName = (s) => (s || "").toLowerCase().replace(/\s+/g, " ").trim();

// "23 Sept 2026"
function displayDate(v) {
  const dmy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(v || ""); // Excel export: 26/05/2025
  const d = dmy ? new Date(+dmy[3], dmy[2] - 1, +dmy[1]) : v ? new Date(v) : new Date();
  if (isNaN(d)) return displayDate();
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function csvExtras(r) {
  return {
    customerId: clean(r["ID"]),
    email: clean(r["Email"])?.toLowerCase() ?? "",
    phone: clean(r["Phone"]) ?? "",
  };
}

function newPlayer(r, id) {
  const player = {
    id,
    name: [clean(r["First Name"]), clean(r["Last Name"])].filter(Boolean).join(" "),
    level: DEFAULT_LEVEL,      // ค่าต่ำสุดใน config/lists — โค้ชปรับทีหลัง
    class: DEFAULT_CLASS,
    coach: "",
    image: "",
    linkedUserId: null,
    memberSince: displayDate(r["Created At"]),
    lastUpdate: displayDate(),
    developmentPlan: { currentFocus: [], next4Weeks: [], longTermGoal: "" },
    assessmentHistory: [],     // ใหม่ -> เก่า
    recentClasses: [],
    notes: [],
  };
  return KEEP_CSV_FIELDS ? { ...player, ...csvExtras(r) } : player;
}

initializeApp({ credential: cert(JSON.parse(fs.readFileSync(SERVICE_ACCOUNT, "utf8"))) });
const db = getFirestore();

// ค่าต่ำสุดจาก config/lists (ตัวแรกของรายการ) — fallback ตาม src/data/players.js
const listsSnap = await db.doc("config/lists").get();
const DEFAULT_LEVEL = listsSnap.data()?.levels?.[0] ?? "NG1";
const DEFAULT_CLASS = listsSnap.data()?.classes?.[0] ?? "Academy";

// อ่านทุกไฟล์ แล้วรวม — ID ซ้ำกันข้ามไฟล์ ใช้แถวจากไฟล์หลังสุด
const rowsById = new Map();
for (const path of CSV_PATHS) {
  const text = fs.readFileSync(path, "utf8");
  const delimiter = text.split("\n", 1)[0].includes(";") ? ";" : ","; // Excel บางเครื่อง save เป็น ;
  const fileRows = parse(text, { columns: true, skip_empty_lines: true, bom: true, delimiter, relax_column_count: true });
  for (const r of fileRows) if (clean(r["ID"])) rowsById.set(clean(r["ID"]), r);
  console.log(`${path}: ${fileRows.length} rows`);
}
const rows = [...rowsById.values()];
const selected = rows.filter((r) => clean(r["ID"]) && (ONLY_IDS.length ? ONLY_IDS.includes(clean(r["ID"])) : FILTER(r)));

// player ที่มีอยู่แล้ว — จับคู่ด้วย customerId (ถ้ามี) หรือชื่อ เพื่อไม่สร้างซ้ำ
const existingSnap = await db.collection(COLLECTION).get();
const byCustomerId = new Map();
const byName = new Map();
const ops = [];
let backfilled = 0;
existingSnap.forEach((doc) => {
  const d = doc.data();
  // player เดิมที่ level/class ว่าง -> เติมค่าต่ำสุด
  const fill = {};
  if (!d.level) fill.level = DEFAULT_LEVEL;
  if (!d.class) fill.class = DEFAULT_CLASS;
  if (Object.keys(fill).length) {
    ops.push({ type: "update", id: doc.id, data: fill });
    backfilled++;
  }
  if (d.customerId) byCustomerId.set(String(d.customerId), doc.id);
  if (d.name) byName.set(normName(d.name), doc.id);
});

let created = 0, updated = 0, skipped = 0;
for (const r of selected) {
  const cid = clean(r["ID"]);
  const name = normName([r["First Name"], r["Last Name"]].filter(Boolean).join(" "));
  const existingId = byCustomerId.get(cid) || byName.get(name);

  if (!existingId) {
    const id = newId();
    ops.push({ type: "create", id, data: newPlayer(r, id) });
    byName.set(name, id); // กันชื่อซ้ำใน CSV เอง
    created++;
  } else if (KEEP_CSV_FIELDS) {
    ops.push({ type: "update", id: existingId, data: csvExtras(r) }); // ไม่แตะข้อมูลโค้ช
    updated++;
  } else {
    skipped++;
  }
}

console.log(`Unique customers: ${rows.length} | Selected: ${selected.length} | Existing players: ${existingSnap.size}`);
console.log(`Create: ${created} | Update: ${updated} | Skip (มีอยู่แล้ว): ${skipped} | เติม level/class: ${backfilled}`);
console.log(`Default level/class: ${DEFAULT_LEVEL} / ${DEFAULT_CLASS}`);

if (!WRITE) {
  console.log("\nDry run — ตัวอย่าง:");
  console.dir(ops.slice(0, 2), { depth: 4 });
  console.log("\nใส่ --write เพื่อเขียนจริง");
  process.exit(0);
}

const BATCH_SIZE = 450;
for (let i = 0; i < ops.length; i += BATCH_SIZE) {
  const batch = db.batch();
  for (const op of ops.slice(i, i + BATCH_SIZE)) {
    const ref = db.collection(COLLECTION).doc(op.id);
    if (op.type === "create") batch.set(ref, op.data);
    else batch.set(ref, op.data, { merge: true });
  }
  await batch.commit();
  console.log(`Written ${Math.min(i + BATCH_SIZE, ops.length)}/${ops.length}`);
}
console.log("Done ✅");
