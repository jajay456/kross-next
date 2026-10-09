import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

// Names of users who can coach (coaches and admins), sorted. Users are only readable when
// signed in, so guests get an empty list.
export default function useCoachNames() {
  const { user } = useAuth();
  const [names, setNames] = useState([]);

  useEffect(() => {
    if (!user) {
      setNames([]);
      return;
    }
    const q = query(collection(db, "users"), where("role", "in", ["coach", "admin"]));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) =>
        setNames(
          [...new Set(snapshot.docs.map((d) => d.data().name).filter(Boolean))].sort((a, b) =>
            a.localeCompare(b)
          )
        ),
      (error) => console.error("Coaches onSnapshot error:", error)
    );
    return unsubscribe;
  }, [user]);

  return names;
}
