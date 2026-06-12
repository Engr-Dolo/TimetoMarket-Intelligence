# Shared AI Data Pipeline

Ingests anonymized, aggregated telemetry from TimetoMarket (transaction density, mobility patterns, signal-coverage signals) and feeds it to the Network Intelligence Suite modules.

## Planned components

- `ingestion/` — collects and anonymizes telemetry from Layer 1
- `aggregation/` — aggregates data into the formats each Layer 2 module needs
- `models/` — shared ML models (anomaly detection, spatial analysis, time series)

## Privacy principles

- No individual communications content is ever processed.
- All data is anonymized and aggregated before entering this pipeline.
