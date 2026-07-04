/**
 * CONTRACT — the HTTP/JSON interface between this orchestrator's read-only
 * Metrics API and the external, multi-tenant Dashboard frontend (built in
 * parallel by a separate agent).
 *
 * This module is the SOURCE OF TRUTH for the wire shape. The orchestrator
 * produces exactly these shapes; the dashboard consumes them and needs no
 * orchestrator-specific glue. Version with `v`; add fields backward-compatibly,
 * never repurpose one. Prose companion: dashboard/metrics-export-api.md.
 *
 * Division of labour (see dashboard/PRD.md):
 *   - Orchestrator (this repo): persists an append-only event history and
 *     exposes it as tenant-scoped, read-only aggregate + list endpoints.
 *   - Dashboard service (them): owns login, maps a business owner's identity to
 *     a single tenant, mints a tenant-scoped token, and renders these payloads.
 *     One frontend for every tenant; the token decides the data.
 *
 * SECURITY INVARIANT (non-negotiable): every response is scoped to exactly one
 * tenant. The token carries the tenantId; the server rejects any request whose
 * path tenantId differs from the token's (403). The dashboard is structurally
 * incapable of requesting another tenant's data. `tenantId` is echoed in each
 * response purely so the client can assert it got what it asked for.
 */
import { z } from 'zod';

// ── Shared value objects ───────────────────────────────────────────────────

/** A monetary amount in the tenant's single currency (major units, e.g.
 *  rupees — the client handles lakh/comma formatting). One currency per tenant,
 *  taken from the tenant profile / retrieval descriptor. */
export const MetricsMoneyV1 = z
  .object({
    amount: z.number(),
    /** ISO-4217, e.g. "INR". */
    currency: z.string().min(1),
  })
  .strict();
export type MetricsMoneyV1 = z.infer<typeof MetricsMoneyV1>;

/** Conversation lifecycle stage (mirrors the orchestrator state machine). Kept
 *  as literals so the dashboard needn't import orchestrator internals. */
export const MetricsStageV1 = z.enum([
  'NEW',
  'COLLECTING',
  'AWAITING_CUSTOMER',
  'AWAITING_REVIEW',
  'QUOTED',
  'ESCALATED',
]);
export type MetricsStageV1 = z.infer<typeof MetricsStageV1>;

/** A KPI whose period-over-period change is a percentage (e.g. 12.4 = +12.4%
 *  vs the immediately preceding equal-length window). `deltaPct` is null when
 *  there is no prior window to compare against. */
const kpiPct = <T extends z.ZodTypeAny>(value: T) =>
  z.object({ value, deltaPct: z.number().nullable() }).strict();

/** A KPI whose change is expressed in percentage POINTS (for rates in 0..1;
 *  e.g. 5 = +5pp). Null when no prior window. */
const kpiPts = <T extends z.ZodTypeAny>(value: T) =>
  z.object({ value, deltaPts: z.number().nullable() }).strict();

const nonNegInt = z.number().int().nonnegative();

// ── GET /v1/tenants/{tenantId}/metrics/overview ─────────────────────────────
// The headline page: KPIs + the outcome funnel + the daily activity series.
// Every number here is derivable from the append-only event history, so the
// time-series and period-over-period deltas are honest (the operational tables
// are current-state only and cannot answer them).

/** The requested reporting window, echoed back. */
export const MetricsWindowV1 = z
  .object({
    from: z.string().datetime(),
    to: z.string().datetime(),
    granularity: z.enum(['day', 'week']),
  })
  .strict();
export type MetricsWindowV1 = z.infer<typeof MetricsWindowV1>;

/**
 * Outcome funnel — honest to the always-review design (every release is
 * human-approved, so there is no "auto-quoted, no human" bucket). Counts the
 * RFQ conversations in scope by their current disposition. `total` is the RFQ
 * denominator the client uses for percentages; `ignored` (non-RFQ inbound) is
 * reported alongside but excluded from `total`.
 */
export const MetricsFunnelV1 = z
  .object({
    total: nonNegInt,
    released: nonNegInt,
    awaitingReview: nonNegInt,
    clarifying: nonNegInt,
    escalated: nonNegInt,
    inProgress: nonNegInt,
    ignored: nonNegInt,
  })
  .strict();
