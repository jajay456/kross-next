import { useState } from "react";
import { Pencil, Send, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { formatDateTime } from "../utils/datetime";

export default function NotesPanel({ notes = [], onEdit, onAddComment, onDeleteComment }) {
  const { profile, canManage } = useAuth();

  if (notes.length === 0) {
    return <p className="py-10 text-center text-sm text-neutral-400">No notes yet</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {notes.map((n) => {
        const canEdit = onEdit && canManage && n.coach === profile?.name;
        return (
          <div key={n.id} className="rounded-xl bg-neutral-50 p-4">
            <p className="mb-3 flex items-baseline justify-between gap-2 text-[11px] font-semibold tracking-wider text-neutral-500 uppercase">
              <span>{n.coach}</span>
              <span className="flex items-center gap-3">
                {n.date}
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => onEdit(n)}
                    aria-label="Edit note"
                    className="-m-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full
                               normal-case text-neutral-400 transition hover:bg-neutral-200 hover:text-ink"
                  >
                    <Pencil size={13} />
                  </button>
                )}
              </span>
            </p>
            <p className="text-sm leading-relaxed text-neutral-800">{n.text}</p>

            {onAddComment && (
              <NoteDiscussion
                note={n}
                onAddComment={onAddComment}
                onDeleteComment={onDeleteComment}
                canManage={canManage}
                profile={profile}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function NoteDiscussion({ note, onAddComment, onDeleteComment, canManage, profile }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddComment(note.id, {
      author: profile?.name || "Unknown",
      text: text.trim(),
      date: formatDateTime(),
    });
    setText("");
  };

  return (
    <div className="mt-3 border-t border-neutral-200 pt-3">
      {(note.comments || []).length > 0 && (
        <div className="mb-3 flex flex-col gap-2">
          {note.comments.map((c) => {
            const canDeleteComment = onDeleteComment && canManage && c.author === profile?.name;
            return (
              <div key={c.id} className="rounded-lg bg-white px-3 py-2">
                <p className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-semibold text-neutral-700">{c.author}</span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="whitespace-nowrap text-[11px] text-neutral-400">{c.date}</span>
                    {canDeleteComment && (
                      <button
                        type="button"
                        onClick={() => onDeleteComment(note.id, c.id)}
                        aria-label="Delete comment"
                        className="-m-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full
                                   text-neutral-400 transition hover:bg-rose-50 hover:text-rose-600"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </span>
                </p>
                <p className="mt-0.5 text-sm leading-relaxed text-neutral-800">{c.text}</p>
              </div>
            );
          })}
        </div>
      )}

      {canManage && (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a reply..."
            className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-ink"
          />
          <button
            type="submit"
            aria-label="Post reply"
            className="flex shrink-0 items-center justify-center rounded-lg bg-ink px-3 text-white transition hover:bg-neutral-700"
          >
            <Send size={15} />
          </button>
        </form>
      )}
    </div>
  );
}
