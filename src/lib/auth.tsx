import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { IS_LIVE, clearSession, getSession, postAuthSession, saveSession, type Session } from "./api";

// In fixture/preview mode there's no backend to log in against, so we run as a
// demo session. In live mode a real Google login is required.
const DEMO: Session = { token: "demo", tenantId: "kfel", email: "demo@kfel.com" };

interface AuthState {
  session: Session | null;
  live: boolean;
  login: (googleIdToken: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => (IS_LIVE ? getSession() : DEMO));

  const login = useCallback(async (googleIdToken: string) => {
    const s = await postAuthSession(googleIdToken);
    saveSession(s);
    setSession(s);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  // An expired/invalid session (401 from any API call) bounces back to login.
  useEffect(() => {
    const handler = () => setSession(null);
    window.addEventListener("dashboard:unauthorized", handler);
    return () => window.removeEventListener("dashboard:unauthorized", handler);
  }, []);

  return <AuthContext.Provider value={{ session, live: IS_LIVE, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
