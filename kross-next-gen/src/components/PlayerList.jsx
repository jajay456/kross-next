import { useState } from "react";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Avatar from "./Avatar";
import Badge from "./ui/Badge";
import { useAuth } from "../context/AuthContext";

const PAGE_SIZE = 9;

export default function PlayerList({ players, selectedId, onSelect, onAdd }) {
  const { canManage } = useAuth();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = players.filter((p) =>
    p.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSearch = (value) => {
    setQuery(value);
    setPage(1);
  };

  const isFullPage = pageItems.length === PAGE_SIZE;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-200 px-4 py-4">
        <h1 className="text-lg font-bold tracking-tight">Players</h1>
        {canManage && (
          <button
            type="button"
            onClick={onAdd}
            aria-label="Add player"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-white transition hover:bg-neutral-700"
          >
            <Plus size={18} />
          </button>
        )}
      </div>

      <div className="border-b border-neutral-200 px-4 py-3">
        <div className="flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-2">
          <Search size={16} className="shrink-0 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search players"
            className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />
        </div>
      </div>

      <ul className="flex flex-1 flex-col divide-y divide-neutral-100 overflow-y-auto">
        {filtered.length === 0 ? (
          <li className="px-4 py-10 text-center text-sm text-neutral-400">No players found</li>
        ) : (
          pageItems.map((p) => {
            const active = p.id === selectedId;
            return (
              <li key={p.id} className={`shrink-0 ${isFullPage ? "grow" : ""}`}>
                <button
                  type="button"
                  onClick={() => onSelect(p.id)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                    active ? "bg-lime-soft" : "hover:bg-neutral-50"
                  }`}
                >
                  <Avatar name={p.name} src={p.image} size="lg" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{p.name}</span>
                    <span className="block truncate text-xs text-neutral-500">{p.coach}</span>
                  </span>
                  <Badge tone={active ? "lime" : "outline"}>{p.level}</Badge>
                </button>
              </li>
            );
          })
        )}
      </ul>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-neutral-700
                       transition hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <ChevronLeft size={16} />
            Prev
          </button>

          <span className="text-xs text-neutral-500">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-neutral-700
                       transition hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
