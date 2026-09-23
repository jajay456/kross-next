import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function AppLayout({ sidebar, list, detail,mobileView="list", fullWidthList=false }) {
    const show = (name) => (mobileView === name ? "flex" : "hidden");
    const [navOpen, setNavOpen] = useState(false);

    return (
        <div className="h-[100vh] bg-ink p-0 sm:p-4">
            <div
                className={`relative flex h-full flex-col overflow-hidden bg-white sm:rounded-2xl
                md:grid md:grid-cols-[220px_minmax(0,1fr)]
                ${fullWidthList ? "" : "lg:grid-cols-[220px_340px_minmax(0,1fr)]"}`}
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

              <aside className="hidden bg-panel md:block">{sidebar}</aside>

              {navOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setNavOpen(false)}
                    />
                    <div className="relative z-10 h-full w-64 max-w-[80%] bg-panel shadow-xl">
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
                className={`${show("list")} min-h-0 min-w-0 flex-1 flex-col overflow-y-auto
                borfer-r boder-neutral-200 lg:flex`}
            >
                {list}
            </div>

            {!fullWidthList && (
                <main
                    className={`${show("detail")} min-h-0 min-w-0 flex-1 flex-col overflow-y-auto lg:flex`}
                >
                    {detail}
                </main>
            )}
          </div>
        </div>
    );
}