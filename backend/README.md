# RAKSHAK Backend — Child-Safety Incident Reporting & Case Management

The complete, demo-ready backend for **RAKSHAK**, an AI-assisted child-safety incident reporting and case-management platform built for hackathon evaluation and production readiness.

---

## 1. Features Overview

1. **Citizen Reporting**: Public reporting with anonymous option, incident categorization, location capture, and optional evidence photo.
2. **WhatsApp Reporting**: Stateful conversational bot via Twilio WhatsApp API returning an encrypted Case ID.
3. **AI-Assisted Triage**: Claude 3.5 Sonnet classification, risk indicator extraction, urgency scoring, and actionable recommendations with mandatory human verification (`humanVerificationRequired: true`).
4. **Case Management**: Case lifecycle tracking (`new` → `under_review` → `assigned` → `escalated` → `resolved`), timeline events, and internal confidential notes.
5. **Citizen Case Tracking**: Privacy-preserving tracking by Case ID. Strictly hides exact GPS coordinates, responder PII, internal notes, and AI confidence data.
6. **Responder Dashboard**: Real-time queues for `new`, `high-priority`, and `assigned` cases with multi-field search.
7. **Smart Responder Routing**: Workload-balanced auto-routing matching responder zone, specialization tags, and lowest active caseload.
8. **Potential Missing-Child Matching**: Vector cosine similarity engine matching incident photos against synthetic missing-child records with human verification flow.
9. **Map & Location**: GeoJSON FeatureCollection with priority-coded markers and zone-based density heatmaps.
10. **Notifications**: Internal alert stream with FCM push dispatch triggers on case creation, assignments, and escalations.
11. **Community Reporter Network**: Fast-track reporting pipeline for verified transit workers and volunteers.
12. **Admin & Analytics**: Aggregate KPIs on case totals, resolution rates, priority distribution, category frequencies, and resolution durations.
13. **Safety & Privacy**: Strict omission of `reporterId` for anonymous reports, audit logging on all PII access, and input sanitization.
14. **Multilingual Support**: Dynamic i18n support for English (`en`), Hindi (`hi`), and Marathi (`mr`).
15. **Offline / Low Connectivity**: Native idempotency on `clientReportId` for individual reports and batch sync.
16. **Demo Mode**: One-click database reset and seeding with 3 official hackathon scenarios.

---

## 2. Quick Start

### Prerequisites
- **Node.js**: v20+ (tested on Node v22)
- **npm**: v10+

### Installation
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install
```

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default `.env` configuration:
```env
PORT=5000
NODE_ENV=development
DEMO_MODE=true

# Anthropic Claude API (Optional for demo - intelligent fallback engine is active if key is unset)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Firebase Admin SDK (Optional - high-fidelity in-memory Firestore is active if unset)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
FIREBASE_STORAGE_BUCKET=
FIRESTORE_EMULATOR_HOST=

# Twilio WhatsApp Business API (Optional - logs to console in demo mode)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

> **Zero-Config Hackathon Mode**: If Firebase, Claude, or Twilio API keys are left blank, the backend automatically runs in **Resilient In-Memory Mode**. It seeds the demo dataset into memory, uses the built-in deterministic AI triage engine, and logs WhatsApp/FCM messages to the terminal.

---

## 3. Running the Backend

### Start in Development Mode (with hot-reload)
```bash
npm run dev
```

### Start in Production Mode
```bash
npm start
```

### Seed Demo Data Standalone
```bash
npm run seed
```

### Run End-to-End Test Suite
```bash
npm test
```
The test suite executes 65 automated assertions covering all 16 feature sets, privacy guarantees, and edge cases.

---

## 4. API Endpoints

All authenticated routes require `Authorization: Bearer <token>`.
In demo mode, you can use:
- `Bearer demo-responder` (Inspector Vikram Patil)
- `Bearer demo-admin` (Dr. Sunita Sharma)
- `Bearer demo-superadmin`

