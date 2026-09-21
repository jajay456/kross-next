import { useState } from "react";
import { X } from "lucide-react";

const linesToList = (text) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const toForm = (plan) => ({
  currentFocus: (plan?.currentFocus ?? []).join("\n"),
  next4Weeks: (plan?.next4Weeks ?? []).join("\n"),
  longTermGoal: plan?.longTermGoal ?? "",
});

export default function EditPlanModal({ open, plan, onClose, onSubmit }) {
  const [form, setForm] = useState(toForm(plan));

  if (!open) return null;

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      currentFocus: linesToList(form.currentFocus),
      next4Weeks: linesToList(form.next4Weeks),
      longTermGoal: form.longTermGoal.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
          <h2 className="text-lg font-bold tracking-tight">Edit Development Plan</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto px-6 py-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-neutral-500">
              Current focus (one per line)
            </span>
            <textarea
              value={form.currentFocus}
              onChange={update("currentFocus")}
              rows={4}
              placeholder="Return under pressure&#10;First volley decisions"
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-ink"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-neutral-500">
              Next 4 weeks (one per line)
            </span>
            <textarea
              value={form.next4Weeks}
              onChange={update("next4Weeks")}
              rows={4}
              placeholder="Improve return consistency&#10;Play more aggressive first volley"
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-ink"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-neutral-500">Long term goal</span>
            <textarea
              value={form.longTermGoal}
              onChange={update("longTermGoal")}
              rows={3}
              placeholder="Become Thailand #1 and compete in international tournaments."
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-ink"
            />
          </label>
        </div>

        <div className="flex gap-3 border-t border-neutral-200 px-6 py-4">
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
            Save Plan
          </button>
        </div>
      </form>
    </div>
  );
}
