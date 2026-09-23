import { Pencil } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLists } from "../../context/ListsContext";
import { CLASS_TYPE_STYLE_MAP, FALLBACK_STYLE } from "../../data/classIcons";

export default function ClassesPanel({ classes = [], onEdit, limit }) {
  const { profile, canManage } = useAuth();
  const { classTypeIcons } = useLists();
  const visibleClasses = limit ? classes.slice(0, limit) : classes;

  return (
    <div>
      <h2 className="mb-4 text-sm font-bold tracking-wide">RECENT CLASSES</h2>

      {visibleClasses.length === 0 ? (
        <p className="py-6 text-sm text-neutral-400">No classes yet</p>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {visibleClasses.map((c) => {
            const { Icon, color } = CLASS_TYPE_STYLE_MAP[classTypeIcons?.[c.className]] ?? FALLBACK_STYLE;
            const canEdit = onEdit && canManage && c.coach === profile?.name;
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
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit(c)}
                    aria-label="Edit class"
                    className="-m-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                               text-neutral-400 transition hover:bg-neutral-100 hover:text-ink"
                  >
                    <Pencil size={14} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}