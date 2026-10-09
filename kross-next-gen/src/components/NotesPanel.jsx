import { useState } from "react";
import { Pencil, Send } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import CommentThread from "./CommentThread";
import Avatar from "./Avatar";
import { formatDateTime } from "../utils/datetime";

export default function NotesPanel({ notes = [], onEdit, onAddComment, onDeleteComment }) {
  const { user, profile, canManage } = useAuth();

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
                user={user}
                profile={profile}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function NoteDiscussion({ note, onAddComment, onDeleteComment, user, profile }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddComment(note.id, {
      authorId: user.uid,
      author: profile?.name || "Unknown",
      text: text.trim(),
      date: formatDateTime(),
    });
    setText("");
  };

  return (
    <div className="mt-3 border-t border-neutral-200 pt-3">
      <CommentThread
        comments={note.comments}
        bubbleClassName="bg-white"
        onDelete={onDeleteComment && ((commentId) => onDeleteComment(note.id, commentId))}
      />

      {user && (
        <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
          <Avatar name={profile?.name} src={profile?.image} size="sm" />
          <div className="flex flex-1 items-center gap-1 rounded-full border border-neutral-200 bg-white py-1 pl-4 pr-1
                          transition focus-within:border-ink focus-within:ring-2 focus-within:ring-lime/40">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              className="min-w-0 flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-neutral-400"
            />
            <button
              type="submit"
              aria-label="Post comment"
              disabled={!text.trim()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-white
                         transition hover:bg-neutral-700 disabled:bg-neutral-200 disabled:text-neutral-400"
            >
              <Send size={14} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
