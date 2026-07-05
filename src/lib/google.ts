/* eslint-disable @typescript-eslint/no-explicit-any */
// Loads Google Identity Services (gsi/client) once, regardless of which screen
// needs it. Both the login page and the onboarding Gmail-connect use this, so a
// user landing directly on the wizard (persisted session) still gets `google`.
let loader: Promise<void> | null = null;

const GSI_SRC = "https://accounts.google.com/gsi/client";

export function ensureGoogleScript(): Promise<void> {
  if ((window as any).google?.accounts) return Promise.resolve();
  if (loader) return loader;
  loader = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GSI_SRC}"]`) as HTMLScriptElement | null;
    if (existing) {
      if ((window as any).google?.accounts) return resolve();
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("failed to load Google script")));
      return;
    }
    const s = document.createElement("script");
    s.src = GSI_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("failed to load Google script"));
    document.body.appendChild(s);
  });
  return loader;
}

export function google(): any {
  return (window as any).google;
}
