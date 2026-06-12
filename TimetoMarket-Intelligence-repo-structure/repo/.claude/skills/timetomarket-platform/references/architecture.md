# Architecture Reference

## System Diagram

```
Layer 1 — TimetoMarket (Consumer)
┌─────────────────────────────────────────────────────────┐
│  USSD / WhatsApp  →  AI Listing Engine  →  Orange Money  │
│  (farmer access)     (voice, price,        Escrow         │
│                       vision, logistics)   (payments)     │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼  anonymized telemetry
                ┌───────────────────────┐
                │  Shared AI Data        │
                │  Pipeline              │
                └───────────────────────┘
                          │
                          ▼
Layer 2 — Network Intelligence Suite (B2B for Orange)
┌──────────────────┬───────────────────┬──────────────────┐
│ Infrastructure    │ Agent Fraud       │ Public Health     │
│ Investment        │ Shield            │ Early-Warning     │
│ Planner           │                   │ Dashboard         │
└──────────────────┴───────────────────┴──────────────────┘
```

## Module Boundaries

### timetomarket/ (Layer 1)

| Folder | Responsibility | Calls out to |
|---|---|---|
| `ussd-gateway/` | USSD session handling, menu navigation, farmer registration | `ai-listing-engine/` (via REST), `payments/` |
| `whatsapp-bot/` | WhatsApp Business API integration, conversational flows | `ai-listing-engine/`, `payments/` |
| `ai-listing-engine/` | Voice-to-listing (NLP), price prediction, computer vision quality grading, logistics matching | `data-pipeline/` (emits telemetry events) |
| `payments/` | Orange Money escrow logic, transaction history | `data-pipeline/` (emits telemetry events) |

### data-pipeline/

| Folder | Responsibility |
|---|---|
| `ingestion/` | Receives telemetry events from Layer 1, immediately anonymizes/aggregates |
| `aggregation/` | Builds aggregated datasets per Layer 2 module's needs (coverage+mobility, agent transaction patterns, regional communication patterns) |
| `models/` | Shared ML models reused across Layer 2 modules (e.g. spatial scoring, anomaly detection base classes) |

### network-intelligence/ (Layer 2)

| Folder | Responsibility | Consumes from |
|---|---|---|
| `infrastructure-planner/` | Ranks candidate tower/fiber locations | `data-pipeline/aggregation/` (coverage + mobility + trade density) |
| `fraud-shield/` | Flags anomalous Mobile Money agent transactions | `data-pipeline/aggregation/` (agent transaction patterns) |
| `health-dashboard/` | Surfaces regional communication-pattern anomalies | `data-pipeline/aggregation/` (regional communication patterns) |

## Data Flow Rules

1. Layer 1 services emit **telemetry events** (not raw user data) to `data-pipeline/ingestion/`.
2. `ingestion/` anonymizes/strips identifiers immediately — nothing downstream of this point should contain farmer-identifiable data.
3. `aggregation/` produces per-module datasets on a schedule (batch) — Layer 2 modules read from these, never directly from `ingestion/`.
4. Layer 2 modules never call back into Layer 1 — the relationship is one-directional (telemetry flows up, infrastructure/business decisions flow to Orange separately, outside this codebase's scope).

## Adding a New Component

If you build something that doesn't fit an existing folder:
1. Decide which layer it belongs to using the table above as a model
2. Add a new kebab-case folder with its own `README.md` (status, scope, inputs/outputs)
3. Add a row to the relevant table in this file
4. Update the top-level `docs/architecture.md` diagram if the new component changes the data flow
