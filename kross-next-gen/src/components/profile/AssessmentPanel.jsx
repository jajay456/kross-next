import { useState } from "react";
import { Pencil, Send } from "lucide-react";
import Stars from "./Stars";
import CommentThread from "../CommentThread";
import Avatar from "../Avatar";
import { ASSESSMENT_FIELDS } from "../../data/players";
import { useAuth } from "../../context/AuthContext";
import { formatDateTime } from "../../utils/datetime";

export default function AssessmentPanel({ assessment, onEdit, onAddComment, onDeleteComment, title = "LATEST ASSESSMENT" }) {
  const { user, profile, canManage } = useAuth();
  const canEdit = onEdit && canManage && assessment.coach === profile?.name;
  const [commentText, setCommentText] = useState("");

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(assessment.id, {
      authorId: user.uid,
      author: profile?.name || "Unknown",
      text: commentText.trim(),
      date: formatDateTime(),
    });
    setCommentText("");
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-bold tracking-wide">{title}</h2>
        <div className="flex shrink-0 items-center gap-3">
          <span className="whitespace-nowrap text-xs text-neutral-500">{assessment.date || "—"}</span>
          {canEdit && (
            <button
              type="button"
              onClick={() => onEdit(assessment)}
              className="flex items-center gap-1 text-xs font-medium text-neutral-500 transition hover:text-ink"
            >
              <Pencil size={12} />
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {ASSESSMENT_FIELDS.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-3">
            <span className="min-w-0 flex-1 truncate text-sm text-neutral-800">
              {label}
            </span>
            <Stars value={assessment[key]} />
            <span className="w-10 shrink-0 text-right text-xs text-neutral-600 tabular-nums">
              {assessment[key]} / 5
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl bg-neutral-50 p-4">
        <p className="mb-1.5 text-xs font-semibold text-lime-700">Coach comment</p>
        <p className="text-sm leading-relaxed text-neutral-800">
          {assessment.coachComment || (
            <span className="text-neutral-400">No comment yet</span>
          )}
        </p>
      </div>

      {onAddComment && (
        <div className="mt-4">
          <p className="mb-3 text-xs font-semibold text-neutral-500">
            Discussion
            {(assessment.comments || []).length > 0 && (
              <span className="ml-1.5 rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-500">
                {assessment.comments.length}
              </span>
            )}
          </p>

          <CommentThread comments={assessment.comments} onDelete={onDeleteComment} />

          {user && (
            <form onSubmit={handleAddComment} className="flex items-center gap-2.5">
              <Avatar name={profile?.name} src={profile?.image} size="sm" />
              <div className="flex flex-1 items-center gap-1 rounded-full border border-neutral-200 bg-white py-1 pl-4 pr-1
                              transition focus-within:border-ink focus-within:ring-2 focus-within:ring-lime/40">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="min-w-0 flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-neutral-400"
                />
                <button
                  type="submit"
                  aria-label="Post comment"
                  disabled={!commentText.trim()}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-white
                             transition hover:bg-neutral-700 disabled:bg-neutral-200 disabled:text-neutral-400"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}