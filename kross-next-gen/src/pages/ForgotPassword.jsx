import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setError("");
    setSent(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm rounded-2xl bg-panel p-8">
        <div className="mb-8 text-center">
          <p className="text-2xl font-extrabold tracking-tight text-white">KROSS</p>
          <p className="text-2xl font-extrabold tracking-tight text-lime">NEXT GEN</p>
          <p className="mt-1 text-[10px] tracking-[0.2em] text-neutral-400 uppercase">
            Padel Academy
          </p>
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-neutral-300">
              If an account exists for <span className="font-semibold text-white">{email}</span>,
              we've sent a password reset link (demo).
            </p>
            <Link
              to="/login"
              className="mt-2 flex items-center gap-2 text-sm font-semibold text-lime hover:underline"
            >
              <ArrowLeft size={16} />
              Back to login
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm text-neutral-400">
              Enter your email and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-neutral-400">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@krossnextgen.app"
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white
                             outline-none placeholder:text-neutral-500 focus:border-lime"
                />
              </label>

              {error && <p className="text-sm text-rose-400">{error}</p>}

              <button
                type="submit"
                className="mt-2 rounded-xl bg-lime py-3 text-sm font-bold tracking-wide text-ink
                           transition hover:brightness-95"
              >
                Send Reset Link
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-neutral-500">
              <Link to="/login" className="font-semibold text-lime hover:underline">
                Back to login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
