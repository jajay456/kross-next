import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import AppLayout from "../layouts/AppLayout";
import Sidebar from "../components/Sidebar";
import Avatar from "../components/Avatar";
import AddPlayerModal from "../components/AddPlayerModal";
import FilterSelect from "../components/ui/FilterSelect";
import { useAuth } from "../context/AuthContext";
import { useConfirm } from "../context/ConfirmContext";
import useCoachNames from "../hooks/useCoachNames";
import { useLists } from "../context/ListsContext";

export default function ManagePlayers({ players, onAddPlayer, onEditPlayer, onDeletePlayer }) {
  const { canManage } = useAuth();
  const { levels, classes } = useLists();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ level: "", class: "", coach: "", linked: "" });
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const confirm = useConfirm();
  const coaches = useCoachNames();

  if (!canManage) {
    return <Navigate to="/players" replace />;
  }

  const setFilter = (key) => (value) => setFilters((f) => ({ ...f, [key]: value }));

  const q = query.trim().toLowerCase();
  const filteredPlayers = players
    .filter(
      (p) =>
        (p.name?.toLowerCase().includes(q) ||
          p.level?.toLowerCase().includes(q) ||
          p.class?.toLowerCase().includes(q) ||
          p.coach?.toLowerCase().includes(q)) &&
        (!filters.level || p.level === filters.level) &&
        (!filters.class || p.class === filters.class) &&
        (!filters.coach || p.coach === filters.coach) &&
        (!filters.linked || (filters.linked === "Linked") === Boolean(p.linkedUserId))
    )
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  const removePlayer = async (player) => {
    const confirmed = await confirm(
      `Delete ${player.name}? All of their assessments, classes and notes will be removed. This cannot be undone.`
    );
    if (!confirmed) return;
    onDeletePlayer(player.id).catch((error) => console.error("Failed to delete player:", error));
  };

  return (
    <>
      <AppLayout
        mobileView="list"
        fullWidthList
        sidebar={<Sidebar />}
        list={
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between gap-3 border-b border-neutral-200 px-5 py-5 sm:px-7">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Manage Players</h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Player records in this academy.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="flex shrink-0 items-center gap-1.5 rounded-xl bg-lime px-3 py-2 text-sm font-semibold
                           text-ink transition hover:brightness-95"
              >
                <Plus size={16} />
                Add Player
              </button>
            </div>

            <div className="border-b border-neutral-200 px-5 py-3 sm:px-7">
              <div className="flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-2">
                <Search size={16} className="shrink-0 text-neutral-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, level, class or coach"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-2 sm:flex-nowrap">
                <FilterSelect label="Levels" value={filters.level} options={levels} onChange={setFilter("level")} />
                <FilterSelect label="Classes" value={filters.class} options={classes} onChange={setFilter("class")} />
                <FilterSelect label="Coaches" value={filters.coach} options={coaches} onChange={setFilter("coach")} />
                <FilterSelect label="Accounts" value={filters.linked} options={["Linked", "Not linked"]} onChange={setFilter("linked")} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-7">
              <div className="flex flex-col divide-y divide-neutral-100">
                {filteredPlayers.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 py-4">
                    <Avatar name={p.name} src={p.image} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{p.name}</p>
                      <p className="truncate text-xs text-neutral-500">
                        {[p.level, p.class, p.coach].filter(Boolean).join(" · ")}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setEditing(p)}
                      aria-label={`Edit ${p.name}`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                                 text-neutral-500 transition hover:bg-neutral-100 hover:text-ink"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removePlayer(p)}
                      aria-label={`Delete ${p.name}`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                                 text-rose-500 transition hover:bg-rose-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
                {filteredPlayers.length === 0 && (
                  <p className="py-8 text-center text-sm text-neutral-400">
                    {players.length === 0 ? "No players yet." : "No players match your search."}
                  </p>
                )}
              </div>
            </div>
          </div>
        }
      />

      <AddPlayerModal
        standalone
        open={adding}
        onClose={() => setAdding(false)}
        onSubmit={(data) => {
          onAddPlayer(data, { openProfile: false });
          setAdding(false);
        }}
      />

      <AddPlayerModal
        key={`manage-edit-${editing?.id ?? "none"}`}
        standalone
        open={Boolean(editing)}
        initialData={editing}
        onClose={() => setEditing(null)}
        onSubmit={(data) => {
          onEditPlayer(editing.id, data);
          setEditing(null);
        }}
      />
    </>
  );
}
