import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AppLayout from "../layouts/AppLayout";
import Sidebar from "../components/Sidebar";
import NotesPanel from "../components/NotesPanel";
import NotePlayerList from "../components/NotePlayerList";

export default function Notes({ players }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const selected = players.find((p) => p.id === id) ?? null;

  const allNotes = players
    .flatMap((p) =>
      p.notes.map((n) => ({
        ...n,
        playerId: p.id,
        playerName: p.name,
        playerImage: p.image,
      }))
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <AppLayout
      mobileView={id ? "detail" : "list"}
      sidebar={<Sidebar />}
      list={
        <NotePlayerList
          notes={allNotes}
          selectedId={id}
          onSelect={(pid) => navigate(`/notes/${pid}`)}
        />
      }
      detail={
        selected && (
          <div className="flex h-full flex-col">
            <div className="border-b border-neutral-200 px-5 py-5 sm:px-7">
              <button
                type="button"
                onClick={() => navigate("/notes")}
                className="mb-3 flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm
                           text-neutral-700 transition hover:bg-neutral-100"
              >
                <ArrowLeft size={18} />
                Back to notes
              </button>
              <h2 className="text-2xl font-bold tracking-tight">{selected.name}'s Notes</h2>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
              <NotesPanel notes={selected.notes} />
            </div>
          </div>
        )
      }
    />
  );
}
