import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function Login() {
  const { login } = useAuth();
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

  useEffect(() => {
    if (!clientId) {
      setError("Dashboard is missing its Google client id (VITE_GOOGLE_CLIENT_ID).");
      return;
    }
    const handle = async (resp: { credential: string }) => {
      try {
        setError(null);
        await login(resp.credential);
      } catch (e) {
        if (e instanceof ApiError && (e.status === 403 || e.status === 401)) {
          setError("This Google account isn't authorized for any workspace. Ask your admin to grant access.");
        } else {
          setError("Sign-in failed. Please try again.");
        }
      }
    };
    const init = () => {
      const g = (window as any).google;
      if (!g?.accounts?.id) return;
      g.accounts.id.initialize({ client_id: clientId, callback: handle });
      if (ref.current) g.accounts.id.renderButton(ref.current, { theme: "outline", size: "large", width: 280 });
    };
    if ((window as any).google) {
      init();
      return;
    }
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    s.onload = init;
    document.body.appendChild(s);
  }, [clientId, login]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
            Q
          </div>
          <div>
            <h1 className="text-lg font-semibold">Quotation Agent</h1>
            <p className="text-sm text-muted-foreground">Sign in to view your dashboard</p>
          </div>
        </div>
        <div className="flex justify-center">
          <div ref={ref} />
        </div>
        {error && (
          <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-center text-xs text-destructive">
            {error}
          </p>
        )}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Access is limited to authorized accounts for each business.
        </p>
      </div>
    </div>
  );
}
