"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "Login gagal");
      }
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-20">
      <h1 className="text-xl font-bold mb-6 text-center">Admin Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-[var(--text-muted)]">Username</label>
          <input
            type="text"
            className="w-full mt-1 px-3 py-2 bg-[var(--surface-alt)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder-[var(--text-muted)]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[var(--text-muted)]">Password</label>
          <input
            type="password"
            className="w-full mt-1 px-3 py-2 bg-[var(--surface-alt)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder-[var(--text-muted)]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-sm text-[var(--red)]">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-[var(--accent)] text-[#080e1a] rounded-lg hover:bg-[var(--accent-hover)] disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Login"}
        </button>
      </form>
      <a href="/" className="block text-center text-sm text-[var(--accent)] mt-4 hover:underline">
        &larr; Kembali
      </a>
    </div>
  );
}
