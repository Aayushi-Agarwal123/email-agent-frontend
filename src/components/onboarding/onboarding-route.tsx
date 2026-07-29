import { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
import { OnboardingWizard } from "./onboarding-wizard";
import { useAuth } from "@/lib/auth";
import { fetchOnboarding } from "@/lib/api";

export function OnboardingRoute() {
  const { session } = useAuth();
  const tenantId = session?.tenantId ?? "kfel";
  const navigate = useNavigate();
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  const load = useCallback(async () => {
    try {
      const s = await fetchOnboarding(tenantId);
      setOnboarded(s.onboarded);
    } catch {
      setOnboarded(true);
    }
  }, [tenantId]);

  useEffect(() => {
    load();
  }, [load]);

  if (onboarded === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (onboarded === true) {
    return <Navigate to="/dashboard" replace />;
  }

  return <OnboardingWizard tenantId={tenantId} onDone={() => navigate("/dashboard", { replace: true })} />;
}