| Group | Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- | :--- |
| **System** | `GET` | `/api/health` | Public | Server health status |
| **Reports** | `POST` | `/api/reports` | Public (Rate-limited) | File new report |
| | `POST` | `/api/reports/sync` | Public (Rate-limited) | Idempotent batch offline sync |
| **WhatsApp** | `POST` | `/api/whatsapp/webhook` | Public | Twilio WhatsApp conversational webhook |
| **Tracking** | `GET` | `/api/track/:caseId` | Public (Rate-limited) | Privacy-safe case status |
| **Cases** | `GET` | `/api/cases` | Responder / Admin | List/filter cases |
| | `GET` | `/api/cases/:id` | Responder / Admin | Detailed case view (Audit-logged) |
| | `PATCH` | `/api/cases/:id` | Responder / Admin | Update status/notes/priority |
| | `GET` | `/api/cases/:id/timeline` | Responder / Admin | Case timeline history |
| **Dashboard**| `GET` | `/api/dashboard/new` | Responder / Admin | New cases queue |
| | `GET` | `/api/dashboard/high-priority` | Responder / Admin | High/critical priority cases |
| | `GET` | `/api/dashboard/assigned/:id` | Responder / Admin | Cases assigned to responder |
| | `GET` | `/api/dashboard/search` | Responder / Admin | Search across cases |
| **Routing** | `POST` | `/api/cases/:id/auto-route` | Admin / System | Smart auto-route to responder |
| **Matching** | `POST` | `/api/matching/run/:reportId` | Responder / Admin | Run missing-child vector match |
| | `GET` | `/api/matching/:reportId/candidates` | Responder / Admin | Get candidate matches |
| | `POST` | `/api/matching/:matchId/verify` | Responder / Admin | Confirm/reject match |
| **Map** | `GET` | `/api/map/incidents` | Responder / Admin | GeoJSON FeatureCollection |
| | `GET` | `/api/map/heatmap` | Responder / Admin | Zone density aggregation |
| **Alerts** | `GET` | `/api/notifications/:userId` | Authenticated | User notifications |
| | `PATCH` | `/api/notifications/:id/read` | Authenticated | Mark notification as read |
| **Reporters**| `POST` | `/api/reporters/register` | Public | Register volunteer/worker |
| | `POST` | `/api/reporters/:id/quick-report` | Volunteer | Quick report with prefilled reporter |
| | `GET` | `/api/reporters/:id/history` | Admin | Submission history |
| **Admin** | `GET` | `/api/admin/stats/overview` | Admin | Overview KPIs |
| | `GET` | `/api/admin/stats/by-priority` | Admin | Priority distribution |
| | `GET` | `/api/admin/stats/by-category` | Admin | Category breakdown |
| | `GET` | `/api/admin/stats/by-location` | Admin | Location density |
| | `GET` | `/api/admin/stats/resolution-times` | Admin | Resolution time analytics |
| **Demo** | `POST` | `/api/demo/reset` | Admin (`DEMO_MODE=true`) | Reset & reseed 3 scenarios |

---

## 5. How to Trigger Demo Mode

1. Ensure `DEMO_MODE=true` is present in `backend/.env`.
2. Send an authenticated POST request to reset the database:
   ```bash
   curl -X POST http://localhost:5000/api/demo/reset \
     -H "Authorization: Bearer demo-admin" \
     -H "Content-Type: application/json"
   ```
3. The database will reset with exactly 3 realistic scenarios:
   - **`RAK-LST01`**: Lost/Distressed child at Mumbai Central Railway Station (Platform 4).
   - **`RAK-UNA02`**: Unaccompanied minor at Pune Swargate Bus Terminal.
   - **`RAK-TRF03`**: Suspected trafficking concern at Dadar Central Station East parking.
4. Active synthetic missing child records (`MC-2026-081`, `MC-2026-094`, `MC-2026-102`) will be available for facial matching demos.

---

## 6. Privacy & Security Compliance

- **Zero Reporter PII for Anonymous Reports**: When `anonymous: true`, the `reporterId` field is omitted from the document completely.
- **Data Leak Prevention in Citizen Tracking**: The public tracking endpoint `/api/track/:caseId` strips exact coordinates, address strings, internal responder notes, AI raw scores, and officer IDs.
- **Audit Logging**: Every mutation, status shift, auto-routing step, and PII view is recorded with timestamp and actor ID in `auditLogs`.
- **Strict Validation**: All endpoints reject unrecognized payload keys using `zod` `.strict()` schemas.
- **Rate Limiting**: Public endpoints are shielded by `express-rate-limit`.
