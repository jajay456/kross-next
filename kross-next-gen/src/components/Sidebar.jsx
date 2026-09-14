import { NavLink } from 'react-router-dom'
import { User, CalendarCheck, ClipboardList, FileText, ChevronDown } from 'lucide-react'

const NAV = [
{ to: "/players", label: "Players", icon: <User size={16} /> },
{to: "/assessments", label: "Assessments History", icon: <CalendarCheck size={16} /> },
{to: "/classes", label: "Training Classes", icon: <ClipboardList size={16} /> },
{to: "/notes", label: "Notes", icon: <FileText size={16} /> },
]

export default function Sidebar() {
    return (
        <div className="flex h-full flex-col p-3">
            <div className="px-3 py-5">
                <p className="text-lg leading-tight font-exterabold tracking-tight text-white">
                    KROSS
                </p>
                <p className="text-lg leading-tight font-exterabold tracking-tight text-lime">
                    NEXT GEN
                </p>
                <p className="mt-0.5 text-[10px] tracking-[0.2em] text-neutral-400 uppercase">
                    PADEL ACADEMY
                </p>
            </div>

            <nav className="mt-2 flex flex-col gap-1">
                {NAV.map(({ to, label, icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                            isActive
                            ? "bg-panel-hover font-medium text-white"
                            : "text-neutral-400 hover:bg-panel-hover/50 hover:text-white"
                        }`}
                    >
                        {icon}
                        {label}
                    </NavLink>
                ))}
            </nav>

            <button
                className="mt-auto flex items-center gap-3 rounded-xl bg-panel-hover p-2.5
                        text-left transition hover:bg-neutral-700"
            >
                <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                            bg-lime text-xs font-bold text-ink"
                >
                RC
                </span>
                <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-white">
                    Roberto Coach
                </span>
                <span className="block truncate text-xs text-neutral-400">Head Coach</span>
                </span>
                <ChevronDown size={16} className="shrink-0 text-neutral-400" />
            </button>
        </div>
    )
}