# Testing Evidence (April 11, 2026)

## Scope
This file captures evidence from one backend test run, one frontend test run, and one Playwright E2E run.

## 1) Prompt used with testing agent
> Generate a Playwright spec file from the steps you just executed.
> Use getByRole, getByLabel, or getByTestId where possible.
> Then run npx playwright test and show me the result.

## 2) Copilot mistake and detection
- **What went wrong:** The generated Playwright spec was saved to `frontend/tests/e2e/order-flow.spec.ts`.
- **Why this mattered:** Vitest picked up that file during `npm test -- --run` and attempted to execute Playwright `test()` in Vitest context.
- **How detected:** Frontend run failed with "Playwright Test did not expect test() to be called here" and stack trace pointing to `tests/e2e/order-flow.spec.ts:3`.

## 3) Commands run and outcomes

| Area | Command | Outcome | Notes |
|---|---|---|---|
| Backend | `dotnet test backend.Tests/backend.Tests.csproj` | PASS | 5 passed, 0 failed, duration ~5.6s |
| Frontend | `npm test -- --run` (in `frontend/`) | FAIL | 3 tests passed, 1 failed suite due to Playwright/Vitest runner conflict |
| E2E | `npx playwright test` (in `frontend/`) | FAIL | Failed at Step 1 (login/register UI missing on `/login`) |

## 4) Evidence snapshots / notes

### Backend test run (notes)
- Command: `dotnet test backend.Tests/backend.Tests.csproj`
- Summary: `total: 5, failed: 0, succeeded: 5, skipped: 0`
- Observation: test host and EF Core test DB initialized successfully; suite completed cleanly.

### Frontend test run (notes)
- Command: `npm test -- --run`
- Summary: `3 passed`, `1 failed suite`
- Failure detail: `tests/e2e/order-flow.spec.ts` was executed by Vitest and failed due to Playwright API usage in the wrong runner.

### E2E result (artifacts)
- Spec: `frontend/tests/e2e/order-flow.spec.ts`
- Run command: `npx playwright test`
- Failure step: Step 1, `/login`
- Failure message: `Login/register UI not found. The route currently renders blank and blocks the full E2E workflow.`
- Artifacts:
  - `test-results/order-flow-register-login-to-order-history-workflow-chromium/test-failed-1.png`
  - `test-results/order-flow-register-login-to-order-history-workflow-chromium/video.webm`
  - `test-results/order-flow-register-login-to-order-history-workflow-chromium/error-context.md`

## 5) Wednesday quality dimensions self-check

- **Functionality:** ⚠️ Partial
  - Product list/cart interactions exist.
  - Auth + checkout-to-order-history user journey is not currently executable.

- **Security:** ⚠️ Partial
  - Backend enforces `JWT_KEY` at startup.
  - Full authenticated user flow could not be validated because login route UI is blank.

- **Code quality:** ⚠️ Needs cleanup
  - E2E spec creation succeeded.
  - Test discovery boundaries need adjustment so Vitest does not execute Playwright specs.
