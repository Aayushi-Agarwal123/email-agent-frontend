import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileTree } from "@/components/file-tree";
import { CheckCircle2Icon, CheckIcon, CircleIcon, Loader2Icon, LogOutIcon, MailIcon, UploadIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useMockSession } from "@/lib/mock-session";
import { ensureGoogleScript, google } from "@/lib/google";
import { cn } from "@/lib/utils";
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
  return <span className="text-[#9A3B34]"> *</span>;
}

function StepBadge({ done }: { done: boolean }) {
  return done ? (
    <CheckCircle2Icon className="h-5 w-5 text-[#1D7A46]" />
  ) : (
    <CircleIcon className="h-5 w-5 text-[#9A998F]" />
  );
}

type RailStatus = "done" | "current" | "upcoming";

// Purely a visual progress overview — clicking scrolls to the step's card
// rather than switching which content is shown. All three step cards stay
// visible and gated exactly as they already are; this doesn't change that.
function ProgressRailStep({ index, anchor, title, description, status, isLast }: {
  index: number;
  anchor: string;
  title: string;
  description: string;
  status: RailStatus;
  isLast: boolean;
}) {
  const filled = status !== "upcoming";
  return (
    <a
      href={`#${anchor}`}
      aria-current={status === "current" ? "step" : undefined}
      aria-label={`Step ${index}: ${title}${status === "done" ? " (completed)" : status === "current" ? " (current)" : ""}`}
      className="group flex gap-3"
    >
      <span className="flex flex-col items-center">
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] font-mono text-[12.5px] font-semibold transition-colors",
            filled
              ? "border-[#1A1A1A] bg-[#1A1A1A] text-[#FCFBF7]"
              : "border-[#DAD5C8] bg-transparent text-[#9A998F] group-hover:border-[#1A1A1A] group-hover:text-[#1A1A1A]",
          )}
        >
          {status === "done" ? <CheckIcon className="h-4 w-4" /> : index}
        </span>
        {!isLast && <span className={cn("mt-1 w-[1.5px] flex-1", filled ? "bg-[#1A1A1A]" : "bg-[#DAD5C8]")} />}
      </span>
      <span className={cn("pb-6", isLast && "pb-0")}>
        <span
          className={cn("block text-[14px]", status === "upcoming" ? "text-[#71716A]" : "text-[#1A1A1A]")}
          style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500 }}
        >
          {title}
        </span>
        <span className="mt-1 block text-[12px] leading-[1.5] text-[#71716A]">{description}</span>
      </span>
    </a>
  );
}

