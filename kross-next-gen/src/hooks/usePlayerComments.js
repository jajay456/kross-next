import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

// Comments live in players/{playerId}/comments (one doc each, so security rules
// can check the author). Returns { [parentId]: comments[] }, oldest first.
export default function usePlayerComments(playerId) {
  const [byParent, setByParent] = useState({});

  useEffect(() => {
    if (!playerId) {
      setByParent({});
      return;
    }
    const unsubscribe = onSnapshot(
      collection(db, "players", playerId, "comments"),
      (snapshot) => {
        const grouped = {};
        snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (a.createdAt?.toMillis?.() ?? Infinity) - (b.createdAt?.toMillis?.() ?? Infinity))
          .forEach((c) => {
            (grouped[c.parentId] ||= []).push(c);
          });
        setByParent(grouped);
      },
      (error) => console.error("Comments onSnapshot error:", error)
    );
    return unsubscribe;
  }, [playerId]);

  return byParent;
}
