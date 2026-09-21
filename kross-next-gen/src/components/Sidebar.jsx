import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { User, CalendarCheck, ClipboardList, FileText, ChevronDown, Shield, LogOut } from 'lucide-react'
import { CURRENT_USER } from '../data/users'

const NAV = [
{ to: "/players", label: "Players", icon: <User size={16} /> },
{to: "/assessments", label: "Assessments History", icon: <CalendarCheck size={16} /> },
{to: "/classes", label: "Training Classes", icon: <ClipboardList size={16} /> },
{to: "/notes", label: "Notes", icon: <FileText size={16} /> },
]

export default function Sidebar() {
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const goTo = (path) => {
        setMenuOpen(false)
        navigate(path)
    }

    const handleLogout = () => {
        setMenuOpen(false)
        navigate("/login")
    }

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

            <div className="relative mt-auto">
                {menuOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                        <div className="absolute bottom-full left-0 z-50 mb-2 w-full overflow-hidden rounded-xl bg-panel-hover shadow-xl">
                            <button
                                type="button"
                                onClick={() => goTo("/profile")}
                                className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm
                                           text-neutral-200 transition hover:bg-white/5 hover:text-white"
                            >
                                <User size={16} />
                                Profile
                            </button>

                            {CURRENT_USER.role === "admin" && (
                                <button
                                    type="button"
                                    onClick={() => goTo("/admin")}
                                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm
                                               text-neutral-200 transition hover:bg-white/5 hover:text-white"
                                >
                                    <Shield size={16} />
                                    Manage Users
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 border-t border-white/5 px-3 py-2.5
                                           text-left text-sm text-rose-400 transition hover:bg-white/5 hover:text-rose-300"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </>
                )}

                <button
                    type="button"
                    onClick={() => setMenuOpen((v) => !v)}
                    className="flex w-full items-center gap-3 rounded-xl bg-panel-hover p-2.5
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
                        {CURRENT_USER.name}
                    </span>
                    <span className="block truncate text-xs text-neutral-400">{CURRENT_USER.title}</span>
                    </span>
                    <ChevronDown size={16} className="shrink-0 text-neutral-400" />
                </button>
            </div>
        </div>
    )
}
