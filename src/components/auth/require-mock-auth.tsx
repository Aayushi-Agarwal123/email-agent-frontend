import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useMockSession } from "@/lib/mock-session";

export function RequireMockAuth({ children }: { children: ReactNode }) {
  const { session } = useMockSession();
  const location = useLocation();

  if (!session) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
