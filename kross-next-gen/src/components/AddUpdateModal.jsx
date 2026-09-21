import { useState } from "react";
import { X, Star, Calendar, FileText } from "lucide-react";
import { ASSESSMENT_FIELDS, CLASS_TYPES, COACHES } from "../data/players";

const today = () => new Date().toISOString().slice(0, 10);

const TABS = [
  { key: "assessment", label: "Assessment", subtitle: "Evaluate performance", Icon: Star },
  { key: "class", label: "Training / Class", subtitle: "Record a session", Icon: Calendar },
  { key: "note", label: "Note", subtitle: "Add comment", Icon: FileText },
];

const initialAssessmentForm = () => ({
  date: today(),
  coach: COACHES[0],
  coachComment: "",
  ...Object.fromEntries(ASSESSMENT_FIELDS.map((f) => [f.key, 0])),
});

const initialClassForm = () => ({
  className: CLASS_TYPES[0],
  coach: COACHES[0],
  duration: 60,
  date: today(),
});

const initialNoteForm = () => ({
  coach: COACHES[0],
  text: "",
  date: today(),
});

export default function AddUpdateModal({
  open,
  initialTab = "assessment",
  onClose,
  onAddAssessment,
  onAddClass,
  onAddNote,
}) {
  const [tab, setTab] = useState(initialTab);
  const [assessmentForm, setAssessmentForm] = useState(initialAssessmentForm);
  const [classForm, setClassForm] = useState(initialClassForm);
  const [noteForm, setNoteForm] = useState(initialNoteForm);

  if (!open) return null;

  const close = () => {
    setAssessmentForm(initialAssessmentForm());
    setClassForm(initialClassForm());
    setNoteForm(initialNoteForm());
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tab === "assessment") {
      onAddAssessment(assessmentForm);
    } else if (tab === "class") {
      onAddClass({ ...classForm, duration: Number(classForm.duration) });
    } else {
      if (!noteForm.text.trim()) return;
      onAddNote(noteForm);
    }
    close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={close} />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
          <h2 className="text-lg font-bold tracking-tight">Add Update</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <p className="mb-3 text-xs font-semibold tracking-wide text-neutral-500">
            WHAT DO YOU WANT TO ADD?
          </p>
          <div className="grid grid-cols-3 gap-3">
            {TABS.map(({ key, label, subtitle, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition ${
                  tab === key
                    ? "border-lime bg-lime-soft"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <Icon size={18} className={tab === key ? "text-lime-600" : "text-neutral-500"} />
                <span>
                  <span className="block text-sm font-semibold">{label}</span>
                  <span className="block text-xs text-neutral-500">{subtitle}</span>
                </span>
              </button>
            ))}
          </div>

          {tab === "assessment" && (
            <div className="mt-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-neutral-500">Assessment date</span>
                  <input
                    type="date"
                    value={assessmentForm.date}
                    onChange={(e) =>
                      setAssessmentForm((p) => ({ ...p, date: e.target.value }))
                    }
                    className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-ink"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-neutral-500">Coach</span>
                  <select
                    value={assessmentForm.coach}
                    onChange={(e) =>
                      setAssessmentForm((p) => ({ ...p, coach: e.target.value }))
                    }
                    className="rounded-lg border border-neutral-300 px-2 py-2 text-sm outline-none focus:border-ink"
                  >
                    {COACHES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

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
                            onClick={() => setAssessmentForm((p) => ({ ...p, [key]: n }))}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg border text-sm font-medium transition ${
                              assessmentForm[key] === n
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
                  value={assessmentForm.coachComment}
                  onChange={(e) =>
                    setAssessmentForm((p) => ({ ...p, coachComment: e.target.value }))
                  }
                  rows={3}
                  className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-ink"
                />
              </label>
            </div>
          )}

          {tab === "class" && (
            <div className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-neutral-500">Class type</span>
                <select
                  value={classForm.className}
                  onChange={(e) => setClassForm((p) => ({ ...p, className: e.target.value }))}
                  className="rounded-lg border border-neutral-300 px-2 py-2 text-sm outline-none focus:border-ink"
                >
                  {CLASS_TYPES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-neutral-500">Coach</span>
                  <select
                    value={classForm.coach}
                    onChange={(e) => setClassForm((p) => ({ ...p, coach: e.target.value }))}
                    className="rounded-lg border border-neutral-300 px-2 py-2 text-sm outline-none focus:border-ink"
                  >
                    {COACHES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-neutral-500">Duration (min)</span>
                  <input
                    type="number"
                    min={15}
                    step={15}
                    value={classForm.duration}
                    onChange={(e) => setClassForm((p) => ({ ...p, duration: e.target.value }))}
                    className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-ink"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-neutral-500">Date</span>
                <input
                  type="date"
                  value={classForm.date}
                  onChange={(e) => setClassForm((p) => ({ ...p, date: e.target.value }))}
                  className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-ink"
                />
              </label>
            </div>
          )}

          {tab === "note" && (
            <div className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-neutral-500">Coach</span>
                <select
                  value={noteForm.coach}
                  onChange={(e) => setNoteForm((p) => ({ ...p, coach: e.target.value }))}
                  className="rounded-lg border border-neutral-300 px-2 py-2 text-sm outline-none focus:border-ink"
                >
                  {COACHES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-neutral-500">Note</span>
                <textarea
                  value={noteForm.text}
                  onChange={(e) => setNoteForm((p) => ({ ...p, text: e.target.value }))}
                  rows={4}
                  required
                  placeholder="Write a note..."
                  className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-ink"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-neutral-500">Date</span>
                <input
                  type="date"
                  value={noteForm.date}
                  onChange={(e) => setNoteForm((p) => ({ ...p, date: e.target.value }))}
                  className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-ink"
                />
              </label>
            </div>
          )}
        </div>

        <div className="flex gap-3 border-t border-neutral-200 px-6 py-4">
          <button
            type="button"
            onClick={close}
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
            {tab === "assessment" ? "Save Assessment" : tab === "class" ? "Save Class" : "Save Note"}
          </button>
        </div>
      </form>
    </div>
  );
}
