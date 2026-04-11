# Testing Agent Instructions

Purpose: guide Copilot Agent Mode to generate reliable tests for this repository.

## Project-Specific Context
- API project name: `backend`
- API project file: `backend/backend.csproj`
- Frontend project path: `frontend/`
- Frontend framework: React + TypeScript (Vite)
- Backend framework: ASP.NET Core Web API (.NET 10)

## Non-Negotiable Testing Rule
- Copilot must **never weaken assertions to make tests pass**.
- Forbidden behavior:
  - Replacing specific assertions with vague checks (for example, replacing exact values with non-null checks).
  - Deleting failing assertions without adding stronger, correct replacements.
  - Broadening matchers in ways that reduce test meaning.
  - Marking tests skipped/ignored to hide failures.

## Preferred Assertion Style
Use clear AAA structure (Arrange, Act, Assert) and specific assertions.

### Backend (.NET)
- Prefer expressive assertions with FluentAssertions style where available (for example: `result.StatusCode.Should().Be(HttpStatusCode.OK)`).
- If FluentAssertions is not installed, use precise xUnit assertions (`Assert.Equal`, `Assert.NotNull`, `Assert.Collection`, `Assert.IsType`).
- Assert full response contracts, not only status codes.

### Frontend (React)
- Prefer React Testing Library + `@testing-library/jest-dom` assertions.
- Assert from user perspective by role/label/text (`getByRole`, `findByRole`, `getByLabelText`).
- Avoid implementation-detail assertions (component internals, private state).

### E2E (Playwright)
- Use Playwright `expect` assertions with semantic locators (`getByRole`, `getByLabel`, `getByText`).
- Assert user-visible behavior and key network outcomes.
- Include resilient waits via locator assertions, not fixed sleeps.

## Test Types the Agent Must Generate

### 1) Backend Unit Tests
Generate unit tests for:
- DTO validation logic and validators in `backend/Validators/`
- Reducible business logic and mapping logic
- Edge cases (invalid quantities, missing entities, empty carts, negative values)

Requirements:
- One behavior per test.
- Deterministic data setup.
- No external network/database dependencies.

### 2) Backend Integration Tests
Generate API integration tests for:
- `backend/Controllers/ProductsController.cs`
- `backend/Controllers/CartController.cs`

Requirements:
- Use `WebApplicationFactory` test host.
- Validate status codes + response body shape + key field values.
- Cover success and failure flows (`400`, `404`, validation errors).
- Keep tests isolated and reset state between tests.

### 3) Frontend Component/Integration Tests
Generate tests for:
- Cart context/reducer behavior in `frontend/src/contexts/` and `frontend/src/reducers/`
- UI components under `frontend/src/components/`
- Cart and product pages under `frontend/src/pages/`

Requirements:
- Test loading, success, and error UI states.
- Mock API boundaries (do not hit real backend in unit/component tests).
- Verify accessibility-oriented behavior (aria labels, keyboard interaction when relevant).

### 4) E2E Tests with Playwright
Generate end-to-end tests that cover:
- Product list load
- Product detail navigation
- Add to cart
- Cart quantity update
- Remove from cart
- Checkout form validation path

Requirements:
- Start from a known state.
- Use robust role-based locators.
- Capture useful debug artifacts on failure (trace/screenshot/video if configured).

## Commands (Repository Commands to Use)
Run from repository root unless noted.

### Backend tests
- `dotnet test backend/backend.csproj`
- Optional filter examples:
  - `dotnet test backend/backend.csproj --filter "Category=Unit"`
  - `dotnet test backend/backend.csproj --filter "Category=Integration"`

### Frontend tests
Run from `frontend/`:
- `npm test -- --run`

### Playwright E2E tests
Run from `frontend/`:
- `npx playwright test`

## Locations to Inspect Before Generating Tests

### Backend (API)
- Models: `backend/Models/`
- Controllers: `backend/Controllers/`
- DTOs: `backend/DTOs/`
- Validators: `backend/Validators/`
- Data/DbContext: `backend/Data/`
- Program and middleware wiring: `backend/Program.cs`, `backend/Middleware/`

### Frontend
- API layer (current service location): `frontend/src/api/` (for example `frontend/src/api/products.ts`)
- Components: `frontend/src/components/`
- Pages: `frontend/src/pages/`
- State context: `frontend/src/contexts/`
- Reducers: `frontend/src/reducers/`
- Types: `frontend/src/types/`

### Services Note
- There is currently no `backend/Services/` or `frontend/src/services/` folder in this repo.
- If service modules are introduced later, inspect those before creating tests.

## Generation Checklist for Copilot
Before writing tests:
1. Identify the exact behavior under test.
2. Identify observable outcomes (status code, rendered text, cart totals, etc.).
3. Pick strongest assertion that expresses intended behavior.
4. Add both happy path and at least one failure/edge case.

After writing tests:
1. Run relevant test command(s).
2. If tests fail, fix production code or test setup.
3. Do not dilute assertions.
4. Keep naming explicit: `MethodName_StateUnderTest_ExpectedBehavior`.

## Guardrails
- Do not modify production logic solely to satisfy a brittle test.
- Do not mock what you do not own unless needed for isolation boundaries.
- Prefer small focused test files close to the feature area.
- Keep test data realistic for ecommerce/cart scenarios.
