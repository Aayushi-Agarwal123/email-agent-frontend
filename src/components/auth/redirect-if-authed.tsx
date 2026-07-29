import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useMockSession } from "@/lib/mock-session";

export function RedirectIfAuthed({ children }: { children: ReactNode }) {
  const { session } = useMockSession();

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}