export type MetricsFunnelV1 = z.infer<typeof MetricsFunnelV1>;

export const MetricsActivityPointV1 = z
  .object({
    /** Bucket start, "YYYY-MM-DD" (UTC) for granularity=day. */
    date: z.string(),
    received: nonNegInt,
    released: nonNegInt,
  })
  .strict();
export type MetricsActivityPointV1 = z.infer<typeof MetricsActivityPointV1>;

/**
 * Secondary metrics — context that sits under the four headline KPI tiles.
 * Plain values (no period-over-period deltas; the headline KPIs carry those).
 */
export const MetricsSecondaryV1 = z
  .object({
    /** Share of RFQs that needed >=1 clarification round-trip, in 0..1. */
    clarificationRate: z.number().min(0).max(1),
    /** Mean clarification round-trips per RFQ (conversation hopCount). */
    avgClarificationRounds: z.number().nonnegative(),
    /** escalated / received, in 0..1. */
    escalationRate: z.number().min(0).max(1),
    /** Median minutes the OWNER took to approve (review.requested ->
     *  quote.released) — the owner's own responsiveness. Null if none released. */
    medianApprovalTimeMinutes: z.number().nonnegative().nullable(),
    /** Total value of drafts currently AWAITING_REVIEW — the "waiting on you"
     *  nudge. A snapshot, not windowed. */
    valueAwaitingApproval: MetricsMoneyV1,
  })
  .strict();
export type MetricsSecondaryV1 = z.infer<typeof MetricsSecondaryV1>;

/** One row of the escalation-reason breakdown. `reason` is free-form (common:
 *  no_match, ambiguous, over_cap, non_quotable, reviewer_rejected) so new
 *  reasons don't break the contract. */
export const MetricsEscalationReasonV1 = z
  .object({
    reason: z.string(),
    count: nonNegInt,
  })
  .strict();
export type MetricsEscalationReasonV1 = z.infer<typeof MetricsEscalationReasonV1>;

/** Deliverability + agent-health surface, so an owner can see it's running and
 *  reachable. Bounce rate is windowed; the rest is a live snapshot. */
export const MetricsHealthV1 = z
  .object({
    live: z.boolean(),
    /** Gmail OAuth still valid; false surfaces a "reconnect Gmail" prompt. */
    gmailConnected: z.boolean(),
    lastPollAt: z.string().datetime().nullable(),
    /** bounced / sent over the window, in 0..1. */
    bounceRate: z.number().min(0).max(1),
    /** Inbound messages that dead-lettered and need a human — a live count. */
    deadLetteredCount: nonNegInt,
  })
  .strict();
export type MetricsHealthV1 = z.infer<typeof MetricsHealthV1>;

export const MetricsOverviewV1 = z
  .object({
    v: z.literal(1),
    tenantId: z.string(),
    window: MetricsWindowV1,
    kpis: z
      .object({
        /** Quotes approved and emailed to customers in the window. */
        quotesReleased: kpiPct(nonNegInt),
        /** Total value of released quotes (tenant currency). */
        valueReleased: kpiPct(MetricsMoneyV1),
        /** Headline efficiency (replaces the old "auto-quote rate", which is
         *  ~0 under mandatory review): share of RFQs carried end-to-end with NO
         *  clarification round-trip and NO escalation — agent did the whole job
         *  and left only approval. In 0..1. */
        straightThroughRate: kpiPts(z.number().min(0).max(1)),
        /** Median minutes from first customer message to released quote; null
         *  when nothing was released in the window. */
        medianTimeToQuoteMinutes: kpiPct(z.number().nonnegative().nullable()),
      })
      .strict(),
    secondary: MetricsSecondaryV1,
    funnel: MetricsFunnelV1,
    /** Why escalations happened, ranked; empty when none escalated. */
    escalationReasons: z.array(MetricsEscalationReasonV1),
    activity: z.array(MetricsActivityPointV1),
    /** Live count of conversations currently AWAITING_REVIEW (the "needs your
     *  attention" nudge). A snapshot, not windowed. */
    reviewQueueCount: nonNegInt,
    health: MetricsHealthV1,
  })
  .strict();
