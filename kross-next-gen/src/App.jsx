import { Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, getDocs, onSnapshot, setDoc, updateDoc } from 'firebase/firestore'
import { db } from './firebase'
import { useAuth } from './context/AuthContext'
import Players from './pages/Players'
import { PLAYERS, EMPTY_PLAYER_EXTRAS } from "./data/players";
import Assessments from './pages/Assessments'
import Classes from './pages/Classes'
import Notes from './pages/Notes'
import Admin from './pages/Admin'
import ManageOptions from './pages/ManageOptions'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

  const today = () =>
  new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function App() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setPlayers([]);
      setLoading(true);
      return;
    }
    const playersRef = collection(db, 'players');

    const seedIfEmpty = async () => {
      const snap = await getDocs(playersRef);
      if (snap.empty) {
        await Promise.all(PLAYERS.map((p) => setDoc(doc(db, 'players', p.id), p)));
      }
    };
    seedIfEmpty().catch((error) => console.error("Firestore seed error:", error));

    const unsubscribe = onSnapshot(
      playersRef,
      (snapshot) => {
        setPlayers(snapshot.docs.map((d) => d.data()));
        setLoading(false);
      },
      (error) => {
        console.error("Firestore onSnapshot error:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  const playerRef = (id) => doc(db, 'players', id);

  const addPlayer = async (data) => {
    const { userId, ...playerData } = data;
    const newPlayer = {
      ...playerData,
      ...structuredClone(EMPTY_PLAYER_EXTRAS),
      id: `player_${crypto.randomUUID().slice(0, 8)}`,
      image: playerData.image || "",
      linkedUserId: userId || null,
      memberSince: today(),
      lastUpdate: today(),
    };
    await setDoc(playerRef(newPlayer.id), newPlayer);
    if (userId) {
      await updateDoc(doc(db, 'users', userId), { role: 'player' }).catch((error) =>
        console.error('Failed to update linked user role:', error)
      );
    }
    navigate(`/players/${newPlayer.id}`);
  };

  const addAssessment = async (playerId, data) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;
    await updateDoc(playerRef(playerId), {
      assessmentHistory: [
        { id: `assess_${crypto.randomUUID().slice(0, 8)}`, ...data },
        ...player.assessmentHistory,
      ],
    });
  };

  const editPlayer = async (playerId, data) => {
    const { userId, ...playerData } = data;
    const updates = { ...playerData, lastUpdate: today() };

    if ('userId' in data) {
      const player = players.find((p) => p.id === playerId);
      const previousLinkedUserId = player?.linkedUserId || null;
      const nextLinkedUserId = userId || null;
      updates.linkedUserId = nextLinkedUserId;

      if (previousLinkedUserId !== nextLinkedUserId) {
        if (previousLinkedUserId) {
          await updateDoc(doc(db, 'users', previousLinkedUserId), { role: 'user' }).catch((error) =>
            console.error('Failed to revert previous linked user role:', error)
          );
        }
        if (nextLinkedUserId) {
          await updateDoc(doc(db, 'users', nextLinkedUserId), { role: 'player' }).catch((error) =>
            console.error('Failed to update linked user role:', error)
          );
        }
      }
    }

    await updateDoc(playerRef(playerId), updates);
  };

  const deletePlayer = async (playerId) => {
    const player = players.find((p) => p.id === playerId);
    await deleteDoc(playerRef(playerId));
    if (player?.linkedUserId) {
      await updateDoc(doc(db, 'users', player.linkedUserId), { role: 'user' }).catch((error) =>
        console.error('Failed to revert linked user role:', error)
      );
    }
  };

  const editAssessment = async (playerId, data) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;
    await updateDoc(playerRef(playerId), {
      assessmentHistory: player.assessmentHistory.map((a) =>
        a.id === data.id ? { ...a, ...data } : a
      ),
    });
  };

  const addAssessmentComment = async (playerId, assessmentId, data) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;
    await updateDoc(playerRef(playerId), {
      assessmentHistory: player.assessmentHistory.map((a) =>
        a.id === assessmentId
          ? {
              ...a,
              comments: [
                ...(a.comments || []),
                { id: `comment_${crypto.randomUUID().slice(0, 8)}`, ...data },
              ],
            }
          : a
      ),
    });
  };

  const deleteAssessmentComment = async (playerId, assessmentId, commentId) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;
    await updateDoc(playerRef(playerId), {
      assessmentHistory: player.assessmentHistory.map((a) =>
        a.id === assessmentId
          ? { ...a, comments: (a.comments || []).filter((c) => c.id !== commentId) }
          : a
      ),
    });
  };

  const deleteAssessment = async (playerId, assessmentId) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;
    await updateDoc(playerRef(playerId), {
      assessmentHistory: player.assessmentHistory.filter((a) => a.id !== assessmentId),
    });
  };

  const editPlan = async (playerId, data) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;
    await updateDoc(playerRef(playerId), {
      developmentPlan: { ...player.developmentPlan, ...data },
      lastUpdate: today(),
    });
  };

  const addClass = async (playerId, data) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;
    await updateDoc(playerRef(playerId), {
      recentClasses: [
        { id: `class_${crypto.randomUUID().slice(0, 8)}`, ...data },
        ...player.recentClasses,
      ],
    });
  };

  const editClass = async (playerId, data) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;
    await updateDoc(playerRef(playerId), {
      recentClasses: player.recentClasses.map((c) =>
        c.id === data.id ? { ...c, ...data } : c
      ),
    });
  };

  const deleteClass = async (playerId, classId) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;
    await updateDoc(playerRef(playerId), {
      recentClasses: player.recentClasses.filter((c) => c.id !== classId),
    });
  };

  const addNote = async (playerId, data) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;
    await updateDoc(playerRef(playerId), {
      notes: [
        { id: `note_${crypto.randomUUID().slice(0, 8)}`, ...data },
        ...player.notes,
      ],
    });
  };

  const editNote = async (playerId, data) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;
    await updateDoc(playerRef(playerId), {
      notes: player.notes.map((n) => (n.id === data.id ? { ...n, ...data } : n)),
    });
  };

  const deleteNote = async (playerId, noteId) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;
    await updateDoc(playerRef(playerId), {
      notes: player.notes.filter((n) => n.id !== noteId),
    });
  };

  const addNoteComment = async (playerId, noteId, data) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;
    await updateDoc(playerRef(playerId), {
      notes: player.notes.map((n) =>
        n.id === noteId
          ? {
              ...n,
              comments: [
                ...(n.comments || []),
                { id: `comment_${crypto.randomUUID().slice(0, 8)}`, ...data },
              ],
            }
          : n
      ),
    });
  };

  const deleteNoteComment = async (playerId, noteId, commentId) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;
    await updateDoc(playerRef(playerId), {
      notes: player.notes.map((n) =>
        n.id === noteId
          ? { ...n, comments: (n.comments || []).filter((c) => c.id !== commentId) }
          : n
      ),
    });
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-ink text-sm text-neutral-400">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-ink text-sm text-neutral-400">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/players" replace />} />
        <Route path="/login" element={<Navigate to="/players" replace />} />
        <Route path="/register" element={<Navigate to="/players" replace />} />
        <Route path="/forgot-password" element={<Navigate to="/players" replace />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/players" element={<Players players={players} onAddPlayer={addPlayer} onEditPlayer={editPlayer} onDeletePlayer={deletePlayer} onEditPlan={editPlan} onAddAssessment={addAssessment} onEditAssessment={editAssessment} onDeleteAssessment={deleteAssessment} onAddClass={addClass} onEditClass={editClass} onDeleteClass={deleteClass} onAddNote={addNote} onEditNote={editNote} onDeleteNote={deleteNote} />} />
        <Route path="/players/:id" element={<Players players={players} onAddPlayer={addPlayer} onEditPlayer={editPlayer} onDeletePlayer={deletePlayer} onEditPlan={editPlan} onAddAssessment={addAssessment} onEditAssessment={editAssessment} onDeleteAssessment={deleteAssessment} onAddClass={addClass} onEditClass={editClass} onDeleteClass={deleteClass} onAddNote={addNote} onEditNote={editNote} onDeleteNote={deleteNote} />} />
        <Route path="/assessments" element={<Assessments players={players} onAddAssessment={addAssessment} onEditAssessment={editAssessment} onDeleteAssessment={deleteAssessment} onAddAssessmentComment={addAssessmentComment} onDeleteAssessmentComment={deleteAssessmentComment} />} />
        <Route path="/assessments/:id" element={<Assessments players={players} onAddAssessment={addAssessment} onEditAssessment={editAssessment} onDeleteAssessment={deleteAssessment} onAddAssessmentComment={addAssessmentComment} onDeleteAssessmentComment={deleteAssessmentComment} />} />
        <Route path="/classes" element={<Classes players={players} onEditClass={editClass} onDeleteClass={deleteClass} />} />
        <Route path="/classes/:id" element={<Classes players={players} onEditClass={editClass} onDeleteClass={deleteClass} />} />
        <Route path="/notes" element={<Notes players={players} onEditNote={editNote} onDeleteNote={deleteNote} onAddNoteComment={addNoteComment} onDeleteNoteComment={deleteNoteComment} />} />
        <Route path="/notes/:id" element={<Notes players={players} onEditNote={editNote} onDeleteNote={deleteNote} onAddNoteComment={addNoteComment} onDeleteNoteComment={deleteNoteComment} />} />
        <Route path="/admin" element={isAdmin ? <Admin /> : <Navigate to="/players" replace />} />
        <Route path="/settings" element={isAdmin ? <ManageOptions /> : <Navigate to="/players" replace />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/players" replace />} />
      </Routes>
    </>
  )
}

export default App
