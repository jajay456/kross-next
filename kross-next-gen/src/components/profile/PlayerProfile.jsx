import { Plus, Star, Calendar, FileText, Pencil } from "lucide-react";
import ProfileHeader from "./ProfileHeader";
import PlanBox from "./PlanBox";
import AssessmentPanel from "./AssessmentPanel";
import ClassesPanel from "./ClassesPanel";
import { useAuth } from "../../context/AuthContext";

export default function PlayerProfile({
  player,
  onBack,
  onEdit,
  onDelete,
  onEditPlan,
  onAddUpdate,
  onAddAssessment,
  onEditAssessment,
  onAddClass,
  onEditClass,
  onAddNote,
}) {
  const { canManage } = useAuth();

  if (!player) {
    return (
      <div className="hidden h-full w-full items-center justify-center text-sm text-neutral-400 lg:flex">
        Select a player from the list
      </div>
    );
  }

  const plan = player.developmentPlan;

  return (
    <div className="w-full @container">
      <ProfileHeader player={player} onBack={onBack} onEdit={onEdit} onDelete={onDelete} />

      <div className="flex flex-col gap-7 px-5 py-6 sm:px-7">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-wide">DEVELOPMENT PLAN</h2>
            {canManage && (
              <button
                type="button"
                onClick={onEditPlan}
                className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 transition hover:text-ink"
              >
                <Pencil size={12} />
                Edit
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3 @lg:grid-cols-3">
            <PlanBox label="CURRENT FOCUS" items={plan.currentFocus} />
            <PlanBox label="NEXT 4 WEEKS" items={plan.next4Weeks} />
            <PlanBox label="LONG TERM GOAL" text={plan.longTermGoal} />
          </div>
        </section>

        <section className="grid grid-cols-1 items-start gap-4 @3xl:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 p-5">
            <AssessmentPanel assessment={player.assessmentHistory[0]} onEdit={onEditAssessment} />
          </div>
          <div className="rounded-xl border border-neutral-200 p-5">
            <ClassesPanel classes={player.recentClasses} onEdit={onEditClass} limit={4} />
          </div>
        </section>

        {canManage && (
          <section className="flex flex-col gap-3">
            <button
              onClick={onAddUpdate}
              className="flex items-center justify-center gap-2 rounded-xl bg-lime py-4
                         text-sm font-bold tracking-wide text-ink transition hover:brightness-95"
            >
              <Plus size={18} strokeWidth={2.5} />
              ADD UPDATE
            </button>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <QuickAction
                Icon={Star}
                title="Add Assessment"
                subtitle="Evaluate player performance"
                onClick={onAddAssessment}
              />
              <QuickAction
                Icon={Calendar}
                title="Add Training/Class"
                subtitle="Record a training session"
                onClick={onAddClass}
              />
              <QuickAction
                Icon={FileText}
                title="Add Note"
                subtitle="Add coach note or comment"
                onClick={onAddNote}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function QuickAction({ Icon, title, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4
                 text-left transition hover:border-neutral-400 hover:bg-neutral-50"
    >
      <Icon size={20} strokeWidth={1.5} className="shrink-0 text-neutral-700" />
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold">{title}</span>
        <span className="block truncate text-xs text-neutral-500">{subtitle}</span>
      </span>
    </button>
  );
}
