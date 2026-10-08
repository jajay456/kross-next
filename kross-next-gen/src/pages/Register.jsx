import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoMark from "../assets/logo-mark.png";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
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
    const result = await register(name, email, password);
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
            <span className="text-xs font-semibold text-neutral-400">Full name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="User name"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white
                         outline-none placeholder:text-neutral-500 focus:border-lime"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-neutral-400">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex@email.com"
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

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-neutral-400">Confirm password</span>
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
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-neutral-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-lime hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
