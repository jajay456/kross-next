import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Sidebar from "../components/Sidebar";
import PlayerList from "../components/PlayerList";
import PlayerProfile from "../components/profile/PlayerProfile";
import AddPlayerModal from "../components/AddPlayerModal";
import AddUpdateModal from "../components/AddUpdateModal";
import EditPlanModal from "../components/EditPlanModal";
import EditEntryModal from "../components/EditEntryModal";

export default function Players({ players, onAddPlayer, onEditPlayer, onDeletePlayer, onEditPlan, onAddAssessment, onEditAssessment, onDeleteAssessment, onAddClass, onEditClass, onDeleteClass, onAddNote }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(false);
  const [editingPlan, setEditingPlan] = useState(false);
  const [addingUpdate, setAddingUpdate] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);

  const selected = players.find((p) => p.id === id) ?? null;

  return (
    <>
      <AppLayout
        mobileView={id ? "detail" : "list"}
        sidebar={<Sidebar />}
        list={
          <PlayerList
            players={players}
            selectedId={id}
            onSelect={(pid) => navigate(`/players/${pid}`)}
            onAdd={() => setAdding(true)}
          />
        }
        detail={
          <PlayerProfile
            player={selected}
            onBack={() => navigate("/players")}
            onEdit={() => setEditingPlayer(true)}
            onDelete={() => {
              onDeletePlayer(selected.id);
              navigate("/players");
            }}
            onEditPlan={() => setEditingPlan(true)}
            onAddUpdate={() => setAddingUpdate("assessment")}
            onAddAssessment={() => setAddingUpdate("assessment")}
            onEditAssessment={(a) => setEditingEntry({ type: "assessment", data: a })}
            onAddClass={() => setAddingUpdate("class")}
            onEditClass={(c) => setEditingEntry({ type: "class", data: c })}
            onAddNote={() => setAddingUpdate("note")}
          />
        }
      />

      <AddPlayerModal
        open={adding}
        onClose={() => setAdding(false)}
        onSubmit={onAddPlayer}
      />

      <AddPlayerModal
        key={`edit-player-${selected?.id ?? "none"}`}
        open={editingPlayer}
        initialData={selected}
        onClose={() => setEditingPlayer(false)}
        onSubmit={(data) => {
          onEditPlayer(selected.id, data);
          setEditingPlayer(false);
        }}
      />

      <EditPlanModal
        key={`edit-plan-${selected?.id ?? "none"}`}
        open={editingPlan}
        plan={selected?.developmentPlan}
        onClose={() => setEditingPlan(false)}
        onSubmit={(data) => {
          onEditPlan(selected.id, data);
          setEditingPlan(false);
        }}
      />

      <AddUpdateModal
        key={addingUpdate}
        open={!!addingUpdate}
        initialTab={addingUpdate || "assessment"}
        onClose={() => setAddingUpdate(null)}
        onAddAssessment={(data) => {
          onAddAssessment(selected.id, data);
          setAddingUpdate(null);
        }}
        onAddClass={(data) => {
          onAddClass(selected.id, data);
          setAddingUpdate(null);
        }}
        onAddNote={(data) => {
          onAddNote(selected.id, data);
          setAddingUpdate(null);
        }}
      />

      <EditEntryModal
        key={editingEntry ? `${editingEntry.type}-${editingEntry.data.id}` : "none"}
        open={Boolean(editingEntry)}
        type={editingEntry?.type}
        initialData={editingEntry?.data}
        onClose={() => setEditingEntry(null)}
        onSave={(data) => {
          if (editingEntry.type === "assessment") onEditAssessment(selected.id, data);
          else onEditClass(selected.id, data);
        }}
        onDelete={(id) => {
          if (editingEntry.type === "assessment") onDeleteAssessment(selected.id, id);
          else onDeleteClass(selected.id, id);
        }}
      />
    </>
  );
}
