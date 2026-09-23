import { useEffect, useRef, useState } from "react";
import { X, Camera, Search } from "lucide-react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import Avatar from "./Avatar";
import { COACHES } from "../data/players";
import { resizeImageToDataUrl } from "../utils/image";
import { useAuth } from "../context/AuthContext";
import { useLists } from "../context/ListsContext";

const makeInitialForm = (levels, classes) => ({
  name: "",
  level: levels[0],
  class: classes[0],
  coach: COACHES[0],
  image: "",
});

export default function AddPlayerModal({ open, initialData, onClose, onSubmit }) {
  const { isAdmin } = useAuth();
  const { levels, classes } = useLists();
  const [form, setForm] = useState(initialData ?? (() => makeInitialForm(levels, classes)));
  const isEditing = Boolean(initialData);
  const restrictedEdit = isEditing && !isAdmin;
  const fileInputRef = useRef(null);

  const [coachNames, setCoachNames] = useState([]);
  useEffect(() => {
    const q = query(collection(db, "users"), where("role", "in", ["coach", "admin"]));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCoachNames(snapshot.docs.map((d) => d.data().name).filter(Boolean));
    });
    return unsubscribe;
  }, []);
  const coachOptions = coachNames.length ? coachNames : COACHES;

  const [candidateUsers, setCandidateUsers] = useState([]);
  useEffect(() => {
    if (!isAdmin) return;
    const roles = isEditing ? ["user", "player"] : ["user"];
    const q = query(collection(db, "users"), where("role", "in", roles));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCandidateUsers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsubscribe;
  }, [isAdmin, isEditing]);

  const [userSearch, setUserSearch] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Seed the linker with the player's existing linked account, once it loads.
  useEffect(() => {
    if (!isEditing || !isAdmin || !initialData?.linkedUserId || userSearch) return;
    const linked = candidateUsers.find((u) => u.id === initialData.linkedUserId);
    if (linked) {
      setForm((prev) => ({ ...prev, userId: linked.id }));
      setUserSearch(`${linked.name} (${linked.email})`);
    }
  }, [isEditing, isAdmin, initialData, candidateUsers, userSearch]);

  if (!open) return null;

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const filteredCandidates = (() => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return candidateUsers;
    return candidateUsers.filter(
      (u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  })();

  const handlePickUser = (picked) => {
    setForm((prev) => ({
      ...prev,
      userId: picked.id,
      name: picked.name || "",
      image: picked.image || prev.image,
    }));
    setUserSearch(`${picked.name} (${picked.email})`);
    setUserDropdownOpen(false);
  };

  const handleManualEntry = () => {
    setForm((prev) => ({ ...prev, userId: undefined, name: "" }));
    setUserSearch("");
    setUserDropdownOpen(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const image = await resizeImageToDataUrl(file);
    setForm((prev) => ({ ...prev, image }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
    setForm(makeInitialForm(levels, classes));
    setUserSearch("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">
            {isEditing ? "Edit Player" : "Add Player"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <Avatar name={form.name || "?"} src={form.image} size="lg" />
              {!restrictedEdit && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Change photo"
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center
                             rounded-full bg-ink text-white ring-2 ring-white transition hover:bg-neutral-700"
                >
                  <Camera size={13} />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            {!restrictedEdit && (
              <p className="text-xs text-neutral-500">
                Click the camera icon to {form.image ? "change" : "add"} a photo.
              </p>
            )}
          </div>

          {isAdmin && (
            <label className="relative flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-neutral-500">
                {isEditing ? "Linked user account" : "Link a registered user (optional)"}
              </span>
              <div className="flex items-center gap-2 rounded-lg border border-neutral-300 px-2 py-2 focus-within:border-ink">
                <Search size={15} className="shrink-0 text-neutral-400" />
                <input
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value);
                    setUserDropdownOpen(true);
                    if (form.userId) setForm((prev) => ({ ...prev, userId: undefined }));
                  }}
                  onFocus={() => setUserDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setUserDropdownOpen(false), 120)}
                  placeholder="Search registered users by name or email..."
                  className="w-full text-sm outline-none placeholder:text-neutral-400"
                />
              </div>

              {userDropdownOpen && (
                <div className="absolute top-full z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={handleManualEntry}
                    className="block w-full px-3 py-2 text-left text-sm text-neutral-500 hover:bg-neutral-50"
                  >
                    — Enter name manually —
                  </button>
                  {filteredCandidates.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handlePickUser(u)}
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-neutral-50 ${
                        form.userId === u.id ? "bg-lime-soft" : ""
                      }`}
                    >
                      {u.name} <span className="text-neutral-400">({u.email})</span>
                    </button>
                  ))}
                  {filteredCandidates.length === 0 && (
                    <p className="px-3 py-2 text-xs text-neutral-400">
                      {candidateUsers.length === 0
                        ? "No registered users available to link yet."
                        : "No matching users."}
                    </p>
                  )}
                </div>
              )}
            </label>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-neutral-500">Name</span>
            <input
              value={form.name}
              onChange={update("name")}
              required
              readOnly={restrictedEdit || Boolean(form.userId)}
              placeholder="Player name"
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-ink
                         read-only:bg-neutral-50 read-only:text-neutral-500"
            />
          </label>

          <div className="grid grid-cols-3 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-neutral-500">Level</span>
              <select
                value={form.level}
                onChange={update("level")}
                className="rounded-lg border border-neutral-300 px-2 py-2 text-sm outline-none focus:border-ink"
              >
                {levels.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-neutral-500">Class</span>
              <select
                value={form.class}
                onChange={update("class")}
                className="rounded-lg border border-neutral-300 px-2 py-2 text-sm outline-none focus:border-ink"
              >
                {classes.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-neutral-500">Coach</span>
              <select
                value={form.coach}
                onChange={update("coach")}
                className="rounded-lg border border-neutral-300 px-2 py-2 text-sm outline-none focus:border-ink"
              >
                {coachOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-lime py-3 text-sm font-bold tracking-wide text-ink transition hover:brightness-95"
        >
          {isEditing ? "Save Changes" : "Add Player"}
        </button>
      </form>
    </div>
  );
}
