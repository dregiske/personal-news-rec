"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const router = useRouter();

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    try {
      await login(email, password);
      router.push("/");
    } catch (e) {
      setErr(e?.response?.data?.detail ?? "Login failed");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 p-6 rounded-2xl border">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        {err && <p className="text-sm text-red-500">{err}</p>}
        <input
          className="w-full rounded-xl border p-3 bg-transparent"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded-xl border p-3 bg-transparent"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="w-full rounded-xl border p-3 hover:bg-white/5" type="submit">
          Continue
        </button>
      </form>
    </main>
  );
}
