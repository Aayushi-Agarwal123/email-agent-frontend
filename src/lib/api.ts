import fixtures from './fixtures.json';
import catalogFixture from './catalog-fixture.json';
import type {
  MetricsOverviewV1,
  MetricsConversationsPageV1,
  MetricsQuotationsPageV1,
  MetricsReviewQueueV1,
} from './metrics-contract';

// Live mode when VITE_API_BASE_URL is set (the dashboard BFF / metrics API);
// otherwise serve the bundled populated fixtures so the whole UI builds and
// previews with no backend. The tenant-scoped bearer token comes from the BFF;
// in local preview it's supplied via VITE_METRICS_TOKEN.
const BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;
const TOKEN = import.meta.env.VITE_METRICS_TOKEN as string | undefined;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function get<T>(path: string, fixture: T): Promise<T> {
  if (BASE) {
    const res = await fetch(`${BASE}${path}`, {
      headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return (await res.json()) as T;
  }
  await delay(300);
  return fixture;
}

const F = fixtures as unknown as Record<string, { populated: unknown }>;

export function fetchOverview(tenantId: string): Promise<MetricsOverviewV1> {
  return get(
    `/v1/tenants/${tenantId}/metrics/overview`,
    F['GET /v1/tenants/{tenantId}/metrics/overview']!.populated as MetricsOverviewV1,
  );
}

export function fetchConversations(tenantId: string): Promise<MetricsConversationsPageV1> {
  return get(
    `/v1/tenants/${tenantId}/conversations?limit=20&offset=0`,
    F['GET /v1/tenants/{tenantId}/conversations?limit=20&offset=0']!.populated as MetricsConversationsPageV1,
  );
}

export function fetchQuotations(tenantId: string): Promise<MetricsQuotationsPageV1> {
  return get(
    `/v1/tenants/${tenantId}/quotations?limit=20&offset=0`,
    F['GET /v1/tenants/{tenantId}/quotations?limit=20&offset=0']!.populated as MetricsQuotationsPageV1,
  );
}

export function fetchReviewQueue(tenantId: string): Promise<MetricsReviewQueueV1> {
  return get(
    `/v1/tenants/${tenantId}/review-queue`,
    F['GET /v1/tenants/{tenantId}/review-queue']!.populated as MetricsReviewQueueV1,
  );
}

// ── Catalog ──────────────────────────────────────────────────────────────────
// The tenant's price catalog is owned by the external RAG retrieval service, not
// the metrics API. Until that service exposes a catalog list endpoint, this is
// fixture-backed. Shape mirrors a RAG catalog item (id/category/label/attributes/
// unitPrice), so wiring it to the RAG endpoint later is a base-URL swap.
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
