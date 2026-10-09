import { useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import Avatar from "./Avatar";
import { useAuth } from "../context/AuthContext";
import { useCommentAuthor } from "../context/UsersContext";

const VISIBLE_COUNT = 3;

// Comments are stored oldest -> newest; when collapsed, show the latest few.
export default function CommentThread({ comments = [], onDelete, bubbleClassName = "bg-neutral-100" }) {
  const [expanded, setExpanded] = useState(false);
  if (comments.length === 0) return null;

  const hiddenCount = expanded ? 0 : Math.max(0, comments.length - VISIBLE_COUNT);
  const visible = comments.slice(hiddenCount);

  return (
    <div className="mb-3 flex flex-col gap-3">
      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex items-center gap-1.5 self-start rounded-full px-2 py-1 text-xs font-semibold
                     text-neutral-500 transition hover:bg-neutral-100 hover:text-ink"
        >
          <ChevronDown size={14} />
          See {hiddenCount} more {hiddenCount === 1 ? "comment" : "comments"}
        </button>
      )}

      {visible.map((c) => (
        <CommentItem key={c.id} comment={c} onDelete={onDelete} bubbleClassName={bubbleClassName} />
      ))}

      {expanded && comments.length > VISIBLE_COUNT && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="self-start rounded-full px-2 py-1 text-xs font-semibold text-neutral-500
                     transition hover:bg-neutral-100 hover:text-ink"
        >
          Show less
        </button>
      )}
    </div>
  );
}

function CommentItem({ comment, onDelete, bubbleClassName }) {
  const { user, profile } = useAuth();
  const author = useCommentAuthor(comment);
  const isMine = comment.authorId ? comment.authorId === user?.uid : comment.author === profile?.name;
  const canDelete = onDelete && user && isMine;
  const name = author?.name || comment.author;

  return (
    <div className="group flex animate-rise items-start gap-2.5">
      <Avatar name={name} src={author?.image} size="sm" />
      <div className="min-w-0 max-w-[85%]">
        <div className={`rounded-2xl rounded-tl-md px-3.5 py-2 ${isMine ? "bg-lime-soft" : bubbleClassName}`}>
          <p className="truncate text-xs font-semibold text-ink">
            {name}
            {author?.role && author.role !== "user" && (
              <span className="ml-1.5 font-medium capitalize text-neutral-400">· {author.role}</span>
            )}
          </p>
          <p className="mt-0.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-neutral-800">
            {comment.text}
          </p>
        </div>
        <div className="mt-1 flex h-5 items-center gap-2 px-1">
          <span className="text-[11px] text-neutral-400">{comment.date}</span>
          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(comment.id)}
              aria-label="Delete comment"
              className="flex items-center gap-1 rounded text-[11px] font-medium text-neutral-400 transition
                         hover:text-rose-600 focus:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <Trash2 size={11} />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
