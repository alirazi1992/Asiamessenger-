"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthProvider, useAuth } from "@/lib/auth-client";

function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login(email, pwd);
    router.push("/acme/channels/general");
  }

  return (
    <main className="h-screen grid place-items-center">
      <form
        onSubmit={onSubmit}
        className="w-80 space-y-3 bg-neutral-800 p-6 rounded-xl"
      >
        <h2 className="text-xl font-semibold">Sign in</h2>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@company.com"
          className="w-full bg-neutral-900 rounded px-3 py-2 outline-none"
        />
        <input
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full bg-neutral-900 rounded px-3 py-2 outline-none"
        />
        <button className="w-full bg-white text-black rounded py-2">
          Continue
        </button>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
