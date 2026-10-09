import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const UsersContext = createContext({ byId: new Map(), byName: new Map() });

// One shared listener on the users collection, used to show live names and
// profile photos (e.g. comment authors). Users are only readable when signed in.
export function UsersProvider({ children }) {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user) {
      setUsers([]);
      return;
    }
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => setUsers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (error) => console.error("Users directory onSnapshot error:", error)
    );
    return unsubscribe;
  }, [user]);

  const value = useMemo(
    () => ({
      byId: new Map(users.map((u) => [u.id, u])),
      byName: new Map(users.filter((u) => u.name).map((u) => [u.name, u])),
    }),
    [users]
  );

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
}

// Older comments only stored the author's name, so fall back to matching by name.
export function useCommentAuthor(comment) {
  const { byId, byName } = useContext(UsersContext);
  return (comment.authorId && byId.get(comment.authorId)) || byName.get(comment.author) || null;
}
