# Tech Stack Reference

## Layer 1 — TimetoMarket

### USSD Gateway (`timetomarket/ussd-gateway/`)
- **Language**: Node.js + Express
- **Why**: USSD gateways (e.g. Africa's Talking, Orange's own USSD aggregator) provide webhook-based HTTP APIs; Express is lightweight and fast to iterate on.
- **Session state**: Use Redis (or in-memory map for prototypes) keyed by session ID — USSD sessions are short-lived and stateless between requests, so state must be persisted server-side.
- **Menu structure**: Define menus as a simple JSON/JS tree (max ~5 options per screen, each line ≤ 30 chars to fit 160-char USSD screens).

### WhatsApp Bot (`timetomarket/whatsapp-bot/`)
- **Language**: Node.js + Express
- **Why**: Shares session/auth logic with USSD gateway where possible; WhatsApp Business API is webhook-based, same pattern.
- **Conversational flow**: Keep flows linear and numbered (e.g. "Reply 1 for Sell, 2 for Buy") to mirror USSD patterns for consistency, while allowing free-text voice notes for listings.

### AI Listing Engine (`timetomarket/ai-listing-engine/`)
- **Language**: Python + FastAPI (exposes REST endpoints consumed by the Node gateways)
- **Sub-components**:
  - *Voice-to-listing*: Speech-to-text (e.g. Whisper or a hosted STT API) → NLP parsing into structured fields (crop type, quantity, location, price expectation)
  - *Price prediction*: Time-series/regression model (start with simple seasonal-average baseline, e.g. scikit-learn, before reaching for deep learning)
  - *Computer vision quality grading*: Image classification model (start with a pretrained model fine-tuned on produce images, e.g. via a lightweight CNN or vision API)
  - *Logistics matching*: Simple nearest-neighbor / distance-based matching initially; can evolve to optimization later
- **Why Python**: ML ecosystem (scikit-learn, pandas, transformers, vision libraries) is strongest here; FastAPI keeps the integration surface simple for the Node gateways.

### Payments (`timetomarket/payments/`)
- **Language**: Node.js (co-locate with gateways since it's primarily API integration, not ML)
- **Integration**: Orange Money API for escrow hold/release
- **Data**: Transaction records stored in Postgres (or SQLite for prototypes), schema designed to support future credit-scoring use (see `data-pipeline/`)

## Shared AI Data Pipeline (`data-pipeline/`)

- **Language**: Python
- **Structure**: Discrete ETL jobs (not one monolith) — e.g. `ingestion/anonymize_telemetry.py`, `aggregation/build_coverage_dataset.py`
- **Libraries**: pandas, numpy for aggregation; consider Apache Airflow or simple cron-based scheduling once jobs multiply (not needed at prototype stage — a script run on a schedule is fine)
- **Storage**: Start with Postgres for aggregated datasets; raw telemetry (already anonymized) can live in flat files (Parquet/CSV) for prototypes

## Layer 2 — Network Intelligence Suite

### Infrastructure Investment Planner (`network-intelligence/infrastructure-planner/`)
- **Language**: Python (scoring model) + React/Tailwind dashboard
- **Model**: Spatial scoring — combine normalized coverage gap score, mobility density score, and trade density score into a weighted ranking. Start with a simple weighted sum before reaching for more complex spatial ML.
- **Visualization**: Map-based dashboard (e.g. Leaflet or Mapbox GL in the React frontend)

### Agent Fraud Shield (`network-intelligence/fraud-shield/`)
- **Language**: Python (model) + React/Tailwind dashboard
- **Model**: Start with statistical baselines (e.g. z-score on transaction velocity/amount per agent) before introducing ML classifiers (e.g. isolation forest)

### Public Health Early-Warning Dashboard (`network-intelligence/health-dashboard/`)
- **Language**: Python (model) + React/Tailwind dashboard
- **Model**: Time-series anomaly detection at regional granularity (e.g. rolling-average deviation on aggregated communication metrics)

### Dashboards (general)
- **Framework**: React + Tailwind CSS
- **Charts**: Recharts for time-series/bar/line; Leaflet/Mapbox GL for maps
- **Why**: Keeps Layer 2 dashboards lightweight and consistent; avoids heavy BI tooling at prototype stage

## Testing

- **Python**: pytest, with small fixture datasets in `tests/fixtures/`
- **Node**: Jest (or built-in `node:test` for lighter setups)
- Every module should have at least a smoke test verifying it starts/imports correctly before deeper logic tests are added

## Environment & Secrets

- Every service with external API keys (Orange Money, WhatsApp Business API, USSD gateway, STT/vision APIs) gets a `.env.example` listing required variables (no real values)
- Never commit `.env` files — already covered in root `.gitignore`
