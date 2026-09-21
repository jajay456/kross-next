export default function NotesPanel({ notes = [] }) {
  if (notes.length === 0) {
    return <p className="py-10 text-center text-sm text-neutral-400">No notes yet</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {notes.map((n) => (
        <div key={n.id} className="rounded-xl bg-neutral-50 p-4">
          <p className="mb-3 flex items-baseline justify-between gap-2 text-[11px] font-semibold tracking-wider text-neutral-500 uppercase">
            <span>{n.coach}</span>
            <span>{n.date}</span>
          </p>
          <p className="text-sm leading-relaxed text-neutral-800">{n.text}</p>
        </div>
      ))}
    </div>
  );
}
