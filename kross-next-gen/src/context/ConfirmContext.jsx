import { createContext, useCallback, useContext, useState } from "react";

const ConfirmContext = createContext(null);

// In-app replacement for window.confirm, which browsers silently return false
// for when dialogs are blocked (embedded previews, "prevent additional dialogs").
// Usage: if (!(await confirm("Delete this?"))) return;
export function ConfirmProvider({ children }) {
  const [request, setRequest] = useState(null);

  const confirm = useCallback(
    (message, { confirmLabel = "Delete" } = {}) =>
      new Promise((resolve) => setRequest({ message, confirmLabel, resolve })),
    []
  );

  const close = (result) => {
    request.resolve(result);
    setRequest(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {request && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={() => close(false)} />
          <div
            role="alertdialog"
            aria-modal="true"
            className="relative z-10 animate-pop-in w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
          >
            <p className="text-sm leading-relaxed text-neutral-800">{request.message}</p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => close(false)}
                className="rounded-xl px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="button"
                autoFocus
                onClick={() => close(true)}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                {request.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmContext);
