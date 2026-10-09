import { useState } from "react";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";

const LIST_COLLAPSED_KEY = "kng.listCollapsed";

// Landing on the home page (fresh load) starts with the list hidden so the
// full-width hero shows. Evaluated once per page load.
if (["/", "/players", "/login"].includes(window.location.pathname)) {
    try {
        localStorage.setItem(LIST_COLLAPSED_KEY, "1");
    } catch {
        // storage unavailable — falls back to the expanded default
    }
}

export default function AppLayout({ sidebar, list, detail,mobileView="list", fullWidthList=false }) {
    const show = (name) => (mobileView === name ? "flex" : "hidden");
    const [navOpen, setNavOpen] = useState(false);
    // Re-keying replays the entrance animation: the list on section change,
    // the detail pane on every route (e.g. picking another player).
    const { pathname } = useLocation();
    const section = pathname.split("/")[1];

    // Desktop-only: collapse the list column to give the detail pane full width.
    const [listCollapsed, setListCollapsed] = useState(() => {
        try {
            return localStorage.getItem(LIST_COLLAPSED_KEY) === "1";
        } catch {
            return false;
        }
    });
    const setCollapsed = (value) => {
        setListCollapsed(value);
        try {
            localStorage.setItem(LIST_COLLAPSED_KEY, value ? "1" : "0");
        } catch {
            // storage unavailable — keep in-memory state only
        }
    };
    const toggleList = () => setCollapsed(!listCollapsed);
    // The logo goes "home" to the full-width hero; picking a section brings
    // the list back.
    const handleSidebarClick = (e) => {
        if (e.target.closest("[data-home]")) setCollapsed(true);
        else if (listCollapsed && e.target.closest("a")) setCollapsed(false);
    };
    const canCollapse = !fullWidthList;
    const collapsed = canCollapse && listCollapsed;

    return (
        <div className="h-[100vh] bg-ink p-0 sm:p-4">
            <div
                style={{ "--list-w": collapsed ? "0px" : "340px" }}
                className={`relative flex h-full flex-col overflow-hidden bg-white sm:rounded-2xl
                md:grid md:grid-cols-[220px_minmax(0,1fr)]
                ${fullWidthList ? "" : "lg:grid-cols-[220px_var(--list-w)_minmax(0,1fr)] lg:transition-[grid-template-columns] lg:duration-300 lg:ease-out"}`}
            >
              <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3 md:hidden">
                <button
                    type="button"
                    onClick={() => setNavOpen(true)}
                    aria-label="Open menu"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100"
                >
                    <Menu size={20} />
                </button>
                <span className="text-sm font-semibold text-ink">KROSS NEXT GEN</span>
              </div>

              <aside className="hidden bg-panel md:block" onClick={handleSidebarClick}>{sidebar}</aside>

              {navOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <div
                        className="absolute inset-0 bg-black/50 animate-fade-in"
                        onClick={() => setNavOpen(false)}
                    />
                    <div className="relative z-10 h-full w-64 max-w-[80%] animate-slide-in bg-panel shadow-xl">
                        <button
                            type="button"
                            onClick={() => setNavOpen(false)}
                            aria-label="Close menu"
                            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-panel-hover hover:text-white"
                        >
                            <X size={18} />
                        </button>
                        {sidebar}
                    </div>
                </div>
              )}

            <div
                key={section}
                aria-hidden={collapsed || undefined}
                className={`${show("list")} animate-rise min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden
                border-r border-neutral-200 lg:flex ${collapsed ? "lg:invisible" : ""}`}
            >
                {list}
            </div>

            {canCollapse && (
                <button
                    type="button"
                    onClick={toggleList}
                    aria-label={collapsed ? "Show list" : "Hide list"}
                    title={collapsed ? "Show list" : "Hide list"}
                    className="absolute top-1/2 z-20 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center
                               rounded-full border border-neutral-200 bg-white text-neutral-500 shadow-md
                               transition-[left,color,background-color] duration-300 ease-out hover:bg-ink hover:text-white lg:flex"
                    style={{ left: "calc(220px + var(--list-w))" }}
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            )}

            {!fullWidthList && (
                <main
                    key={pathname}
                    className={`${show("detail")} animate-rise min-h-0 min-w-0 flex-1 flex-col overflow-y-auto lg:flex`}
                >
                    {detail}
                </main>
            )}
          </div>
        </div>
    );
}