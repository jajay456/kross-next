import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Sidebar from "../components/Sidebar";
import PlayerList from "../components/PlayerList";
import PlayerProfile from "../components/profile/PlayerProfile";
import AddPlayerModal from "../components/AddPlayerModal";


export default function Players({ players, onAddPlayer }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

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
            onEdit={() => console.log("edit", selected?.id)}
          />
        }
      />

      <AddPlayerModal
        open={adding}
        onClose={() => setAdding(false)}
        onSubmit={onAddPlayer}
      />
    </>
  );
}