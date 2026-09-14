import { Star } from "lucide-react";

export default function Stars({ value = 0, max = 5, onChange }) {
  const editable = typeof onChange === "function";

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1;
        const filled = n <= value;
        const icon = (
          <Star
            size={15}
            strokeWidth={1.5}
            className={filled ? "fill-lime-500 text-lime-500" : "text-neutral-300"}
          />
        );

        return editable ? (
          <button key={n} onClick={() => onChange(n)} aria-label={`${n} ดาว`}>
            {icon}
          </button>
        ) : (
          <span key={n}>{icon}</span>
        );
      })}
    </div>
  );
}