import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Sidebar from "../components/Sidebar";
import PlayerList from "../components/PlayerList";
import PlayerProfile from "../components/profile/PlayerProfile";
import AddPlayerModal from "../components/AddPlayerModal";
import AddUpdateModal from "../components/AddUpdateModal";

export default function Players({ players, onAddPlayer, onEditPlayer, onAddAssessment, onAddClass, onAddNote }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(false);
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
        key={selected?.id ?? "none"}
        open={editingPlayer}
        initialData={selected}
        onClose={() => setEditingPlayer(false)}
        onSubmit={(data) => {
          onEditPlayer(selected.id, data);
          setEditingPlayer(false);
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
