import fixtures from './fixtures.json';
import catalogFixture from './catalog-fixture.json';
import type {
  MetricsOverviewV1,
  MetricsConversationsPageV1,
  MetricsQuotationsPageV1,
  MetricsReviewQueueV1,
} from './metrics-contract';

// Live mode when VITE_API_BASE_URL is set (the metrics BFF); otherwise serve the
// bundled populated fixtures so the whole UI builds and previews with no backend.
const BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;
export const IS_LIVE = Boolean(BASE);

export interface Session {
  token: string;
  tenantId: string;
  email: string;
}

const SESSION_KEY = 'dash_session';
export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}
export function saveSession(s: Session): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
}
export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function req<T>(path: string, fixture: T, init?: RequestInit): Promise<T> {
  if (BASE) {
    const token = getSession()?.token;
    const res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: {
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers ?? {}),
      },
    });
    if (!res.ok) return fail(res);
    return (await res.json()) as T;
  }
  await delay(200);
  return fixture;
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
async function safeText(res: Response): Promise<string> {
  try {
    return (await res.json()).error ?? res.statusText;
  } catch {
    return res.statusText;
  }
}

// A 401 in live mode means the session is missing/expired — clear it and signal
// the app to return to login, so an expired token doesn't wedge the dashboard.
function onUnauthorized(): void {
  if (!BASE) return;
  clearSession();
  window.dispatchEvent(new Event("dashboard:unauthorized"));
}
async function fail(res: Response): Promise<never> {
  if (res.status === 401) onUnauthorized();
  throw new ApiError(res.status, await safeText(res));
}

const F = fixtures as unknown as Record<string, { populated: unknown }>;

export function fetchOverview(tenantId: string): Promise<MetricsOverviewV1> {
  return req(`/v1/tenants/${tenantId}/metrics/overview`, F['GET /v1/tenants/{tenantId}/metrics/overview']!.populated as MetricsOverviewV1);
}
export function fetchConversations(tenantId: string): Promise<MetricsConversationsPageV1> {
  return req(`/v1/tenants/${tenantId}/conversations?limit=20&offset=0`, F['GET /v1/tenants/{tenantId}/conversations?limit=20&offset=0']!.populated as MetricsConversationsPageV1);
}
export function fetchQuotations(tenantId: string): Promise<MetricsQuotationsPageV1> {
  return req(`/v1/tenants/${tenantId}/quotations?limit=20&offset=0`, F['GET /v1/tenants/{tenantId}/quotations?limit=20&offset=0']!.populated as MetricsQuotationsPageV1);
}
export function fetchReviewQueue(tenantId: string): Promise<MetricsReviewQueueV1> {
  return req(`/v1/tenants/${tenantId}/review-queue`, F['GET /v1/tenants/{tenantId}/review-queue']!.populated as MetricsReviewQueueV1);
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function postAuthSession(idToken: string): Promise<Session> {
  if (!BASE) throw new ApiError(0, 'login requires a live backend');
  const res = await fetch(`${BASE}/auth/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) throw new ApiError(res.status, await safeText(res));
  return (await res.json()) as Session;
}

// ── Settings (reviewer email) ────────────────────────────────────────────────

export interface SettingsData {
  reviewerEmail: string | null;
}

// Demo value so fixture-mode preview of the Settings page has something to edit.
let demoReviewer: string | null = 'reviewer@kfel.com';

export async function fetchSettings(tenantId: string): Promise<SettingsData> {
  if (!BASE) {
    await delay(150);
    return { reviewerEmail: demoReviewer };
  }
  const data = await req<{ reviewerEmail: string | null }>(`/v1/tenants/${tenantId}/settings`, { reviewerEmail: null });
  return { reviewerEmail: data.reviewerEmail };
}

export async function updateReviewerEmail(tenantId: string, reviewerEmail: string): Promise<SettingsData> {
  if (!BASE) {
    await delay(150);
    demoReviewer = reviewerEmail.trim().toLowerCase();
    return { reviewerEmail: demoReviewer };
  }
  const res = await fetch(`${BASE}/v1/tenants/${tenantId}/settings/reviewer-email`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getSession()?.token ?? ''}` },
    body: JSON.stringify({ reviewerEmail }),
  });
  if (!res.ok) return fail(res);
  const data = (await res.json()) as { reviewerEmail: string | null };
  return { reviewerEmail: data.reviewerEmail };
}

