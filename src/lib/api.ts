import fixtures from './fixtures.json';
import type { 
  MetricsOverviewV1, 
  MetricsConversationsPageV1, 
  MetricsQuotationsPageV1, 
  MetricsReviewQueueV1 
} from './metrics-contract';

export async function fetchOverview(_tenantId: string): Promise<MetricsOverviewV1> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return fixtures['GET /v1/tenants/{tenantId}/metrics/overview'].populated as unknown as MetricsOverviewV1;
}

export async function fetchConversations(_tenantId: string): Promise<MetricsConversationsPageV1> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return fixtures['GET /v1/tenants/{tenantId}/conversations?limit=20&offset=0'].populated as unknown as MetricsConversationsPageV1;
}

export async function fetchQuotations(_tenantId: string): Promise<MetricsQuotationsPageV1> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return fixtures['GET /v1/tenants/{tenantId}/quotations?limit=20&offset=0'].populated as unknown as MetricsQuotationsPageV1;
}

export async function fetchReviewQueue(_tenantId: string): Promise<MetricsReviewQueueV1> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return fixtures['GET /v1/tenants/{tenantId}/review-queue'].populated as unknown as MetricsReviewQueueV1;
}
