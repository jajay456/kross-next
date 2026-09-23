import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoMark from "../assets/logo-mark.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate("/players");
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

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-neutral-400">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white
                         outline-none placeholder:text-neutral-500 focus:border-lime"
            />
          </label>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-xs text-neutral-400 hover:text-lime hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-xl bg-lime py-3 text-sm font-bold tracking-wide text-ink
                       transition hover:brightness-95 disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-neutral-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-lime hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
