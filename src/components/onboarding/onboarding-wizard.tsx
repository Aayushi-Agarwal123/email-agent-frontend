import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileTree } from "@/components/file-tree";
import { CheckCircle2Icon, CircleIcon, Loader2Icon, LogOutIcon, MailIcon, UploadIcon } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { ensureGoogleScript, google } from "@/lib/google";
import {
  fetchOnboarding,
  fetchUploads,
  saveOnboardingProfile,
  completeOnboarding,
  connectGmail,
  connectGmailDemo,
  uploadFile,
  IS_DEMO,
  type OnboardingState,
  type TreeNode,
} from "@/lib/api";

/* eslint-disable @typescript-eslint/no-explicit-any */
const GMAIL_CLIENT = (import.meta.env.VITE_GMAIL_CLIENT_ID ?? import.meta.env.VITE_GOOGLE_CLIENT_ID) as string | undefined;
const GMAIL_SCOPE = "openid email https://www.googleapis.com/auth/gmail.modify";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const CURRENCIES: { code: string; name: string; flag: string }[] = [
  { code: "PHP", name: "Philippine Peso", flag: "🇵🇭" },
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
  { code: "INR", name: "Indian Rupee", flag: "🇮🇳" },
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪" },
  { code: "SGD", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "MYR", name: "Malaysian Ringgit", flag: "🇲🇾" },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦" },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵" },
  { code: "CNY", name: "Chinese Yuan", flag: "🇨🇳" },
  { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦" },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦" },
];

function Req() {
  return <span className="text-destructive"> *</span>;
}

function StepBadge({ done }: { done: boolean }) {
  return done ? (
    <CheckCircle2Icon className="h-5 w-5 text-emerald-500" />
  ) : (
    <CircleIcon className="h-5 w-5 text-muted-foreground/50" />
  );
}

