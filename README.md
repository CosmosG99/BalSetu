# RAKSHAK

RAKSHAK is a full-stack child-safety reporting and response platform built for real incident intake, AI-assisted triage, responder coordination, analytics, and public tracking.

It includes a React + Vite frontend, an Express + Node.js backend, Firebase-backed persistence, Groq-powered AI triage and summaries, Twilio WhatsApp integration, and an OpenStreetMap-based location search experience.

## Project Overview

RAKSHAK helps citizens quickly report missing, distressed, or unaccompanied children in transit hubs and public spaces. Reports are routed through a backend workflow that can:

- validate and store reports
- run AI-assisted safety triage
- assign or prioritize the case for responders
- send summary updates via WhatsApp
- expose a public tracking endpoint for case status lookup
- provide admin/responder dashboards for operational visibility

## Features

### Public-facing reporting
- Anonymous report submission flow for citizens
- Incident category selection and location input
- Optional photo evidence support
- AI triage preview and summary generation
- Case submission success flow with tracking ID

### Live backend services
- Firebase Admin SDK integration for persistent case storage
- Groq AI integration for triage and summary generation
- Twilio WhatsApp integration for summary delivery
- Express API routes for reports, tracking, dashboards, routing, matching, and notifications

### Responder and admin workflows
- Responder dashboard for case review and updates
- Case detail pages with timelines and audit history
- Routing and assignment workflow support
- Admin analytics dashboard
- Missing child matching assistance flow

### Map and location features
- OpenStreetMap Nominatim-based location suggestions
- Manual location entry fallback
- Current-location detection via browser geolocation

### Security and operational controls
- Production-ready backend configuration support
- Demo mode toggle for local testing
- Token-based local dev support via `ALLOW_DEMO_TOKENS`
- Runtime configuration logging for key services

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts
- Lucide icons

### Backend
- Node.js
- Express
- Firebase Admin SDK
- Twilio SDK
- Groq API client
- Zod validation

## Repository Structure

```text
RAKSHAK/
├── README.md
├── package.json
├── backend/
│   ├── app.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── README.md
│   ├── src/
│   └── test-flow.js
├── frontend/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── index.html
│   ├── public/
│   ├── src/
│   └── vite.config.ts
└── FRONTEND_BACKEND_INTEGRATION_PLAN.md
```

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+ installed
- npm installed
- Access to the required live services:
  - Firebase project and service account credentials
  - Groq API key
  - Twilio account credentials
  - Optional Anthropic API key if you want Claude-based triage

## Environment Setup

### 1) Backend environment
Copy the backend example env file and fill in the required values:

```bash
cd backend
copy .env.example .env
```

Then update the values in `backend/.env` for:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_STORAGE_BUCKET`
- `GROQ_API_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_NUMBER`
- `WHATSAPP_SUMMARY_TO`
- `AUTH_DEV_SECRET`

> Note: `DEMO_MODE=false` is recommended for real backend operation.

### 2) Frontend environment
Copy the frontend example env file:

```bash
cd frontend
copy .env.example .env
```

Update the frontend values in `frontend/.env`:

- `VITE_API_BASE_URL=http://localhost:5000`
- optional `VITE_API_TOKEN` for local testing

The location autocomplete uses OpenStreetMap Nominatim, so no dedicated map key is required.

## Installation

From the project root:

```bash
cd backend && npm install
cd ../frontend && npm install
```

## Running the Project

### Start the backend

```bash
cd backend
npm start
```

or for auto-reload during development:

```bash
cd backend
npm run dev
```

### Start the frontend

```bash
cd frontend
npm run dev
```

The frontend development server usually runs at:

- http://localhost:5173

The backend API usually runs at:

- http://localhost:5000

### Health check

```bash
curl http://localhost:5000/api/health
```

You should receive a JSON response with server health and runtime configuration details.

## Typical User Flow

### Citizen report flow
1. Open the frontend app.
2. Go to the report page.
3. Enter the incident location and description.
4. Optionally attach evidence.
5. Submit the report.
6. Review the AI triage result.
7. Receive a tracking ID and case submission confirmation.

### Responder flow
1. Open the responder dashboard.
2. Review active cases.
3. Open a case for details and timeline.
4. Update or route the case.
5. Use admin and analytics features for overview.

### Tracking flow
1. Open the public tracking page.
2. Enter the case reference ID.
3. View the public case status and timeline.

## Scripts

### Root scripts

```bash
npm run frontend:dev
npm run backend:dev
npm run backend:start
npm run build
npm run lint
```

### Frontend scripts

```bash
cd frontend
npm run dev
npm run build
npm run lint
npm run preview
```

### Backend scripts

```bash
cd backend
npm start
npm run dev
npm run seed
npm run test
```

## Important Notes

- `DEMO_MODE` should remain `false` for live operations.
- The backend includes live integrations for Firebase, Groq, and Twilio when the required environment values are present.
- If some keys are missing, the backend falls back gracefully in some areas, but production behavior is best when all required services are configured.
- The location search now uses OpenStreetMap Nominatim, so you do not need a Google Maps key for location autocomplete.

## Troubleshooting

### Backend does not start
- Verify that `backend/.env` exists and contains valid values.
- Check the Node.js version.
- Review the console logs for missing env variables or service initialization failures.

### Frontend cannot call the backend
- Confirm `VITE_API_BASE_URL` points to the correct backend URL.
- Make sure the backend is running on port `5000`.

### Firebase or Twilio issues
- Confirm the credentials in `backend/.env` are correct.
- Check the backend console logs for initialization messages.

### Location search issues
- OpenStreetMap Nominatim is used for suggestions.
- If results are sparse, enter the location manually or use the preset transit hub buttons.

## Recommended Production Setup

For a real deployment, use:

- `NODE_ENV=production`
- `DEMO_MODE=false`
- valid Firebase credentials
- valid Groq API key
- valid Twilio WhatsApp credentials
- secure handling of `.env` files and deployment secrets

## License

This project is currently distributed without a separate public license file. If you are publishing or deploying it externally, confirm the appropriate licensing and ownership details with your team.

## Contributing

If you want to improve the project, you can:

1. create a feature branch
2. make your changes
3. run frontend/backend build checks
4. submit a pull request with a clear summary of the update
