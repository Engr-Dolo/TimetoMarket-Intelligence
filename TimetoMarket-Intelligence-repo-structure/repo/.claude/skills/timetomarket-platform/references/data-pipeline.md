# Data Pipeline Reference

## Purpose

The shared AI data pipeline is the bridge between Layer 1 (TimetoMarket) and Layer 2 (Network Intelligence Suite). It must enforce privacy guarantees while producing useful aggregated datasets.

## Telemetry Events (from Layer 1)

Layer 1 services emit events to `data-pipeline/ingestion/` for actions like:
- A listing created (crop type, approximate location at a coarse granularity, timestamp)
- A transaction completed (amount bucket, agent ID, timestamp, coarse location)
- A USSD/WhatsApp session occurring from a given coarse location (for coverage/mobility signals)

**Event payloads must NOT include**: farmer names, phone numbers, exact GPS coordinates, message content, or any other directly identifying information. If a field could identify an individual, it either gets hashed/bucketed at the point of emission, or it doesn't get emitted at all.

## Ingestion (`ingestion/`)

- Receives telemetry events
- Applies anonymization rules immediately:
  - Location: bucket to a coarse grid (e.g. ~1km cells) or administrative region, never exact coordinates
  - IDs: hash any identifiers needed for de-duplication (e.g. agent ID for fraud detection) — never store raw phone numbers
  - Time: bucket to hour/day granularity where finer granularity isn't needed
- Writes anonymized events to a staging dataset (Parquet/CSV for prototypes, Postgres table for later)

## Aggregation (`aggregation/`)

Produces three (extensible) aggregated datasets, one per Layer 2 module:

1. **Coverage + mobility + trade density** (for Infrastructure Investment Planner)
   - Grid cell → coverage gap score, mobility volume, trade transaction density
2. **Agent transaction patterns** (for Agent Fraud Shield)
   - Agent (hashed ID) → time-series of transaction volume/amount features
3. **Regional communication patterns** (for Public Health Early-Warning Dashboard)
   - Region → time-series of aggregate communication volume metrics

Each aggregation job is a discrete script (e.g. `build_coverage_dataset.py`) that reads from the ingestion staging dataset and writes to a per-module output table/file.

## Models (`models/`)

Shared base classes/utilities reused across Layer 2 modules, e.g.:
- A generic anomaly detection base class (used by both Fraud Shield and Health Dashboard, with different feature sets)
- A spatial scoring utility (used by Infrastructure Planner)

Keep these generic — module-specific logic (feature engineering, thresholds) lives in the respective `network-intelligence/*` module, not here.

## Privacy Checklist (apply to every new pipeline component)

- [ ] No field that could identify an individual farmer, buyer, or agent survives past `ingestion/` in reversible form
- [ ] Location data is bucketed/coarsened, never exact
- [ ] Any identifier needed for cross-event linkage (e.g. tracking an agent over time) is a one-way hash
- [ ] Aggregated outputs operate on groups (grid cells, agents, regions), never individuals
- [ ] New telemetry event types are documented here before being emitted from Layer 1