// ── Onboarding ────────────────────────────────────────────────────────────────

export interface TreeNode {
  name: string;
  type: "file" | "dir";
  size?: number;
  children?: TreeNode[];
}
export interface OnboardingState {
  onboarded: boolean;
  gmailConnected: boolean;
  hasData: boolean;
  displayName: string | null;
  currency: string | null;
  priceBasis: string | null;
  validityDays: number | null;
  reviewerEmail: string | null;
}
export interface ProfileInput {
  displayName: string;
  currency: string;
  priceBasis: string;
  validityDays: number;
  reviewerEmail: string;
}

async function authed<T>(path: string, method: string, body?: unknown): Promise<T> {
  const token = getSession()?.token;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) return fail(res);
  return (await res.json()) as T;
}

// Demo (fixture-mode) onboarding state, so the whole wizard is previewable offline.
const demoOnb: OnboardingState = {
  onboarded: false,
  gmailConnected: false,
  hasData: false,
  displayName: null,
  currency: null,
  priceBasis: null,
  validityDays: null,
  reviewerEmail: null,
};
let demoTree: TreeNode[] = [];

export async function fetchOnboarding(tenantId: string): Promise<OnboardingState> {
  if (!BASE) {
    await delay(150);
    return { ...demoOnb };
  }
  return authed(`/v1/tenants/${tenantId}/onboarding`, "GET");
}
export async function saveOnboardingProfile(tenantId: string, p: ProfileInput): Promise<OnboardingState> {
  if (!BASE) {
    await delay(150);
    Object.assign(demoOnb, { displayName: p.displayName, currency: p.currency.toUpperCase(), priceBasis: p.priceBasis, validityDays: p.validityDays, reviewerEmail: p.reviewerEmail });
    return { ...demoOnb };
  }
  return authed(`/v1/tenants/${tenantId}/onboarding/profile`, "PUT", p);
}
export async function completeOnboarding(tenantId: string): Promise<OnboardingState> {
  if (!BASE) {
    await delay(150);
    demoOnb.onboarded = true;
    return { ...demoOnb };
  }
  return authed(`/v1/tenants/${tenantId}/onboarding/complete`, "POST");
}
export async function connectGmail(tenantId: string, code: string, redirectUri: string): Promise<{ connected: boolean; address: string }> {
  return authed(`/v1/tenants/${tenantId}/gmail/connect`, "POST", { code, redirectUri });
}
/** Demo-mode Gmail "connect" (no real OAuth in fixture preview). */
export function connectGmailDemo(): void {
  demoOnb.gmailConnected = true;
}
export const IS_DEMO = !BASE;

export async function uploadFile(tenantId: string, file: File): Promise<{ tree: TreeNode[] }> {
  if (!BASE) {
    await delay(300);
    if (!demoTree.some((n) => n.name === file.name)) demoTree = [...demoTree, { name: file.name, type: "file", size: file.size }];
    demoOnb.hasData = true;
    return { tree: demoTree };
  }
  const token = getSession()?.token;
  const res = await fetch(`${BASE}/v1/tenants/${tenantId}/uploads?filename=${encodeURIComponent(file.name)}`, {
    method: "PUT",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: file,
  });
  if (!res.ok) return fail(res);
  return (await res.json()) as { tree: TreeNode[] };
}
export async function fetchUploads(tenantId: string): Promise<{ tree: TreeNode[] }> {
  if (!BASE) {
    await delay(150);
    return { tree: demoTree };
  }
  return authed(`/v1/tenants/${tenantId}/uploads`, "GET");
}

// ── Catalog (RAG-owned; fixture-backed until its endpoint exists) ────────────

export interface CatalogRow {
  id: string;
  category: string;
  label: string;
  attributes: Record<string, string>;
  unitPrice: number;
  unit: string | null;
  currency: string;
}
export interface CatalogPageData {
  rows: CatalogRow[];
  total: number;
}
export async function fetchCatalog(_tenantId: string): Promise<CatalogPageData> {
  await delay(200);
  return catalogFixture as CatalogPageData;
}
