import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Search, Trash2 } from "lucide-react";
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import AppLayout from "../layouts/AppLayout";
import Sidebar from "../components/Sidebar";
import Avatar from "../components/Avatar";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../data/users";

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const [staff, setStaff] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!isAdmin) return;
    const unsubscribe = onSnapshot(
      collection(db, "users"),
      (snapshot) => setStaff(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (error) => console.error("Users onSnapshot error:", error)
    );
    return unsubscribe;
  }, [isAdmin]);

  if (!isAdmin) {
    return <Navigate to="/players" replace />;
  }

  const q = query.trim().toLowerCase();
  const filteredStaff = staff.filter(
    (u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
  );

  const updateRole = (staffMember, role) => {
    if (role === staffMember.role) return;
    const confirmed = window.confirm(
      `Change ${staffMember.name}'s role from "${staffMember.role}" to "${role}"?`
    );
    if (!confirmed) return;
    updateDoc(doc(db, "users", staffMember.id), { role }).catch((error) =>
      console.error("Failed to update role:", error)
    );
  };

  const removeUser = (staffMember) => {
    const confirmed = window.confirm(
      `Remove ${staffMember.name} from the academy? They will lose access and their profile data will be deleted. This cannot be undone.`
    );
    if (!confirmed) return;
    deleteDoc(doc(db, "users", staffMember.id)).catch((error) =>
      console.error("Failed to delete user:", error)
    );
  };

  return (
    <AppLayout
      mobileView="list"
      fullWidthList
      sidebar={<Sidebar />}
      list={
        <div className="flex h-full flex-col">
          <div className="border-b border-neutral-200 px-5 py-5 sm:px-7">
            <h2 className="text-2xl font-bold tracking-tight">Manage Users</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Coaches and staff with access to this academy.
            </p>
          </div>

          <div className="border-b border-neutral-200 px-5 py-3 sm:px-7">
            <div className="flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-2">
              <Search size={16} className="shrink-0 text-neutral-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or email"
                className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-7">
            <div className="flex flex-col divide-y divide-neutral-100">
              {filteredStaff.map((u) => (
                <div key={u.id} className="flex items-center gap-3 py-4">
                  <Avatar name={u.name} src={u.image} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{u.name}</p>
                    <p className="truncate text-xs text-neutral-500">{u.email}</p>
                  </div>

                  <select
                    value={u.role}
                    onChange={(e) => updateRole(u, e.target.value)}
                    className="rounded-lg border border-neutral-300 px-2 py-1.5 text-sm
                               outline-none focus:border-ink"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>

                  {u.id !== user?.uid && (
                    <button
                      type="button"
                      onClick={() => removeUser(u)}
                      aria-label={`Remove ${u.name}`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                                 text-rose-500 transition hover:bg-rose-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
              {filteredStaff.length === 0 && (
                <p className="py-8 text-center text-sm text-neutral-400">
                  {staff.length === 0 ? "No staff found yet." : "No users match your search."}
                </p>
              )}
            </div>
          </div>
        </div>
      }
    />
  );
}
