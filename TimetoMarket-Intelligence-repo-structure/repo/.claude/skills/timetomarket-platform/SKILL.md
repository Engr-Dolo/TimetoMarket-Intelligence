---
name: timetomarket-platform
description: "Use this skill whenever developing, extending, or reviewing code for TimetoMarket Intelligence — the two-layer AI agri-trade platform and Network Intelligence Suite for Liberia. Trigger this for ANY work inside the TimetoMarket-Intelligence repo: adding USSD/WhatsApp flows, AI listing/price-prediction/voice/vision modules, Orange Money escrow logic, the shared AI data pipeline, or any Network Intelligence Suite module (Infrastructure Planner, Fraud Shield, Health Dashboard). Also use when writing docs, READMEs, architecture notes, or planning new features for this project, even if the request doesn't mention these names directly (e.g. 'add a feature for farmers to track their sales' or 'build the fraud detection model'). This skill defines the project's architecture conventions, folder structure, privacy rules, tech stack choices, and coding standards — read it before writing any code or docs in this repo."
---

# TimetoMarket Intelligence — Platform Development Skill

This skill guides all development work on TimetoMarket Intelligence (TTMI), an AI-powered agri-trade platform and Network Intelligence Suite for Liberia, built for the Orange Summer Challenge 2026.

Read this file before writing any code, docs, or making architectural decisions in this repo. For deeper detail on a specific area, read the relevant file in `references/`.

## Project Shape (Always Keep In Mind)

Two layers sharing one AI data pipeline:

1. **TimetoMarket (Layer 1, consumer)** — USSD/WhatsApp/Orange Money agri-marketplace for farmers. Lives in `timetomarket/`.
2. **Network Intelligence Suite (Layer 2, B2B)** — three modules sold to Orange. Lives in `network-intelligence/{infrastructure-planner,fraud-shield,health-dashboard}/`.
3. **Shared AI Data Pipeline** — connects the two. Lives in `data-pipeline/`.

Every feature you build belongs in exactly one of these. If unsure where something goes, check `references/architecture.md`.

## Core Principles (Non-Negotiable)

1. **Accessibility-first for Layer 1**: Every farmer-facing feature must work over USSD or basic WhatsApp text — no smartphone, no app install, no data plan assumed. If a feature can't work in a USSD session (160-char screens, numeric menu navigation), it needs a WhatsApp/voice fallback, not a "smartphone app" fallback.

2. **Privacy-by-design for Layer 2**: Network Intelligence Suite modules NEVER touch individual communications content. Only anonymized, aggregated telemetry (already aggregated before it reaches `data-pipeline/`). When writing pipeline code, aggregate/anonymize at the earliest possible stage — see `references/data-pipeline.md`.

3. **Local-language and literacy awareness**: Any text-based farmer interaction needs a voice/audio alternative path in the design, even if not implemented yet. Don't design listing flows that assume English literacy.

4. **Low-bandwidth, low-compute by default**: Liberia has limited connectivity and most users are on 2G/3G. Favor lightweight payloads, async processing, and server-side AI inference (never assume client-side ML).

## Tech Stack Conventions

See `references/tech-stack.md` for the full breakdown. Summary:

- **USSD/WhatsApp gateway**: Node.js (Express) services — `timetomarket/ussd-gateway/`, `timetomarket/whatsapp-bot/`
- **AI/ML modules** (price prediction, voice-to-text, computer vision, anomaly detection): Python, with a thin REST API wrapper (FastAPI) so Node services can call them
- **Shared data pipeline**: Python, pandas/numpy for aggregation, designed as discrete ETL jobs (not one monolith)
- **Network Intelligence dashboards**: lightweight web dashboards (React + Tailwind, charts via Recharts), served separately from the consumer-facing app
- **Data storage**: start with SQLite/Postgres for prototypes; design schemas so they can later move to managed Postgres
- **Testing**: every module gets at least basic unit tests; AI modules get a small fixture dataset for repeatable testing

## Folder & Naming Conventions

- Folder names: kebab-case (`infrastructure-planner`, not `InfrastructurePlanner`)
- Each top-level module folder gets its own `README.md` describing scope, inputs/outputs, and status (Design / Prototype / Working)
- Python modules: snake_case files, `src/` layout (`module-name/src/module_name/`)
- Node modules: standard `src/`, `package.json` per service (not one giant monorepo package.json unless using workspaces — see `references/tech-stack.md`)
- Config/secrets: never commit `.env` files; always provide `.env.example`

## When Building a New Feature

1. Identify which layer/module it belongs to (Layer 1, Layer 2, or pipeline)
2. Check the relevant module's README for current status before assuming greenfield
3. Follow the tech stack convention for that module's language/framework
4. If it's farmer-facing, sanity-check against the USSD/literacy principles above
5. If it touches the pipeline, sanity-check against the privacy principles above
6. Update the module README's status/roadmap checklist as you go
7. Add a short note to `docs/architecture.md` if you've introduced a new component not already diagrammed

## Reference Files

- `references/architecture.md` — full system architecture, data flow, module boundaries
- `references/tech-stack.md` — detailed stack choices, libraries, and rationale per module
- `references/data-pipeline.md` — telemetry schema, anonymization/aggregation rules
- `references/coding-standards.md` — linting, formatting, commit message, and testing conventions

## Tone for Docs & Comments

This is a student-led early-stage project for a competition. Code comments and docs should be clear and professional but not overstate maturity — use "planned", "prototype", "initial implementation" language where accurate rather than implying production-readiness.
