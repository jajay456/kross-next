import {Router, Route, Routes, Navigate} from 'react-router-dom'
import Players from './pages/Players'
import { useState } from 'react'
import { PLAYERS, EMPTY_PLAYER_EXTRAS } from "./data/players";
import { useNavigate } from "react-router-dom";
import Assessments from './pages/Assessments'
import Classes from './pages/Classes'
import Notes from './pages/Notes'
import Admin from './pages/Admin'
import Profile from './pages/Profile'
import Login from './pages/Login'

  const today = () =>
  new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function App() {
  const [players, setPlayers] = useState(PLAYERS);
  const navigate = useNavigate();

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

  const addAssessment = (playerId, data) => {
    setPlayers(prev => prev.map(p =>
      p.id !== playerId
        ? p
        : {
            ...p,
            assessmentHistory: [
              { id: `assess_${crypto.randomUUID().slice(0, 8)}`, ...data },
              ...p.assessmentHistory,
            ],
          }
    ))
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/players" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/players" element={<Players players={players} onAddPlayer={addPlayer} />} />
        <Route path="/players/:id" element={<Players players={players} onAddPlayer={addPlayer} />} />
        <Route path="/assessments" element={<Assessments players={players} onAddAssessment={addAssessment} />} />
        <Route path="/assessments/:id" element={<Assessments players={players} onAddAssessment={addAssessment} />} />
        <Route path="/classes" element={<Classes players={players} />} />
        <Route path="/classes/:id" element={<Classes players={players} />} />
        <Route path="/notes" element={<Notes players={players} />} />
        <Route path="/notes/:id" element={<Notes players={players} />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/players" replace />} />
      </Routes>
    </>
  )
}

export default App
