import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AppLayout from "../layouts/AppLayout";
import Sidebar from "../components/Sidebar";
import AssessmentList from "../components/AssessmentList";
import AssessmentPlayerList from "../components/AssessmentPlayerList";
import EditEntryModal from "../components/EditEntryModal";

export default function Assessments({ players, onAddAssessment, onEditAssessment, onDeleteAssessment, onAddAssessmentComment, onDeleteAssessmentComment }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(null);

  const selected = players.find((p) => p.id === id) ?? null;

  const allAssessments = players
  .flatMap((p) =>
    p.assessmentHistory.map((a) => ({
      ...a,
      playerId: p.id,
      playerName: p.name,
      playerImage: p.image,
    }))
  )
  .sort((a, b) => new Date(b.date) - new Date(a.date)); 

  return (
    <>
      <AppLayout
        mobileView={id ? "detail" : "list"}
        sidebar={<Sidebar />}
        list={
        <AssessmentPlayerList
            assessments={allAssessments}
            selectedId={id}
            onSelect={(pid) => navigate(`/assessments/${pid}`)}
        />
        }

        detail={
          selected && (
            <div className="flex h-full flex-col">
              <div className="border-b border-neutral-200 px-5 py-5 sm:px-7">
                <button
                  type="button"
                  onClick={() => navigate("/assessments")}
                  className="mb-3 flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm
                             text-neutral-700 transition hover:bg-neutral-100"
                >
                  <ArrowLeft size={18} />
                  Back to assessments
                </button>
                <h2 className="text-2xl font-bold tracking-tight">
                  {selected.name}'s Assessments
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
                <AssessmentList
                  assessments={selected.assessmentHistory}
                  onEdit={(a) => setEditing(a)}
                  onAddComment={(assessmentId, data) =>
                    onAddAssessmentComment(selected.id, assessmentId, data)
                  }
                  onDeleteComment={(assessmentId, commentId) =>
                    onDeleteAssessmentComment(selected.id, assessmentId, commentId)
                  }
                />
              </div>
            </div>
          )
        }
      />

      <EditEntryModal
        key={editing?.id ?? "none"}
        open={Boolean(editing)}
        type="assessment"
        initialData={editing}
        onClose={() => setEditing(null)}
        onSave={(data) => onEditAssessment(selected.id, data)}
        onDelete={(id) => onDeleteAssessment(selected.id, id)}
      />
    </>
  );
}