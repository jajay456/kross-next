export default function PlanBox({ label, items, text }) {
  return (
    <div className="rounded-xl bg-neutral-50 p-4">
      <p className="mb-3 text-[11px] font-semibold tracking-wider text-neutral-500">
        {label}
      </p>

      {text !== undefined ? (
        <p className="text-sm leading-relaxed text-neutral-800">
          {text || <span className="text-neutral-400">No data yet</span>}
        </p>
      ) : items?.length ? (
        <ul className="flex flex-col gap-1.5">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-neutral-800">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neutral-800" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-neutral-400">No data yet</p>
      )}
    </div>
  );
}