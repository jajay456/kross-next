import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import Avatar from "./Avatar";
import Badge from "./ui/Badge";
import Stars from "./profile/Stars";
import { ASSESSMENT_FIELDS } from "../data/players";

const PAGE_SIZE = 6;

export default function AssessmentPlayerList({ assessments, selectedId, onSelect }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const q = query.trim().toLowerCase();
  const filtered = assessments.filter(
    (a) =>
      a.playerName.toLowerCase().includes(q) || a.date.toLowerCase().includes(q)
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
      <div className="border-b border-neutral-200 px-4 py-3">
        <div className="flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-2">
          <Search size={16} className="shrink-0 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name or date"
            className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col divide-y divide-neutral-100 overflow-y-auto">
      {filtered.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-neutral-400">No assessments found</p>
      ) : (
      pageItems.map((a) => {
        const active = a.playerId === selectedId;
        const avgNum =
          ASSESSMENT_FIELDS.reduce((sum, f) => sum + a[f.key], 0) / ASSESSMENT_FIELDS.length;
        const avg = avgNum.toFixed(1);

        return (
          <button
            key={a.id}
            onClick={() => onSelect(a.playerId)}
            className={`flex w-full shrink-0 items-center gap-4 px-4 py-5 text-left transition ${
              isFullPage ? "grow" : ""
            } ${
              active ? "bg-lime-soft" : "hover:bg-neutral-50"
            }`}
          >
            <Avatar name={a.playerName} src={a.playerImage} size="md" />
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold">
                  {a.date ?? "No assessment"}
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <Stars value={Math.round(avgNum)} />
                  <Badge tone={active ? "lime" : "outline"}>{avg} / 5</Badge>
                </span>
              </span>
              <span className="block truncate text-xs text-neutral-500">
                {a.playerName}
                <span className="text-neutral-400"> · {a.coachComment || "No coach comment"}</span>
              </span>
            </span>
          </button>
        );
      })
      )}
      </div>

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

