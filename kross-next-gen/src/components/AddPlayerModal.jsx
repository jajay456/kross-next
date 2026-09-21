import { useRef, useState } from "react";
import { X, Camera } from "lucide-react";
import Avatar from "./Avatar";
import { LEVELS, CLASSES, COACHES } from "../data/players";

const initialForm = { name: "", level: LEVELS[0], class: CLASSES[0], coach: COACHES[0], image: "" };

export default function AddPlayerModal({ open, initialData, onClose, onSubmit }) {
  const [form, setForm] = useState(initialData ?? initialForm);
  const isEditing = Boolean(initialData);
  const fileInputRef = useRef(null);

  if (!open) return null;

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit(form);
    setForm(initialForm);
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
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change photo"
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center
                           rounded-full bg-ink text-white ring-2 ring-white transition hover:bg-neutral-700"
              >
                <Camera size={13} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <p className="text-xs text-neutral-500">
              Click the camera icon to {form.image ? "change" : "add"} a photo.
            </p>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-neutral-500">Name</span>
            <input
              value={form.name}
              onChange={update("name")}
              required
              placeholder="Player name"
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-ink"
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
                {LEVELS.map((l) => (
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
                {CLASSES.map((c) => (
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
                {COACHES.map((c) => (
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