export function OnboardingWizard({ tenantId, onDone }: { tenantId: string; onDone: () => void }) {
  const { session, live, logout } = useAuth();
  const [onb, setOnb] = useState<OnboardingState | null>(null);
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const [s, u] = await Promise.all([fetchOnboarding(tenantId), fetchUploads(tenantId)]);
    setOnb(s);
    setTree(u.tree);
  }, [tenantId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Profile form state
  const [displayName, setDisplayName] = useState("");
  const [currency, setCurrency] = useState("");
  const [priceBasis, setPriceBasis] = useState("");
  const [validityDays, setValidityDays] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");

  useEffect(() => {
    if (!onb) return;
    setDisplayName((v) => v || onb.displayName || "");
    setCurrency((v) => onb.currency || v);
    setPriceBasis((v) => onb.priceBasis || v);
    setValidityDays((v) => (onb.validityDays ? String(onb.validityDays) : v));
    setReviewerEmail((v) => v || onb.reviewerEmail || "");
  }, [onb]);

  if (!onb) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const profileDone = Boolean(onb.displayName && onb.currency);
  const gmailDone = onb.gmailConnected;
  const dataDone = onb.hasData;
  const allDone = profileDone && gmailDone && dataDone;
  // Client-side gate for the profile save: the three mandatory fields.
  const profileValid = displayName.trim().length > 0 && currency.length === 3 && EMAIL_RE.test(reviewerEmail.trim());

  const saveProfile = async () => {
    setBusy(true);
    setError(null);
    try {
      await saveOnboardingProfile(tenantId, { displayName: displayName.trim(), currency, priceBasis, validityDays: Number(validityDays), reviewerEmail: reviewerEmail.trim() });
      await refresh();
    } catch {
      setError("Couldn't save profile — check the fields and try again.");
    } finally {
      setBusy(false);
    }
  };

  const connectGmailFlow = async () => {
    setError(null);
    if (IS_DEMO) {
      connectGmailDemo();
      refresh();
      return;
    }
    if (!GMAIL_CLIENT) {
      setError("Dashboard is missing its Google client id (VITE_GOOGLE_CLIENT_ID).");
      return;
    }
    try {
      await ensureGoogleScript();
    } catch {
      setError("Couldn't load Google sign-in — check your connection and reload.");
      return;
    }
    const g = google();
    if (!g?.accounts?.oauth2) {
      setError("Google sign-in isn't available. Reload and try again.");
      return;
    }
    const client = g.accounts.oauth2.initCodeClient({
      client_id: GMAIL_CLIENT,
      scope: GMAIL_SCOPE,
      ux_mode: "popup",
      callback: async (resp: any) => {
        if (!resp?.code) return;
        try {
          await connectGmail(tenantId, resp.code, "postmessage");
          await refresh();
        } catch {
          setError("Gmail connect failed. Please try again.");
        }
      },
    });
    client.requestCode();
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const res = await uploadFile(tenantId, file);
      setTree(res.tree);
      await refresh();
    } catch (err) {
      setError(err instanceof Error && err.message ? `Upload failed: ${err.message}` : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const finish = async () => {
    setBusy(true);
    setError(null);
    try {
      await completeOnboarding(tenantId);
      onDone();
    } catch {
      setError("Couldn't finish — make sure all three steps are complete.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome — let's set up your quoting agent</h1>
            <p className="text-muted-foreground">Three quick steps and your agent starts handling quotes.</p>
            {IS_DEMO && <p className="mt-1 text-xs text-muted-foreground">(Preview mode — steps are simulated.)</p>}
            {live && session?.email && <p className="mt-1 text-xs text-muted-foreground">Signed in as {session.email}</p>}
          </div>
          {live && (
            <button
              type="button"
              onClick={logout}
              title={session?.email ? `Sign out (${session.email})` : "Sign out"}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <LogOutIcon className="h-4 w-4" /> Sign out
            </button>
          )}
        </div>

        {error && <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}

        {/* Step 1 — business profile */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <StepBadge done={profileDone} />
            <div>
              <CardTitle className="text-base">Business profile</CardTitle>
              <CardDescription>How your quotes are labelled and priced.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Business name<Req /></Label>
              <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Golden Steel Supplier Co" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency<Req /></Label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="" disabled>
                  Select currency…
                </option>
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rev">Reviewer email<Req /></Label>
              <Input id="rev" type="email" value={reviewerEmail} onChange={(e) => setReviewerEmail(e.target.value)} placeholder="boss@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="basis">
                Price basis <span className="text-xs font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input id="basis" value={priceBasis} onChange={(e) => setPriceBasis(e.target.value)} placeholder="e.g. Ex-works" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validity">
                Quote validity in days <span className="text-xs font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input id="validity" type="number" value={validityDays} onChange={(e) => setValidityDays(e.target.value)} placeholder="30" />
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
              <Button onClick={saveProfile} disabled={busy || !profileValid}>
                Save profile
              </Button>
              {!profileValid && (
                <span className="text-xs text-muted-foreground">Business name, currency and reviewer email are required.</span>
              )}
              {profileDone && <span className="text-xs text-emerald-600 dark:text-emerald-400">Saved.</span>}
            </div>
          </CardContent>
        </Card>

        {/* Step 2 — Gmail */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <StepBadge done={gmailDone} />
            <div>
              <CardTitle className="text-base">Connect Gmail</CardTitle>
              <CardDescription>The mailbox your agent reads RFQs from and sends quotes with.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {gmailDone ? (
              <p className="text-sm text-emerald-600 dark:text-emerald-400">Gmail connected.</p>
            ) : (
              <>
                <Button variant="outline" onClick={connectGmailFlow} disabled={busy || !profileDone}>
                  <MailIcon className="mr-2 h-4 w-4" /> Connect Gmail
                </Button>
                {!profileDone && <p className="text-xs text-muted-foreground">Save your business profile first.</p>}
              </>
            )}
          </CardContent>
        </Card>

        {/* Step 3 — data */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <StepBadge done={dataDone} />
            <div>
              <CardTitle className="text-base">Upload your catalog data</CardTitle>
              <CardDescription>A single file or a .zip / .tar.gz of your price data (max 100 MB).</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <label
              className={`inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ${
                busy || !gmailDone ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-accent"
              }`}
            >
              <UploadIcon className="h-4 w-4" />
              {busy ? "Uploading…" : "Choose file"}
              <input type="file" className="hidden" onChange={onUpload} disabled={busy || !gmailDone} accept=".zip,.tar,.tar.gz,.tgz,.gz,.csv,.xlsx,.json,.txt,.pdf" />
            </label>
            {!gmailDone && <p className="text-xs text-muted-foreground">Connect Gmail first.</p>}
            <div className="rounded-md border border-border/50 bg-muted/20 p-3">
              <FileTree nodes={tree} />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          {!allDone && <span className="text-sm text-muted-foreground">Complete all three steps to finish.</span>}
          <Button onClick={finish} disabled={!allDone || busy}>
            {busy && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            Finish setup
          </Button>
        </div>
      </div>
    </div>
  );
}