export function OnboardingWizard({ tenantId, onDone }: { tenantId: string; onDone: () => void }) {
  const { session, live, logout } = useAuth();
  const { session: mockSession, signOut: mockSignOut } = useMockSession();
  const navigate = useNavigate();
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
      <div className="flex h-screen items-center justify-center bg-[#FCFBF7]">
        <Loader2Icon className="h-8 w-8 animate-spin text-[#1A1A1A]" />
      </div>
    );
  }

  const profileDone = Boolean(onb.displayName && onb.currency);
  const gmailDone = onb.gmailConnected;
  const dataDone = onb.hasData;
  const allDone = profileDone && gmailDone && dataDone;
  // Client-side gate for the profile save: the three mandatory fields.
  const profileValid = displayName.trim().length > 0 && currency.length === 3 && EMAIL_RE.test(reviewerEmail.trim());

  const statusOf = (done: boolean, isNext: boolean): RailStatus => (done ? "done" : isNext ? "current" : "upcoming");
  const railSteps: { anchor: string; title: string; description: string; status: RailStatus }[] = [
    { anchor: "onb-step-1", title: "Business profile", description: "How your quotes are labelled and priced.", status: statusOf(profileDone, !profileDone) },
    { anchor: "onb-step-2", title: "Connect Gmail", description: "The mailbox the agent reads RFQs from.", status: statusOf(gmailDone, profileDone && !gmailDone) },
    { anchor: "onb-step-3", title: "Upload catalog", description: "Your price data — one file or a .zip.", status: statusOf(dataDone, profileDone && gmailDone && !dataDone) },
  ];

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

  // Clears both the mock session (what actually gates /signin, /register,
  // /onboarding, /dashboard here) and the real auth session, then navigates
  // away first — same order dashboard-layout.tsx uses, since clearing the
  // session before navigating can let the route guard redirect to /signin
  // before this navigation lands, trapping the user here.
  const handleSignOut = () => {
    navigate("/", { replace: true });
    mockSignOut();
    logout();
  };

  return (
    <div
      className="min-h-screen bg-[#FCFBF7] text-[#1A1A1A]"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1
              className="text-[26px] tracking-tight text-[#1A1A1A]"
              style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500 }}
            >
              Welcome — let's set up your quoting agent
            </h1>
            <p className="text-[#71716A]">Three quick steps and your agent starts handling quotes.</p>
            {IS_DEMO && <p className="mt-1 text-[11px] text-[#71716A]">(Preview mode — steps are simulated.)</p>}
            {(live ? session?.email : mockSession?.email) && (
              <p className="mt-1 text-[11px] text-[#71716A]">Signed in as {live ? session?.email : mockSession?.email}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            title={
              (live ? session?.email : mockSession?.email)
                ? `Sign out (${live ? session?.email : mockSession?.email})`
                : "Sign out"
            }
            className="inline-flex shrink-0 items-center gap-1.5 px-2 py-1.5 text-[13px] text-[#71716A] hover:text-[#1A1A1A]"
          >
            <LogOutIcon className="h-4 w-4" /> Sign out
          </button>
        </div>

        {error && (
          <div className="rounded-[2px] border-[1.5px] border-[#9A3B34] bg-transparent px-3 py-2 text-[13px] text-[#9A3B34]">
            {error}
          </div>
        )}

        <div className="grid gap-10 md:grid-cols-[220px_1fr]">
          <nav aria-label="Onboarding progress" className="hidden md:block">
            {railSteps.map((s, i) => (
              <ProgressRailStep key={s.anchor} index={i + 1} isLast={i === railSteps.length - 1} {...s} />
            ))}
          </nav>

          <div className="max-w-2xl space-y-6">
        {/* Step 1 — business profile */}
        <Card id="onb-step-1" className="scroll-mt-6 rounded-[2px] border-[#DAD5C8] bg-[#FCFBF7] shadow-none">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <StepBadge done={profileDone} />
            <div>
              <CardTitle
                className="text-[15px] font-normal text-[#1A1A1A]"
                style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500 }}
              >
                Business profile
              </CardTitle>
              <CardDescription className="text-[13px] text-[#71716A]">How your quotes are labelled and priced.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name" className="text-[13px] font-medium text-[#1A1A1A]">Business name<Req /></Label>
              <Input
                id="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Golden Steel Supplier Co"
                className="rounded-[2px] border-[#DAD5C8] bg-white text-[#1A1A1A] shadow-none placeholder:text-[#9A998F] focus-visible:ring-[#1A1A1A]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency" className="text-[13px] font-medium text-[#1A1A1A]">Currency<Req /></Label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="flex h-9 w-full rounded-[2px] border border-[#DAD5C8] bg-white px-3 py-1 text-[13px] text-[#1A1A1A] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]"
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
              <Label htmlFor="rev" className="text-[13px] font-medium text-[#1A1A1A]">Reviewer email<Req /></Label>
              <Input
                id="rev"
                type="email"
                value={reviewerEmail}
                onChange={(e) => setReviewerEmail(e.target.value)}
                placeholder="boss@company.com"
                className="rounded-[2px] border-[#DAD5C8] bg-white text-[#1A1A1A] shadow-none placeholder:text-[#9A998F] focus-visible:ring-[#1A1A1A]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="basis" className="text-[13px] font-medium text-[#1A1A1A]">
                Price basis <span className="text-[11px] font-normal text-[#71716A]">(optional)</span>
              </Label>
              <Input
                id="basis"
                value={priceBasis}
                onChange={(e) => setPriceBasis(e.target.value)}
                placeholder="e.g. Ex-works"
                className="rounded-[2px] border-[#DAD5C8] bg-white text-[#1A1A1A] shadow-none placeholder:text-[#9A998F] focus-visible:ring-[#1A1A1A]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validity" className="text-[13px] font-medium text-[#1A1A1A]">
                Quote validity in days <span className="text-[11px] font-normal text-[#71716A]">(optional)</span>
              </Label>
              <Input
                id="validity"
                type="number"
                value={validityDays}
                onChange={(e) => setValidityDays(e.target.value)}
                placeholder="30"
                className="rounded-[2px] border-[#DAD5C8] bg-white text-[#1A1A1A] shadow-none placeholder:text-[#9A998F] focus-visible:ring-[#1A1A1A]"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
              <Button
                onClick={saveProfile}
                disabled={busy || !profileValid}
                className="rounded-[2px] border-[1.5px] border-[#1A1A1A] bg-[#1A1A1A] text-[#FCFBF7] shadow-none transition-transform hover:-translate-y-px hover:bg-[#1A1A1A]"
              >
                Save profile
              </Button>
              {!profileValid && (
                <span className="text-[11px] text-[#71716A]">Business name, currency and reviewer email are required.</span>
              )}
              {profileDone && <span className="text-[11px] text-[#1D7A46]">Saved.</span>}
            </div>
          </CardContent>
        </Card>

        {/* Step 2 — Gmail */}
        <Card id="onb-step-2" className="scroll-mt-6 rounded-[2px] border-[#DAD5C8] bg-[#FCFBF7] shadow-none">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <StepBadge done={gmailDone} />
            <div>
              <CardTitle
                className="text-[15px] font-normal text-[#1A1A1A]"
                style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500 }}
              >
                Connect Gmail
              </CardTitle>
              <CardDescription className="text-[13px] text-[#71716A]">
                The mailbox your agent reads RFQs from and sends quotes with.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {gmailDone ? (
              <p className="text-[13px] text-[#1D7A46]">Gmail connected.</p>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={connectGmailFlow}
                  disabled={busy || !profileDone}
                  className="rounded-[2px] border-[1.5px] border-[#1A1A1A] bg-transparent text-[#1A1A1A] shadow-none hover:-translate-y-px hover:bg-transparent"
                >
                  <MailIcon className="mr-2 h-4 w-4" /> Connect Gmail
                </Button>
                {!profileDone && <p className="text-[11px] text-[#71716A]">Save your business profile first.</p>}
              </>
            )}
          </CardContent>
        </Card>

        {/* Step 3 — data */}
        <Card id="onb-step-3" className="scroll-mt-6 rounded-[2px] border-[#DAD5C8] bg-[#FCFBF7] shadow-none">
          <CardHeader className="flex flex-row items-center gap-3 space-y-0">
            <StepBadge done={dataDone} />
            <div>
              <CardTitle
                className="text-[15px] font-normal text-[#1A1A1A]"
                style={{ fontFamily: "'Fraunces', Georgia, serif", fontWeight: 500 }}
              >
                Upload your catalog data
              </CardTitle>
              <CardDescription className="text-[13px] text-[#71716A]">
                A single file or a .zip / .tar.gz of your price data (max 100 MB).
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <label
              className={`inline-flex items-center gap-2 rounded-[2px] border border-[#DAD5C8] bg-white px-3 py-2 text-[13px] text-[#1A1A1A] ${
                busy || !gmailDone ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-[#1A1A1A]"
              }`}
            >
              <UploadIcon className="h-4 w-4" />
              {busy ? "Uploading…" : "Choose file"}
              <input type="file" className="hidden" onChange={onUpload} disabled={busy || !gmailDone} accept=".zip,.tar,.tar.gz,.tgz,.gz,.csv,.xlsx,.json,.txt,.pdf" />
            </label>
            {!gmailDone && <p className="text-[11px] text-[#71716A]">Connect Gmail first.</p>}
            <div className="rounded-[2px] border border-[#DAD5C8] bg-white p-3">
              <FileTree nodes={tree} />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          {!allDone && <span className="text-[13px] text-[#71716A]">Complete all three steps to finish.</span>}
          <Button
            onClick={finish}
            disabled={!allDone || busy}
            className="rounded-[2px] border-[1.5px] border-[#1A1A1A] bg-[#1A1A1A] text-[#FCFBF7] shadow-none transition-transform hover:-translate-y-px hover:bg-[#1A1A1A]"
          >
            {busy && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            Finish setup
          </Button>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
