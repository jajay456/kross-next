import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Sidebar from "../components/Sidebar";
import PlayerList from "../components/PlayerList";
import PlayerProfile from "../components/profile/PlayerProfile";
import AddPlayerModal from "../components/AddPlayerModal";
import AddUpdateModal from "../components/AddUpdateModal";
import EditPlanModal from "../components/EditPlanModal";

export default function Players({ players, onAddPlayer, onEditPlayer, onEditPlan, onAddAssessment, onAddClass, onAddNote }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(false);
  const [editingPlan, setEditingPlan] = useState(false);
  const [addingUpdate, setAddingUpdate] = useState(null);

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
            onEditPlan={() => setEditingPlan(true)}
            onAddUpdate={() => setAddingUpdate("assessment")}
            onAddAssessment={() => setAddingUpdate("assessment")}
            onAddClass={() => setAddingUpdate("class")}
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
    </>
  );
}
