import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Plus, X } from "lucide-react";
import AppLayout from "../layouts/AppLayout";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useLists } from "../context/ListsContext";
import { CLASS_TYPE_STYLES, CLASS_TYPE_STYLE_MAP, FALLBACK_STYLE } from "../data/classIcons";

const SECTIONS = [
  { field: "levels", title: "Player Levels", description: "Skill levels shown when adding or editing a player." },
  { field: "classes", title: "Player Classes", description: "Academy classes players can be grouped into." },
];

export default function ManageOptions() {
  const { isAdmin } = useAuth();
  const lists = useLists();

  if (!isAdmin) {
    return <Navigate to="/players" replace />;
  }

  return (
    <AppLayout
      mobileView="list"
      fullWidthList
      sidebar={<Sidebar />}
      list={
        <div className="flex h-full flex-col">
          <div className="border-b border-neutral-200 px-5 py-5 sm:px-7">
            <h2 className="text-2xl font-bold tracking-tight">Manage Options</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Add or remove the levels, classes, and training types used across the app.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
            <div className="flex flex-col gap-8">
              {SECTIONS.map(({ field, title, description }) => (
                <OptionSection
                  key={field}
                  title={title}
                  description={description}
                  values={lists?.[field] || []}
                  onAdd={(value) => lists.addValue(field, value)}
                  onRemove={(value) => lists.removeValue(field, value)}
                />
              ))}

              <ClassTypeSection
                values={lists?.classTypes || []}
                iconMap={lists?.classTypeIcons || {}}
                onAdd={async (name, styleKey) => {
                  await lists.addValue("classTypes", name);
                  await lists.setClassTypeIcon(name.trim(), styleKey);
                }}
                onRemove={(value) => lists.removeValue("classTypes", value)}
                onSetIcon={(name, styleKey) => lists.setClassTypeIcon(name, styleKey)}
              />
            </div>
          </div>
        </div>
      }
    />
  );
}

function OptionSection({ title, description, values, onAdd, onRemove }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value);
    setValue("");
  };

  return (
    <section>
      <h3 className="text-sm font-bold tracking-wide">{title}</h3>
      <p className="mt-1 text-xs text-neutral-500">{description}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {values.map((v) => (
          <span
            key={v}
            className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 py-1.5 pl-3 pr-2 text-sm"
          >
            {v}
            <button
              type="button"
              onClick={() => onRemove(v)}
              aria-label={`Remove ${v}`}
              className="flex h-4 w-4 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-200 hover:text-neutral-700"
            >
              <X size={11} />
            </button>
          </span>
        ))}
        {values.length === 0 && <p className="text-sm text-neutral-400">No options yet.</p>}
      </div>

      <form onSubmit={handleSubmit} className="mt-3 flex max-w-sm gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add new option..."
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-ink"
        />
        <button
          type="submit"
          aria-label="Add option"
          className="flex shrink-0 items-center justify-center rounded-lg bg-ink px-3 text-white transition hover:bg-neutral-700"
        >
          <Plus size={16} />
        </button>
      </form>
    </section>
  );
}

function IconSwatchPicker({ selectedKey, onPick }) {
  return (
    <div className="grid w-56 grid-cols-5 gap-1 rounded-lg border border-neutral-200 bg-white p-2 shadow-lg">
      {CLASS_TYPE_STYLES.map((s) => (
        <button
          key={s.key}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onPick(s.key)}
          className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${s.color} ${
            selectedKey === s.key ? "ring-2 ring-ink" : ""
          }`}
        >
          <s.Icon size={15} />
        </button>
      ))}
    </div>
  );
}

function ClassTypeSection({ values, iconMap, onAdd, onRemove, onSetIcon }) {
  const [name, setName] = useState("");
  const [newStyleKey, setNewStyleKey] = useState(CLASS_TYPE_STYLES[0].key);
  const [openPickerFor, setOpenPickerFor] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name, newStyleKey);
    setName("");
    setNewStyleKey(CLASS_TYPE_STYLES[0].key);
  };

  const NewIcon = CLASS_TYPE_STYLE_MAP[newStyleKey].Icon;

  return (
    <section>
      <h3 className="text-sm font-bold tracking-wide">Training Class Types</h3>
      <p className="mt-1 text-xs text-neutral-500">
        Session types available when logging a training class.
      </p>

      <div className="mt-3 flex flex-col gap-2">
        {values.map((v) => {
          const { Icon, color } = CLASS_TYPE_STYLE_MAP[iconMap?.[v]] || FALLBACK_STYLE;
          return (
            <div
              key={v}
              className="flex items-center gap-3 rounded-lg border border-neutral-200 px-3 py-2"
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color}`}>
                <Icon size={15} />
              </span>
              <span className="flex-1 truncate text-sm font-medium">{v}</span>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenPickerFor(openPickerFor === v ? null : v)}
                  className="text-xs font-medium text-neutral-500 underline-offset-2 hover:text-ink hover:underline"
                >
                  Change icon
                </button>
                {openPickerFor === v && (
                  <div className="absolute right-0 top-full z-10 mt-1">
                    <IconSwatchPicker
                      selectedKey={iconMap?.[v]}
                      onPick={(styleKey) => {
                        onSetIcon(v, styleKey);
                        setOpenPickerFor(null);
                      }}
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => onRemove(v)}
                aria-label={`Remove ${v}`}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
              >
                <X size={13} />
              </button>
            </div>
          );
        })}
        {values.length === 0 && <p className="text-sm text-neutral-400">No options yet.</p>}
      </div>

      <form onSubmit={handleSubmit} className="mt-3 flex max-w-md items-center gap-2">
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setOpenPickerFor(openPickerFor === "__new" ? null : "__new")}
            aria-label="Choose icon"
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${CLASS_TYPE_STYLE_MAP[newStyleKey].color}`}
          >
            <NewIcon size={15} />
          </button>
          {openPickerFor === "__new" && (
            <div className="absolute left-0 top-full z-10 mt-1">
              <IconSwatchPicker
                selectedKey={newStyleKey}
                onPick={(styleKey) => {
                  setNewStyleKey(styleKey);
                  setOpenPickerFor(null);
                }}
              />
            </div>
          )}
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add new class type..."
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-ink"
        />
        <button
          type="submit"
          aria-label="Add option"
          className="flex shrink-0 items-center justify-center rounded-lg bg-ink px-3 py-2 text-white transition hover:bg-neutral-700"
        >
          <Plus size={16} />
        </button>
      </form>
    </section>
  );
}
