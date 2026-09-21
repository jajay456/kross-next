import AssessmentPanel from "./profile/AssessmentPanel";

export default function AssessmentList({ assessments }) {
  return (
    <div className="flex flex-col divide-y divide-neutral-100">
      {assessments.map((a) => (
        <div key={a.id} className="py-6 first:pt-0">
          <AssessmentPanel assessment={a} />
        </div>
      ))}
    </div>
  );
}