import { Swords, Wrench, Shield, Activity } from "lucide-react";

const ICONS = {
  "Match Play": { Icon: Swords, color: "bg-amber-50 text-amber-600" },
  Technical: { Icon: Wrench, color: "bg-emerald-50 text-emerald-600" },
  Tactical: { Icon: Shield, color: "bg-rose-50 text-rose-600" },
  Physical: { Icon: Activity, color: "bg-sky-50 text-sky-600" },
};

const FALLBACK = { Icon: Activity, color: "bg-neutral-100 text-neutral-500" };

export default function ClassesPanel({ classes = [] }) {
  return (
    <div>
      <h2 className="mb-4 text-sm font-bold tracking-wide">RECENT CLASSES</h2>

      {classes.length === 0 ? (
        <p className="py-6 text-sm text-neutral-400">ยังไม่มีคลาส</p>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {classes.map((c) => {
            const { Icon, color } = ICONS[c.className] ?? FALLBACK;
            return (
              <li key={c.id} className="flex items-center gap-3 py-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color}`}
                >
                  <Icon size={15} />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {c.className}
                </span>
                <span className="hidden w-16 shrink-0 truncate text-xs text-neutral-500 sm:block">
                  {c.coach}
                </span>
                <span className="w-14 shrink-0 text-right text-xs text-neutral-500">
                  {c.duration} min
                </span>
                <span className="w-24 shrink-0 text-right text-xs text-neutral-500">
                  {c.date}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}