"use client";
import React, { createContext, useContext, useMemo, useState } from "react";
import type { User } from "./types";

type AuthCtx = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, _password: string): Promise<void> => {
    const name = email.split("@")[0] || "User";
    setUser({ id: "u1", name, email, image: null, status: "online" });
  };

  const logout = (): void => setUser(null);

  const value = useMemo<AuthCtx>(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
