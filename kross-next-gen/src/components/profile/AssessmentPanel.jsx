import Stars from "./Stars";
import { ASSESSMENT_FIELDS } from "../../data/players";

export default function AssessmentPanel({ assessment }) {
  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-bold tracking-wide">LATEST ASSESSMENT</h2>
        <span className="text-xs text-neutral-500">{assessment.date || "—"}</span>
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
            <span className="text-neutral-400">ยังไม่มีคอมเมนต์</span>
          )}
        </p>
      </div>
    </div>
  );
}