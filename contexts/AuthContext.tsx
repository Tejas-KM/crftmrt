"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";


interface User {
  email: string;
  cart?: any[];
  wishlist?: any[];
  orders?: any[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  sessionToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    // If NextAuth session exists (Google login), use it
    if (session?.user?.email) {
      setUser({ email: session.user.email });
      // NextAuth JWT session token is in session (for strategy: 'jwt')
      // See: https://next-auth.js.org/tutorials/refresh-token-rotation#using-the-session-token
      // For JWT strategy, session.data.token is not exposed by default, but token is in the session callback
      // We'll try to get it from session (custom property) or fallback to null
      setSessionToken((session as any)?.token || null);
      setToken(null);
      return;
    }
    // Fallback to localStorage (email/password login)
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (t && u) {
      setToken(t);
      setSessionToken(null);
      setUser(JSON.parse(u));
    }
  }, [session]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    } else {
      throw new Error(data.message || "Login failed");
    }
    setLoading(false);
  };

  const signup = async (email: string, password: string) => {
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    } else {
      throw new Error(data.message || "Signup failed");
    }
    setLoading(false);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    signOut({ callbackUrl: "/" }); // Also log out from NextAuth
  };

  return (
    <AuthContext.Provider value={{ user, token, sessionToken, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
