# ussd-gateway

USSD session handling for farmer access — TimetoMarket Layer 1.

**Status:** Prototype

## Overview

Exposes a single webhook endpoint (`POST /ussd`) that Orange/Africa's Talking USSD
aggregators call on each keypress. Returns `CON <text>` to continue the session or
`END <text>` to terminate it.

USSD screens are capped at 160 characters. Each menu option line is kept to ≤ 30
characters so the text fits on basic feature phones without wrapping.

## Structure

```
src/
  index.js          Express app + /ussd webhook
  menus/
    index.js        Menu tree and session-flow handler
  session/
    store.js        In-memory session store (Redis-ready interface)
tests/
  menus.test.js     Unit tests for menu navigation logic
.env.example        Required environment variables
```

## Running locally

```bash
cp .env.example .env
npm install        # from repo root: npm install
npm run dev        # hot-reload via node --watch
```

Send a test USSD request:

```bash
curl -X POST http://localhost:3000/ussd \
  -d "sessionId=test-001&serviceCode=*384*0%23&phoneNumber=%2B231700000000&text="
```

## Environment variables

| Variable           | Description                              |
|--------------------|------------------------------------------|
| `PORT`             | HTTP port (default: 3000)                |
| `USSD_SERVICE_CODE`| Service code from your gateway provider  |

## Roadmap

- [x] Express webhook + menu handler skeleton
- [x] In-memory session store
- [ ] Sell produce: crop listing flow (name, quantity, price, location)
- [ ] Buy produce: browse and filter active listings
- [ ] My account: view listings and transaction history
- [ ] Localization: French and Liberian English menu strings
- [ ] Swap in-memory store for Redis (multi-instance deployment)
