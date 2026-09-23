import AssessmentPanel from "./profile/AssessmentPanel";

export default function AssessmentList({ assessments, onEdit, onAddComment, onDeleteComment }) {
  return (
    <div className="flex flex-col gap-5">
      {assessments.map((a) => (
        <div key={a.id} className="rounded-xl border border-neutral-200 p-5 shadow-sm">
          <AssessmentPanel
            assessment={a}
            onEdit={onEdit}
            onAddComment={onAddComment}
            onDeleteComment={onDeleteComment ? (commentId) => onDeleteComment(a.id, commentId) : undefined}
            title="ASSESSMENT"
          />
        </div>
      ))}
    </div>
  );
}