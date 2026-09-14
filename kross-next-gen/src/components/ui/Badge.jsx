export default function Badge({ children, tone = "outline" }) {
  const style =
    tone === "lime"
      ? "border-lime bg-lime-soft text-lime-700"
      : "border-neutral-300 text-neutral-700";

  return (
    <span
      className={`inline-flex items-center rounded-lg border px-3 py-1
                  text-xs font-semibold ${style}`}
    >
      {children}
    </span>
  );
}