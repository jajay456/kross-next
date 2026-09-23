import { createContext, useContext, useEffect, useState } from "react";
import { deleteField, doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { LEVELS, CLASSES, CLASS_TYPES } from "../data/players";
import { DEFAULT_CLASS_TYPE_ICONS } from "../data/classIcons";
import { useAuth } from "./AuthContext";

const ListsContext = createContext(null);
const listsRef = doc(db, "config", "lists");

const DEFAULTS = {
  levels: LEVELS,
  classes: CLASSES,
  classTypes: CLASS_TYPES,
  classTypeIcons: DEFAULT_CLASS_TYPE_ICONS,
};

export function ListsProvider({ children }) {
  const { user } = useAuth();
  const [lists, setLists] = useState(DEFAULTS);

  useEffect(() => {
    if (!user) return;

    const seedIfEmpty = async () => {
      const snap = await getDoc(listsRef);
      if (!snap.exists()) {
        await setDoc(listsRef, DEFAULTS);
      }
    };
    seedIfEmpty().catch((error) => console.error("Failed to seed lists config:", error));

    const unsubscribe = onSnapshot(
      listsRef,
      (snap) => {
        if (snap.exists()) setLists({ ...DEFAULTS, ...snap.data() });
      },
      (error) => console.error("Lists onSnapshot error:", error)
    );
    return unsubscribe;
  }, [user]);

  const addValue = async (field, value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const current = lists[field] || [];
    if (current.includes(trimmed)) return;
    await updateDoc(listsRef, { [field]: [...current, trimmed] });
  };

  const removeValue = async (field, value) => {
    const current = lists[field] || [];
    const updates = { [field]: current.filter((v) => v !== value) };
    if (field === "classTypes") {
      updates[`classTypeIcons.${value}`] = deleteField();
    }
    await updateDoc(listsRef, updates);
  };

  const setClassTypeIcon = async (typeName, styleKey) => {
    await updateDoc(listsRef, { [`classTypeIcons.${typeName}`]: styleKey });
  };

  return (
    <ListsContext.Provider value={{ ...lists, addValue, removeValue, setClassTypeIcon }}>
      {children}
    </ListsContext.Provider>
  );
}

export const useLists = () => useContext(ListsContext);
