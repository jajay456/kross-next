import { Swords, Wrench, Shield, Activity, Star, Zap, Target, Dumbbell, Users, BookOpen } from "lucide-react";

export const CLASS_TYPE_STYLES = [
  { key: "swords-amber", Icon: Swords, color: "bg-amber-50 text-amber-600" },
  { key: "wrench-emerald", Icon: Wrench, color: "bg-emerald-50 text-emerald-600" },
  { key: "shield-rose", Icon: Shield, color: "bg-rose-50 text-rose-600" },
  { key: "activity-sky", Icon: Activity, color: "bg-sky-50 text-sky-600" },
  { key: "star-violet", Icon: Star, color: "bg-violet-50 text-violet-600" },
  { key: "zap-orange", Icon: Zap, color: "bg-orange-50 text-orange-600" },
  { key: "target-teal", Icon: Target, color: "bg-teal-50 text-teal-600" },
  { key: "dumbbell-pink", Icon: Dumbbell, color: "bg-pink-50 text-pink-600" },
  { key: "users-indigo", Icon: Users, color: "bg-indigo-50 text-indigo-600" },
  { key: "bookopen-lime", Icon: BookOpen, color: "bg-lime-50 text-lime-700" },
];

export const CLASS_TYPE_STYLE_MAP = Object.fromEntries(CLASS_TYPE_STYLES.map((s) => [s.key, s]));

export const DEFAULT_CLASS_TYPE_ICONS = {
  "Match Play": "swords-amber",
  Technical: "wrench-emerald",
  Tactical: "shield-rose",
  Physical: "activity-sky",
  "Group Class": "users-indigo",
  "Intro Class": "bookopen-lime",
};

export const FALLBACK_STYLE = { Icon: Activity, color: "bg-neutral-100 text-neutral-500" };
