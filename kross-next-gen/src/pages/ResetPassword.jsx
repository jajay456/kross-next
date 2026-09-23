import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "../firebase";
import logoMark from "../assets/logo-mark.png";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const [status, setStatus] = useState("verifying"); // verifying | ready | invalid | done
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!oobCode) {
      setStatus("invalid");
      return;
    }
    verifyPasswordResetCode(auth, oobCode)
      .then((userEmail) => {
        setEmail(userEmail);
        setStatus("ready");
      })
      .catch(() => setStatus("invalid"));
  }, [oobCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setStatus("done");
    } catch {
      setError("This reset link is invalid or has expired.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm rounded-2xl bg-panel p-8">
        <div className="mb-8 text-center">
          <img src={logoMark} alt="" className="mx-auto mb-3 h-12 w-12" />
          <p className="text-2xl font-extrabold tracking-tight text-white">KROSS</p>
          <p className="text-2xl font-extrabold tracking-tight text-lime">NEXT GEN</p>
          <p className="mt-1 text-[10px] tracking-[0.2em] text-neutral-400 uppercase">
            Padel Academy
          </p>
        </div>

        {status === "verifying" && (
          <p className="text-center text-sm text-neutral-400">Checking your reset link...</p>
        )}

        {status === "invalid" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-rose-400">
              This password reset link is invalid or has expired.
            </p>
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-lime hover:underline"
            >
              Request a new link
            </Link>
          </div>
        )}

        {status === "ready" && (
          <>
            <p className="mb-5 text-sm text-neutral-400">
              Set a new password for{" "}
              <span className="font-semibold text-white">{email}</span>.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-neutral-400">New password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white
                             outline-none placeholder:text-neutral-500 focus:border-lime"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-neutral-400">Confirm new password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white
                             outline-none placeholder:text-neutral-500 focus:border-lime"
                />
              </label>

              {error && <p className="text-sm text-rose-400">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 rounded-xl bg-lime py-3 text-sm font-bold tracking-wide text-ink
                           transition hover:brightness-95 disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Save New Password"}
              </button>
            </form>
          </>
        )}

        {status === "done" && (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-neutral-300">
              Your password has been reset successfully.
            </p>
            <Link
              to="/login"
              className="text-sm font-semibold text-lime hover:underline"
            >
              Back to login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
