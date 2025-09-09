"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error((await res.text()) || "Login failed");
      router.push("/");
    } catch (e: any) {
      setErr(e?.message ?? "Login failed");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 p-6 rounded-2xl border">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        {err && <p className="text-sm text-red-500">{err}</p>}
        <input className="w-full rounded-xl border p-3 bg-transparent" placeholder="Email"
               value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full rounded-xl border p-3 bg-transparent" placeholder="Password" type="password"
               value={password} onChange={e => setPassword(e.target.value)} />
        <button className="w-full rounded-xl border p-3 hover:bg-white/5" type="submit">Continue</button>
      </form>
    </main>
  );
}
