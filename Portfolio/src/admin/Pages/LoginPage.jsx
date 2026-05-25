import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminToken, loginAdmin } from "../../api/client";
import GlassCard from "../../Components/GlassCard";

export default function LoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (getAdminToken()) {
    navigate("/admin", { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await loginAdmin(password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <GlassCard className="w-full max-w-md p-8">
        <p className="font-mono-display text-[10px] tracking-[0.35em] uppercase text-cyan-400/90 mb-2">
          Admin
        </p>
        <h1 className="font-display text-2xl font-bold text-foreground">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your portfolio content and contact messages.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="contact-label">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/30"
            />
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-white py-3 text-sm font-semibold text-slate-900 hover:bg-white/95 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Enter dashboard"}
          </button>
        </form>

        <p className="mt-6 text-center">
          <a href="/" className="text-xs text-muted-foreground hover:text-foreground">
            ← Back to portfolio
          </a>
        </p>
      </GlassCard>
    </div>
  );
}
