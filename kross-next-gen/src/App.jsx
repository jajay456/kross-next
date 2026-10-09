import { Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from './firebase'
import { useAuth } from './context/AuthContext'
import Players from './pages/Players'
import { PLAYERS, EMPTY_PLAYER_EXTRAS } from "./data/players";
import Assessments from './pages/Assessments'
import Classes from './pages/Classes'
import Notes from './pages/Notes'
import Admin from './pages/Admin'
import ManageOptions from './pages/ManageOptions'
import ManagePlayers from './pages/ManagePlayers'
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
  const { user, loading: authLoading, isAdmin, canManage } = useAuth();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Players are publicly readable, so guests can browse without logging in.
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'players'),
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
    // A failed listener (e.g. permission denied) never retries, so resubscribe
    // whenever the signed-in user changes.
  }, [user?.uid]);

  // Only coaches/admins are allowed to write, so only they can seed.
  useEffect(() => {
    if (!canManage) return;
    const playersRef = collection(db, 'players');
    const seedIfEmpty = async () => {
      const snap = await getDocs(playersRef);
      if (snap.empty) {
        await Promise.all(PLAYERS.map((p) => setDoc(doc(db, 'players', p.id), p)));
      }
    };
    seedIfEmpty().catch((error) => console.error("Firestore seed error:", error));
  }, [canManage]);

  const playerRef = (id) => doc(db, 'players', id);
  const commentsRef = (playerId) => collection(db, 'players', playerId, 'comments');

  // Comments are separate docs so rules can restrict them to their author.
  const addComment = async (playerId, parentId, data) => {
    await addDoc(commentsRef(playerId), { ...data, parentId, createdAt: serverTimestamp() });
  };

  const deleteComment = async (playerId, commentId) => {
    await deleteDoc(doc(db, 'players', playerId, 'comments', commentId));
  };

  // Removes the comments under one note/assessment, or all of a player's.
  const deleteCommentsFor = async (playerId, parentId) => {
    const q = parentId ? query(commentsRef(playerId), where('parentId', '==', parentId)) : commentsRef(playerId);
    const snap = await getDocs(q);
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
  };

  // Linking a player never demotes an existing coach/admin — only a plain
  // "user" account gets promoted to "player". Reverting only resets the role
  // back if it's still "player" (i.e. our own promotion did it), so a coach/
  // admin who was linked without a role change never gets downgraded.
  const promoteLinkedUserIfPlain = async (userId, userRole) => {
    if (!userId || userRole !== 'user') return;
    await updateDoc(doc(db, 'users', userId), { role: 'player' }).catch((error) =>
      console.error('Failed to update linked user role:', error)
    );
  };

  const revertLinkedUserRoleIfPlayer = async (userId) => {
    if (!userId) return;
    const snap = await getDoc(doc(db, 'users', userId));
    if (snap.exists() && snap.data().role === 'player') {
      await updateDoc(doc(db, 'users', userId), { role: 'user' }).catch((error) =>
        console.error('Failed to revert linked user role:', error)
      );
    }
  };

  const addPlayer = async (data, { openProfile = true } = {}) => {
    const { userId, userRole, ...playerData } = data;
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
    await promoteLinkedUserIfPlain(userId, userRole);
    if (openProfile) navigate(`/players/${newPlayer.id}`);
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
    const { userId, userRole, ...playerData } = data;
    const updates = { ...playerData, lastUpdate: today() };

    if ('userId' in data) {
      const player = players.find((p) => p.id === playerId);
      const previousLinkedUserId = player?.linkedUserId || null;
      const nextLinkedUserId = userId || null;
      updates.linkedUserId = nextLinkedUserId;

      if (previousLinkedUserId !== nextLinkedUserId) {
        await revertLinkedUserRoleIfPlayer(previousLinkedUserId);
        await promoteLinkedUserIfPlain(nextLinkedUserId, userRole);
      }
    }

    await updateDoc(playerRef(playerId), updates);
  };

  const deletePlayer = async (playerId) => {
    const player = players.find((p) => p.id === playerId);
    await deleteCommentsFor(playerId);
    await deleteDoc(playerRef(playerId));
    await revertLinkedUserRoleIfPlayer(player?.linkedUserId);
  };

  const editAssessment = async (playerId, { comments: _comments, ...data }) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;
    await updateDoc(playerRef(playerId), {
      assessmentHistory: player.assessmentHistory.map((a) =>
        a.id === data.id ? { ...a, ...data } : a
      ),
    });
  };

  const addAssessmentComment = (playerId, assessmentId, data) => addComment(playerId, assessmentId, data);

  const deleteAssessmentComment = (playerId, _assessmentId, commentId) => deleteComment(playerId, commentId);

  const deleteAssessment = async (playerId, assessmentId) => {
    const player = players.find((p) => p.id === playerId);
    if (!player) return;
    await updateDoc(playerRef(playerId), {
      assessmentHistory: player.assessmentHistory.filter((a) => a.id !== assessmentId),
    });
    await deleteCommentsFor(playerId, assessmentId);
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

  const editNote = async (playerId, { comments: _comments, ...data }) => {
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
    await deleteCommentsFor(playerId, noteId);
  };

  const addNoteComment = (playerId, noteId, data) => addComment(playerId, noteId, data);

  const deleteNoteComment = (playerId, _noteId, commentId) => deleteComment(playerId, commentId);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-ink text-sm text-neutral-400">
        Loading...
      </div>
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
        <Route path="/login" element={user ? <Navigate to="/players" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/players" replace /> : <Register />} />
        <Route path="/forgot-password" element={user ? <Navigate to="/players" replace /> : <ForgotPassword />} />
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
        <Route path="/manage-players" element={<ManagePlayers players={players} onAddPlayer={addPlayer} onEditPlayer={editPlayer} onDeletePlayer={deletePlayer} />} />
        <Route path="/settings" element={isAdmin ? <ManageOptions /> : <Navigate to="/players" replace />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/players" replace />} />
      </Routes>
    </>
  )
}

export default App
