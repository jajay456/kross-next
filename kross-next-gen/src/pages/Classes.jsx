import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AppLayout from "../layouts/AppLayout";
import Sidebar from "../components/Sidebar";
import ClassesPanel from "../components/profile/ClassesPanel";
import ClassPlayerList from "../components/ClassPlayerList";
import EditEntryModal from "../components/EditEntryModal";

export default function Classes({ players, onEditClass, onDeleteClass }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(null);

  const selected = players.find((p) => p.id === id) ?? null;

  const allClasses = players
    .flatMap((p) =>
      p.recentClasses.map((c) => ({
        ...c,
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
        <ClassPlayerList
          classes={allClasses}
          selectedId={id}
          onSelect={(pid) => navigate(`/classes/${pid}`)}
        />
      }
      detail={
        selected && (
          <div className="flex h-full flex-col">
            <div className="border-b border-neutral-200 px-5 py-5 sm:px-7">
              <button
                type="button"
                onClick={() => navigate("/classes")}
                className="mb-3 flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm
                           text-neutral-700 transition hover:bg-neutral-100"
              >
                <ArrowLeft size={18} />
                Back to classes
              </button>
              <h2 className="text-2xl font-bold tracking-tight">
                {selected.name}'s Training Classes
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
              <ClassesPanel
                classes={selected.recentClasses}
                onEdit={(c) => setEditing(c)}
              />
            </div>
          </div>
        )
      }
    />

      <EditEntryModal
        key={editing?.id ?? "none"}
        open={Boolean(editing)}
        type="class"
        initialData={editing}
        onClose={() => setEditing(null)}
        onSave={(data) => onEditClass(selected.id, data)}
        onDelete={(id) => onDeleteClass(selected.id, id)}
      />
    </>
  );
}
