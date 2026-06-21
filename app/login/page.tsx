"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      const from = params.get("from") ?? "/training";
      router.push(from);
      router.refresh();
    } else {
      setError("Wrong password. Check your APP_SECRET in Vercel.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm bg-panel border border-border rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🥍</div>
          <h1 className="text-2xl font-black">Personal OS</h1>
          <p className="text-muted text-sm mt-1">Enter your access password</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-muted font-semibold uppercase tracking-wide mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your APP_SECRET"
              autoFocus
              required
            />
          </div>

          {error && (
            <p className="text-sm text-bad bg-red-950/30 border border-red-900 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent text-bg font-bold rounded-xl hover:brightness-110 transition disabled:opacity-60"
          >
            {loading ? "Checking…" : "Enter"}
          </button>
        </form>

        <p className="text-xs text-muted text-center mt-6">
          Set <code className="bg-panel2 px-1 rounded">APP_SECRET</code> in Vercel
          Environment Variables to protect your data.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
