# Frontend–Backend Integration Plan

## Goal

Replace the frontend's browser-local mock data with the RAKSHAK Express API while preserving every current UI workflow: public reporting and tracking, responder operations, map, matching, notifications, community reporters, admin analytics, demo controls, and offline sync.

## Current State

- The frontend calls `mockBackend`, `mockAiService`, and `mockMatchService`; it makes no HTTP API calls.
- The backend test suite passes **65/65** when `DEMO_MODE=true`.
- Without demo mode, test setup does not seed responders and missing-child records. This causes auto-routing and matching tests to fail.
- The two apps use different DTOs for categories, statuses, locations, timelines, analytics, and case details.

## Delivery Order

### 1. Stabilize the backend configuration

**Outcome:** local demo startup is repeatable and production-only behavior is safe.

1. Add `backend/.env` locally from `.env.example` with `DEMO_MODE=true`; never commit it.
2. Fix `backend/app.js` so the displayed environment and seeding condition use the same resolved value:
   - seed when `DEMO_MODE=true`;
   - optionally seed in development only when explicitly configured.
3. Make demo auth tokens available only when demo mode is enabled.
4. Restrict CORS in production to configured frontend origins instead of `origin: true`.
5. Change public reporter registration to create a `pending` reporter; only an authorized workflow can mark a reporter verified.

**Acceptance:** `npm.cmd test` passes from `backend` with the documented local environment, and `GET /api/health` shows the intended demo state.

### 2. Establish a single API contract

**Outcome:** the frontend never directly depends on raw backend persistence documents.

1. Create shared frontend DTOs under `frontend/src/api/` and document each API request/response.
2. Add conversion functions between API DTOs and presentational models. Keep these conversions in one place.
3. Resolve the category mismatch before implementation:
   - UI currently supports multiple incident types (`LOST`, `DISTRESSED`, etc.);
   - API accepts a single lowercase `category`.
   - Recommended: submit one primary backend category plus a `tags`/`observedIndicators` array that preserves every selected UI type.
4. Resolve status mismatch:
   - UI: `NEW`, `TRIAGED`, `ROUTED`, `INTERVENTION`, etc.;
   - API: `new`, `under_review`, `assigned`, `escalated`, `resolved`, `closed`.
   - Recommended: make backend statuses authoritative and render labels/colors through a UI status mapper. Do not invent local-only case states.
5. Normalize timestamps from Firestore/in-memory timestamp objects into ISO strings in API adapters.

**Acceptance:** API adapter unit tests cover category/status/timeline/date mapping, including unknown values.

### 3. Build the frontend API foundation

**Outcome:** every page has one reliable way to call the server.

1. Add `VITE_API_BASE_URL` to `frontend/.env.example` (for example, `http://localhost:5000`).
2. Add a Vite dev proxy for `/api` to the backend, avoiding local CORS friction.
3. Create `frontend/src/api/client.ts`:
   - typed `GET`, `POST`, and `PATCH` helpers;
   - JSON parsing and standardized API error type;
   - request cancellation and loading/error handling;
   - authorization-header support.
4. Create an auth/session context:
   - local demo session may use `demo-responder` and `demo-admin` only in demo mode;
   - production uses Firebase ID tokens;
   - citizen endpoints must not receive responder credentials.
5. Retire direct imports of mock services after each feature is migrated. Keep them only behind an explicit demo fixture switch if needed.

**Acceptance:** the frontend health check can call `/api/health`, show unavailable-server state, and recover after the backend starts.

### 4. Connect citizen report creation and offline sync

**UI:** `ReportPage`, `EvidenceUploader`, `LocationPicker`, `AIAnalysisModal`, `CaseSuccessCard`, `CaseContext`.

1. Add a station/location resolver that produces the required API location object:
   `{ lat, lng, addressText, zone }`.
2. Use device location only with consent; retain a station-directory fallback for known transit hubs.
3. Create a UUID client report ID before submitting. Call `POST /api/reports`.
4. Extend the create-report response with a safe triage summary if the UI must display it immediately; otherwise render a neutral confirmation and the case ID.
5. Replace fake image URLs with a defined storage/upload strategy. The API currently accepts a URL/base64-style field but has no upload endpoint.
6. Replace the current draft-only offline behavior with an outbox in IndexedDB/local storage. On reconnect, submit queued records to `POST /api/reports/sync` using their original client IDs.

**Acceptance:** submitting online creates a real case and returns a trackable ID; resubmission is idempotent; an offline record synchronizes exactly once.

### 5. Connect privacy-safe public tracking

**UI:** `TrackPage`.

1. Replace `getCaseById` with `GET /api/track/:caseId`.
2. Render only `caseId`, category, status, created/updated time, and `timelinePublic`.
3. Remove public display of location, reporter role, evidence, responder data, internal notes, and AI risk/confidence.
4. Add loading, invalid-ID, 404, rate-limit, and network-error states.

