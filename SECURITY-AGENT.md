# Security Agent Instructions

Purpose: guide Copilot Agent Mode to review and harden API authentication/CORS safely, without breaking login flow.

## Project Context
- Backend project: `backend/backend.csproj`
- Backend startup: `backend/Program.cs`
- Backend config: `backend/appsettings.json`, `backend/appsettings.Development.json`
- Frontend origin (dev): `http://localhost:5173`
- Current CORS policy name: `AllowReactApp`

## Scope
The agent must:
1. Review JWT auth setup for common mistakes.
2. Review CORS setup for common mistakes.
3. Apply minimal, safe fixes.
4. Preserve login and authenticated API behavior.

---

## Non-Negotiable Rules
- Never disable auth checks to make requests pass.
- Never broaden CORS to `AllowAnyOrigin()` for credentialed auth flows.
- Never store JWT secrets in source code.
- Never remove `[Authorize]` or equivalent protections as a “fix.”
- Make smallest possible change set and verify behavior after each change.

---

## JWT Review Checklist (Common Mistakes)
Inspect:
- `backend/Program.cs`
- Any auth controller(s), token service(s), and user/auth DTOs
- `backend/appsettings*.json`

Check for:
1. **Missing auth middleware/order**
   - Ensure `AddAuthentication().AddJwtBearer(...)` is registered.
   - Ensure middleware order is correct: `UseAuthentication()` before `UseAuthorization()` before `MapControllers()`.
2. **Weak token validation**
   - `ValidateIssuerSigningKey = true`
   - `ValidateIssuer = true` and configured issuer
   - `ValidateAudience = true` and configured audience
   - `ValidateLifetime = true`
   - `ClockSkew` is minimal (for example 1–2 minutes, not large defaults).
3. **Insecure key handling**
   - Signing key loaded from configuration/secret store, not hardcoded.
   - Key length is strong for HMAC (at least 256-bit equivalent secret).
4. **Token content issues**
   - Token includes stable subject claim (`sub` or `NameIdentifier`) and required role/permission claims.
   - Expiration (`exp`) is set and reasonable.
5. **Authorization gaps**
   - Protected endpoints use `[Authorize]` where required.
   - Public endpoints are explicitly `[AllowAnonymous]` only when intended (login/register/health/docs as policy allows).
6. **Error handling/logging leaks**
   - Do not leak secret values or raw token contents in logs/exceptions.

### JWT Safe-Fix Strategy
- Add missing services/middleware with minimal edits in `Program.cs`.
- Move JWT settings to config section (`Jwt:Issuer`, `Jwt:Audience`, `Jwt:Key`).
- Keep existing login route contracts unchanged (request/response shape).
- If claims format changes are needed, preserve existing claim names used by current frontend.

---

## CORS Review Checklist (Common Mistakes)
Inspect:
- `backend/Program.cs`
- Any environment-specific CORS setup

Check for:
1. **Overly permissive policy**
   - Avoid `AllowAnyOrigin()` in production-like configs.
2. **Credentials mismatch**
   - If using cookies/credentials, require explicit origins and `AllowCredentials()`.
   - Never combine `AllowAnyOrigin()` with credentials.
3. **Incorrect origin list**
   - Include only required frontend origins (dev/prod).
   - Ensure exact scheme/host/port matches frontend.
4. **Middleware order mistakes**
   - `UseCors(...)` placed before auth/authorization-sensitive endpoints are mapped.
5. **Missing methods/headers**
   - Ensure required headers/methods for login and authorized API calls are allowed.

### CORS Safe-Fix Strategy
- Keep policy named and centralized (for example existing `AllowReactApp`).
- Restrict to known origins from configuration.
- Change only what is needed for login + API calls.
- Verify preflight (`OPTIONS`) and real authenticated requests after changes.

---

## “Do Not Break Login Flow” Verification Plan
After any security fix, verify:
1. Login endpoint still returns expected status/payload.
2. Token can be used on a protected endpoint (expect 200).
3. Missing/invalid token on protected endpoint returns 401/403 as expected.
4. Frontend can call login and protected API from allowed origin without CORS errors.
5. Disallowed origin is rejected by CORS policy.

---

## Suggested Commands
From repo root:
- Build backend: `dotnet build backend/backend.csproj`
- Run backend: `dotnet run --project backend/backend.csproj`

From frontend root (`frontend/`):
- Start frontend: `npm run dev`

For API checks (examples):
- Use `backend/backend.http` or HTTP client to validate login/protected endpoints.
- Confirm browser devtools shows no CORS failure for allowed origin.

---

## Output Format for Security Agent Runs
When reporting findings, always provide:
1. **Issue** (what is wrong)
2. **Risk** (why it matters)
3. **Exact file target(s)**
4. **Minimal fix**
5. **Login-flow verification result**

Keep fixes incremental and reversible.
