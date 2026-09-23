import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { doc, getDocs, collection, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext(null);

const AUTH_ERROR_MESSAGES = {
  "auth/invalid-email": "That email address looks invalid.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/user-not-found": "No account found with that email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/email-already-in-use": "An account already exists with that email.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
};

const friendlyError = (error) =>
  AUTH_ERROR_MESSAGES[error?.code] || error?.message || "Something went wrong. Please try again.";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
      }
    });
    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const unsubscribeProfile = onSnapshot(
      doc(db, "users", user.uid),
      async (snap) => {
        if (snap.exists()) {
          setProfile({ id: snap.id, ...snap.data() });
          setLoading(false);
          return;
        }
        // Auth account exists but its profile doc is missing (e.g. an earlier
        // registration attempt was interrupted after sign-up but before the
        // Firestore write). Self-heal by creating it now.
        try {
          const usersSnap = await getDocs(collection(db, "users"));
          const role = usersSnap.empty ? "admin" : "user";
          await setDoc(doc(db, "users", user.uid), {
            name: user.displayName || user.email,
            email: user.email,
            role,
            title: role === "admin" ? "Admin" : "Member",
            image: "",
          });
        } catch (error) {
          console.error("Failed to create missing profile doc:", error);
          setProfile(null);
          setLoading(false);
        }
      },
      (error) => {
        console.error("Profile onSnapshot error:", error);
        setLoading(false);
      }
    );
    return unsubscribeProfile;
  }, [user]);

  const register = async (name, email, password) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name });

      const usersSnap = await getDocs(collection(db, "users"));
      const role = usersSnap.empty ? "admin" : "user";

      await setDoc(doc(db, "users", credential.user.uid), {
        name,
        email,
        role,
        title: role === "admin" ? "Admin" : "Member",
        image: "",
      });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: friendlyError(error) };
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: friendlyError(error) };
    }
  };

  const logout = () => signOut(auth);

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/login`,
        handleCodeInApp: true,
      });
      return { ok: true };
    } catch (error) {
      return { ok: false, error: friendlyError(error) };
    }
  };

  const updateUserProfile = async (data) => {
    if (!user) return { ok: false, error: "Not signed in." };
    try {
      if (data.name && data.name !== user.displayName) {
        await updateProfile(user, { displayName: data.name });
      }
      await updateDoc(doc(db, "users", user.uid), data);

      try {
        const linkedPlayers = await getDocs(
          query(collection(db, "players"), where("linkedUserId", "==", user.uid))
        );
        await Promise.all(
          linkedPlayers.docs.map((playerDoc) =>
            updateDoc(playerDoc.ref, {
              ...(data.name !== undefined ? { name: data.name } : {}),
              ...(data.image !== undefined ? { image: data.image } : {}),
            })
          )
        );
      } catch (syncError) {
        console.error("Failed to sync profile to linked player record:", syncError);
      }

      return { ok: true };
    } catch (error) {
      return { ok: false, error: friendlyError(error) };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!user) return { ok: false, error: "Not signed in." };
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: friendlyError(error) };
    }
  };

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === "admin",
    canManage: profile?.role === "admin" || profile?.role === "coach",
    register,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
