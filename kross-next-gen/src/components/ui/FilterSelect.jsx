export default function FilterSelect({ label, value, options, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={`Filter by ${label.toLowerCase()}`}
      className={`min-w-0 flex-1 rounded-lg border px-2 py-1.5 text-xs outline-none transition focus:border-ink ${
        value ? "border-ink bg-lime-soft text-ink" : "border-neutral-300 text-neutral-600"
      }`}
    >
      <option value="">All {label}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
