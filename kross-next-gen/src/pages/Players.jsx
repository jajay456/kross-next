import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import Sidebar from "../components/Sidebar";
import PlayerList from "../components/PlayerList";
import PlayerProfile from "../components/profile/PlayerProfile";
import AddPlayerModal from "../components/AddPlayerModal";
import { PLAYERS, EMPTY_PLAYER_EXTRAS } from "../data/players";

const today = () =>
  new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function Players() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [players, setPlayers] = useState(PLAYERS);
  const [adding, setAdding] = useState(false);

  const selected = players.find((p) => p.id === id) ?? null;

  const addPlayer = (data) => {
    const newPlayer = {
      ...data,
      ...structuredClone(EMPTY_PLAYER_EXTRAS),
      id: `player_${crypto.randomUUID().slice(0, 8)}`,
      image: "",
      memberSince: today(),
      lastUpdate: today(),
    };
    setPlayers((prev) => [newPlayer, ...prev]);
    navigate(`/players/${newPlayer.id}`);
  };

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
        onSubmit={addPlayer}
      />
    </>
  );
}