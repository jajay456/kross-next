import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import { ASSESSMENT_FIELDS } from "../data/players";
import { useLists } from "../context/ListsContext";

const TITLES = {
  assessment: "Edit Assessment",
  class: "Edit Training Class",
  note: "Edit Note",
};

const CONFIRM_MESSAGES = {
  assessment: "Delete this assessment? This cannot be undone.",
  class: "Delete this training class? This cannot be undone.",
  note: "Delete this note? This cannot be undone.",
};

export default function EditEntryModal({ open, type, initialData, onClose, onSave, onDelete }) {
  const { classTypes } = useLists();
  const [form, setForm] = useState(initialData || {});

  if (!open || !initialData) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const handleDelete = () => {
    if (!window.confirm(CONFIRM_MESSAGES[type])) return;
    onDelete(initialData.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold tracking-tight">{TITLES[type]}</h2>
            <p className="text-xs text-neutral-500">By {form.coach}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          {type === "assessment" && (
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-neutral-500">Assessment date</span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                  className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-ink"
                />
              </label>

              <div>
                <p className="mb-2 text-xs font-semibold tracking-wide text-neutral-500">
                  EVALUATION (1-5)
                </p>
                <div className="flex flex-col gap-3">
                  {ASSESSMENT_FIELDS.map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="w-36 shrink-0 text-sm text-neutral-700">{label}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setForm((p) => ({ ...p, [key]: n }))}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-medium transition ${
                              form[key] === n
                                ? "border-lime bg-lime text-ink"
                                : "border-neutral-300 text-neutral-600 hover:border-neutral-400"
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-neutral-500">
                  General comment (optional)
                </span>
                <textarea
                  value={form.coachComment}
                  onChange={(e) => setForm((p) => ({ ...p, coachComment: e.target.value }))}
                  rows={3}
                  className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-ink"
                />
              </label>
            </div>
          )}

          {type === "class" && (
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-neutral-500">Class type</span>
                <select
                  value={form.className}
                  onChange={(e) => setForm((p) => ({ ...p, className: e.target.value }))}
                  className="rounded-lg border border-neutral-300 px-2 py-2 text-sm outline-none focus:border-ink"
                >
                  {classTypes.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-neutral-500">Duration (min)</span>
                  <input
                    type="number"
                    min={15}
                    step={15}
                    value={form.duration}
                    onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
                    className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-ink"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-neutral-500">Date</span>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                    className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-ink"
                  />
                </label>
              </div>
            </div>
          )}

          {type === "note" && (
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-neutral-500">Note</span>
                <textarea
                  value={form.text}
                  onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
                  rows={4}
                  required
                  className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-ink"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-neutral-500">Date</span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                  className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-ink"
                />
              </label>
            </div>
          )}
        </div>

        <div className="flex gap-3 border-t border-neutral-200 px-6 py-4">
          {onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              aria-label="Delete"
              className="flex items-center justify-center rounded-xl border border-rose-200 px-3.5
                         text-rose-600 transition hover:bg-rose-50"
            >
              <Trash2 size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-neutral-300 py-3 text-sm font-medium
                       text-neutral-700 transition hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-xl bg-lime py-3 text-sm font-bold tracking-wide
                       text-ink transition hover:brightness-95"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
