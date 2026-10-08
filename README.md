# Grab SQA Reference Prototype

Reference prototype for the Final Capstone Project "Enterprise SQA Transformation Strategy for Grab" (Software Quality Assurance).
It simulates two core workflows (Food Ordering, Ride Booking) to demonstrate the proposed SQA approach. It does not connect to any real Grab system, and all metrics data is simulated.

## Contents

| Path | Purpose |
|---|---|
| `server.js` | Express mock API: `/api/order`, `/api/ride` (with validation), `/api/metrics` (simulated data) |
| `public/index.html` | Mock UI that calls the APIs |
| `public/dashboard.html` | Quality Metrics Dashboard (DORA + Defect Density) |
| `tests/` | Playwright tests with Page Object Model (FO-001/002, RB-001/002, DB-001/002) |
| `k6-load-test.js` | k6 load test (P95 < 2s, error rate < 1%) |
| `.github/workflows/ci.yml` | CI: npm audit + Playwright, SonarQube Quality Gate, k6 |

## Run locally

```bash
npm ci
npx playwright install chromium
npm test            # starts the server automatically
npm start           # http://localhost:3000 and /dashboard.html
```

Use `PORT=3157 npm test` if port 3000 is taken.

## CI secrets

The `sonarqube` job needs repository secrets `SONAR_TOKEN` and `SONAR_HOST_URL`.
