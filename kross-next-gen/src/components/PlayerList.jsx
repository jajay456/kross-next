import { useState } from "react";
import { Plus, Search } from "lucide-react";
import Avatar from "./Avatar";
import Badge from "./ui/Badge";

export default function PlayerList({ players, selectedId, onSelect, onAdd }) {
  const [query, setQuery] = useState("");

  const filtered = players.filter((p) =>
    p.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-200 px-4 py-4">
        <h1 className="text-lg font-bold tracking-tight">Players</h1>
        <button
          type="button"
          onClick={onAdd}
          aria-label="Add player"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-white transition hover:bg-neutral-700"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="border-b border-neutral-200 px-4 py-3">
        <div className="flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-2">
          <Search size={16} className="shrink-0 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search players"
            className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />
        </div>
      </div>

      <ul className="flex-1 divide-y divide-neutral-100 overflow-y-auto">
        {filtered.length === 0 ? (
          <li className="px-4 py-10 text-center text-sm text-neutral-400">ไม่พบผู้เล่น</li>
        ) : (
          filtered.map((p) => {
            const active = p.id === selectedId;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => onSelect(p.id)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${
                    active ? "bg-lime-soft" : "hover:bg-neutral-50"
                  }`}
                >
                  <Avatar name={p.name} src={p.image} size="sm" />
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
    </div>
  );
}
