# Coding Standards Reference

## General

- Prefer clarity over cleverness — this is an early-stage student project that mentors/judges may read directly
- Every module folder has a `README.md` with: scope, status (Design / Prototype / Working), inputs/outputs, and a short roadmap checklist
- Update the relevant README's status and roadmap checklist as part of any feature PR/commit

## Python

- **Formatting**: `black` (default settings)
- **Linting**: `ruff` (or `flake8` if simpler for the environment)
- **Structure**: `src/` layout per module, e.g.:
  ```
  ai-listing-engine/
    src/
      ai_listing_engine/
        __init__.py
        price_prediction.py
        voice_to_listing.py
    tests/
      test_price_prediction.py
    requirements.txt
    README.md
  ```
- **Testing**: `pytest`; small fixture datasets in `tests/fixtures/`
- **Type hints**: use them for function signatures, especially on data pipeline and model code — helps catch schema mismatches early

## Node.js

- **Formatting**: `prettier` (default settings)
- **Linting**: `eslint` with a standard config
- **Structure**:
  ```
  ussd-gateway/
    src/
      index.js
      menus/
      session/
    tests/
    package.json
    .env.example
    README.md
  ```
- **Testing**: Jest or `node:test`

## React (Layer 2 dashboards)

- Functional components + hooks
- Tailwind for styling (no separate CSS files unless necessary)
- Charts via Recharts; maps via Leaflet or Mapbox GL
- Keep components small and colocate by feature (e.g. `components/CoverageMap/`)

## Commit Messages

Use conventional-commit-style prefixes for clarity:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation only
- `refactor:` code change that doesn't change behavior
- `test:` adding/updating tests
- `chore:` tooling, config, dependencies

Example: `feat(ai-listing-engine): add baseline price prediction model`

## Environment & Secrets

- Every service with external dependencies (APIs, DB connections) ships a `.env.example`
- Never commit real `.env` files — covered by root `.gitignore`

## Status Labels (use consistently in READMEs)

- **Design** — scoped, not yet implemented
- **Prototype** — basic working version, not production-ready, may use mocked data
- **Working** — functional with real data sources, has tests