export type MetricsOverviewV1 = z.infer<typeof MetricsOverviewV1>;

// ── Pagination envelope ─────────────────────────────────────────────────────

export const MetricsPageInfoV1 = z
  .object({
    limit: nonNegInt,
    offset: nonNegInt,
    total: nonNegInt,
  })
  .strict();
export type MetricsPageInfoV1 = z.infer<typeof MetricsPageInfoV1>;

// ── GET /v1/tenants/{tenantId}/conversations ────────────────────────────────
// Recent conversations (the predecessor's "Recent Queries"), newest first.

export const MetricsConversationRowV1 = z
  .object({
    /** Stable conversation id = the mail threadId. */
    conversationId: z.string(),
    customerEmail: z.string(),
    subject: z.string().nullable(),
    /** Short preview of the latest customer message; may be absent. */
    snippet: z.string().nullable(),
    stage: MetricsStageV1,
    quotationNumber: z.string().nullable(),
    lineCount: nonNegInt.nullable(),
    lastActivityAt: z.string().datetime(),
  })
  .strict();
export type MetricsConversationRowV1 = z.infer<typeof MetricsConversationRowV1>;

export const MetricsConversationsPageV1 = z
  .object({
    v: z.literal(1),
    tenantId: z.string(),
    rows: z.array(MetricsConversationRowV1),
    page: MetricsPageInfoV1,
  })
  .strict();
export type MetricsConversationsPageV1 = z.infer<typeof MetricsConversationsPageV1>;

// ── GET /v1/tenants/{tenantId}/quotations ───────────────────────────────────
// Recent quotations (the predecessor's "Recent Quotations"), newest first.

export const MetricsQuotationStatusV1 = z.enum([
  'released',
  'awaiting_review',
  'draft',
]);
export type MetricsQuotationStatusV1 = z.infer<typeof MetricsQuotationStatusV1>;

export const MetricsQuotationRowV1 = z
  .object({
    quotationNumber: z.string(),
    conversationId: z.string(),
    customerEmail: z.string(),
    total: MetricsMoneyV1.nullable(),
    status: MetricsQuotationStatusV1,
    lineCount: nonNegInt,
    updatedAt: z.string().datetime(),
    /** When the quote was approved & sent; null until released. */
    releasedAt: z.string().datetime().nullable(),
  })
  .strict();
export type MetricsQuotationRowV1 = z.infer<typeof MetricsQuotationRowV1>;

export const MetricsQuotationsPageV1 = z
  .object({
    v: z.literal(1),
    tenantId: z.string(),
    rows: z.array(MetricsQuotationRowV1),
    page: MetricsPageInfoV1,
  })
  .strict();
export type MetricsQuotationsPageV1 = z.infer<typeof MetricsQuotationsPageV1>;

// ── GET /v1/tenants/{tenantId}/review-queue ─────────────────────────────────
// Read-only view of what currently awaits the owner's approval. In read-only
// scope the dashboard shows this as a to-do that links back to the email
// approval flow — it does NOT approve in-app (that would be a separate,
// authenticated command contract, out of scope here).

export const MetricsReviewRowV1 = z
  .object({
    conversationId: z.string(),
    customerEmail: z.string(),
    quotationNumber: z.string(),
    total: MetricsMoneyV1.nullable(),
    lineCount: nonNegInt,
    /** True when one or more lines came back with no price (blocks approval). */
    hasMissingPrices: z.boolean(),
    /** When the draft entered AWAITING_REVIEW. */
    waitingSinceAt: z.string().datetime(),
  })
  .strict();
export type MetricsReviewRowV1 = z.infer<typeof MetricsReviewRowV1>;

export const MetricsReviewQueueV1 = z
  .object({
    v: z.literal(1),
    tenantId: z.string(),
    rows: z.array(MetricsReviewRowV1),
  })
  .strict();
export type MetricsReviewQueueV1 = z.infer<typeof MetricsReviewQueueV1>;