**Acceptance:** browser-visible tracking data matches the privacy-safe API response exactly.

### 6. Connect responder operations

**UI:** `ResponderDashboard`, `CaseTable`, `CaseDetailPage`, `ResponderMapPage`, `MapView`, `EvidenceViewer`, `AuditLogView`, `SmartRoutingCard`.

1. Load queues with `/api/dashboard/new`, `/api/dashboard/high-priority`, `/api/dashboard/assigned/:id`, and `/api/dashboard/search`.
2. Load case list/detail/timeline with `/api/cases`, `/api/cases/:id`, and `/api/cases/:id/timeline`.
3. Send status, priority, assignment, escalation, and internal-note changes through `PATCH /api/cases/:id`.
4. Trigger assignment through `POST /api/cases/:id/auto-route` and render the returned responder.
5. Load map features and heatmap from `/api/map/incidents` and `/api/map/heatmap`.
6. Load notifications with `/api/notifications/:userId`; mark them read using the PATCH endpoint.
7. Audit log display needs an API endpoint or a case-detail extension: audit records are written by the backend but are not currently returned to the frontend.
8. Evidence viewing needs role checks and a real evidence-storage/access policy before using non-synthetic media.

**Acceptance:** a responder can open a real case, update it, see the persisted timeline after refresh, route it, and see corresponding notification/map changes.

### 7. Connect matching, trusted reporters, admin, and demo controls

**Matching UI:** `MissingMatchesPage`

1. Make the selected case/report ID explicit.
2. Call `POST /api/matching/run/:reportId`, load candidates with `GET /api/matching/:reportId/candidates`, and verify with `POST /api/matching/:matchId/verify`.
3. Render the backend similarity range correctly: it is `0..1`, while the UI currently expects percentage values.

**Trusted reporter UI:** `TrustedReporterPage`

1. Collect a required phone/contact field and map occupation to API reporter type (`volunteer` or `transit_worker`).
2. Call `POST /api/reporters/register` and show the returned approval state.
3. Add a quick-report workflow using `POST /api/reporters/:id/quick-report` after the reporter is authorized.

**Admin UI:** `AdminDashboard`

1. Replace `mockBackend.getAnalytics()` with all five `/api/admin/stats/*` endpoints.
2. Build chart adapters for the backend's object-based priority/category/location responses.

**Demo UI:** `DemoModeBar`, `DemoModeDropdown`

1. Replace local reset with `POST /api/demo/reset` using demo-admin credentials.
2. Navigate to the API's seeded IDs (`RAK-LST01`, `RAK-UNA02`, `RAK-TRF03`) instead of creating browser-only scenarios.

**Acceptance:** each UI button calls its matching endpoint and reloads persisted API data.

### 8. Test and release

1. Add API-client unit tests for success, validation, unauthorized, forbidden, not-found, and network errors.
2. Add integration tests for:
   - report -> tracking;
   - report -> responder status update -> tracking;
   - report -> routing -> notification;
   - matching -> human verification;
   - reporter registration/approval -> quick report;
   - admin analytics and demo reset.
3. Run backend tests with demo mode and a non-demo configuration.
4. Run frontend typecheck and production build.
5. Perform a manual privacy review of public tracking and unauthenticated routes.
6. Verify production environment variables, Firebase configuration, storage policy, CORS, and rate limits before deployment.

## Endpoint-to-UI Checklist

| UI capability | Backend endpoint(s) | Auth |
| --- | --- | --- |
| Health | `GET /api/health` | Public |
| Create report / offline sync | `POST /api/reports`, `POST /api/reports/sync` | Public |
| Track report | `GET /api/track/:caseId` | Public |
| Responder cases / timeline / updates | `/api/cases`, `/api/cases/:id`, `/api/cases/:id/timeline` | Responder/Admin |
| Queues and search | `/api/dashboard/*` | Responder/Admin |
| Auto-routing | `POST /api/cases/:id/auto-route` | Responder/Admin |
| Map and heatmap | `/api/map/incidents`, `/api/map/heatmap` | Responder/Admin |
| Matching and verification | `/api/matching/*` | Responder/Admin |
| Notifications | `/api/notifications/*` | Authenticated |
| Reporter network | `/api/reporters/*` | Mixed |
| Admin analytics | `/api/admin/stats/*` | Admin |
| Demo reset | `POST /api/demo/reset` | Admin, demo only |

## Definition of Done

The mock services are no longer the source of truth; a submitted report survives browser refresh, receives an API case ID, can be tracked through the privacy-safe public view, and can be actioned through authenticated responder/admin UI. Every visible feature has a corresponding tested backend call, loading state, error state, and authorization rule.
