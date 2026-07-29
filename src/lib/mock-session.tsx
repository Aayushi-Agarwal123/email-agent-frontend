import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

// Purely a demo-journey gate for the new public routes (/signin, /register,
// protected /dashboard + /onboarding). Deliberately separate from the real
// AuthProvider in ./auth.tsx, which already always resolves a session in
// demo mode — mixing the two would make it impossible to ever show the
// sign-in screen in this environment.
const STORAGE_KEY = "mock-session";

export interface MockSession {
  email: string;
}

interface MockSessionState {
  session: MockSession | null;
  signIn: (email: string) => void;
  signOut: () => void;
}

const MockSessionContext = createContext<MockSessionState | null>(null);

function readStoredSession(): MockSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MockSession) : null;
  } catch {
    return null;
  }
}

export function MockSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<MockSession | null>(readStoredSession);

  const signIn = useCallback((email: string) => {
    const next: MockSession = { email };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  return (
    <MockSessionContext.Provider value={{ session, signIn, signOut }}>
      {children}
    </MockSessionContext.Provider>
  );
}

export function useMockSession(): MockSessionState {
  const ctx = useContext(MockSessionContext);
  if (!ctx) throw new Error("useMockSession must be used within MockSessionProvider");
  return ctx;
}
