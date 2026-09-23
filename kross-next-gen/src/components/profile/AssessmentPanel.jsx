import { useState } from "react";
import { Pencil, Send, X } from "lucide-react";
import Stars from "./Stars";
import { ASSESSMENT_FIELDS } from "../../data/players";
import { useAuth } from "../../context/AuthContext";
import { formatDateTime } from "../../utils/datetime";

export default function AssessmentPanel({ assessment, onEdit, onAddComment, onDeleteComment, title = "LATEST ASSESSMENT" }) {
  const { profile, canManage } = useAuth();
  const canEdit = onEdit && canManage && assessment.coach === profile?.name;
  const [commentText, setCommentText] = useState("");

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(assessment.id, {
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
          <p className="mb-2 text-xs font-semibold text-neutral-500">Discussion</p>

          {(assessment.comments || []).length > 0 && (
            <div className="mb-3 flex flex-col gap-2">
              {assessment.comments.map((c) => {
                const canDeleteComment = onDeleteComment && canManage && c.author === profile?.name;
                return (
                  <div key={c.id} className="rounded-lg bg-neutral-50 px-3 py-2">
                    <p className="flex items-baseline justify-between gap-2">
                      <span className="text-xs font-semibold text-neutral-700">{c.author}</span>
                      <span className="flex shrink-0 items-center gap-2">
                        <span className="whitespace-nowrap text-[11px] text-neutral-400">{c.date}</span>
                        {canDeleteComment && (
                          <button
                            type="button"
                            onClick={() => onDeleteComment(c.id)}
                            aria-label="Delete comment"
                            className="text-neutral-400 transition hover:text-rose-600"
                          >
                            <X size={12} />
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
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a reply..."
                className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-ink"
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
      )}
    </div>
  );
}