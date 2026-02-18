# Car-Ops Agent

> A local AI-powered car maintenance management system (Hebrew / RTL)

**Stack:** NestJS · React 18 · Vite · TypeORM · SQLite · BullMQ · Redis · Claude AI

---

## Overview

Car-Ops Agent is a local system for managing vehicle maintenance powered by Claude AI. It acts as a combination of a calm and precise mechanic, a quality control analyst, and a cost analyst.

### Core capabilities

- **Automatic document processing** — upload receipts and issue photos; AI extracts all fields
- **Maintenance history** — built automatically from parsed receipts
- **AI diagnostics** — analyze issue photos with severity levels and self-check steps
- **Cost analysis** — monthly/annual expenses and cost per km
- **Smart reminders** — auto-created after each service; alert at 10% before next due date/km
- **Full traceability** — complete trace logs for all AI processes
- **Multi-vehicle support** — manage multiple cars in one system

---

## Getting Started

### Prerequisites

- Node.js 18+
- Redis (Windows: [Memurai](https://www.memurai.com/) via `choco install redis-64`)
- Anthropic API key (optional — mock mode available without it)

### Backend

```bash
cd Backend
npm install
cp .env.example .env      # then fill in ANTHROPIC_API_KEY, JWT_SECRET

# Start Redis first (Windows - Memurai runs as a Windows service)
net start memurai          # or start via Services panel

npm run start:dev          # starts on http://localhost:3001/api
```

> **Mock mode**: Leave `ANTHROPIC_API_KEY` as placeholder or set `USE_MOCK_AI=true` to run without a real API key. The full queue/upload/job flow still works with realistic mock data.

### Frontend

```bash
cd Frontend
npm install
npm run start              # starts Vite + opens browser automatically
```

The frontend proxies API calls to `http://localhost:3001/api`.

---

## Architecture

```
Frontend (React + Vite)
        ↓
NestJS Controllers (port 3001)
        ↓
Application Services
        ↓
BullMQ Queue (Redis)
        ↓
DocumentProcessingProcessor
        ↓
Claude AI (Vision API)
        ↓
SQLite (TypeORM) + data/uploads/
```

---

## Project Structure

```
cars-manager/
├── CLAUDE.md              # Project conventions for Claude Code
├── README.md              # This file
├── Specification/         # Product spec docs
│   └── specification.md
├── Backend/               # NestJS API server
│   ├── src/modules/       # auth, cars, documents, jobs, parsing, reminders, timeline
│   ├── data/              # SQLite DB + uploaded files (auto-created)
│   └── .env               # Environment variables
└── Frontend/              # React SPA
    └── src/app/
        ├── pages/         # Garage, Dashboard, Upload, Timeline, Chat, ...
        ├── api/           # API client + typed services
        ├── components/    # Shared UI components
        └── locales/       # Hebrew translations
```

---

## Implementation Status

### Phase 1 — Core API ✅
- NestJS scaffold + TypeORM + SQLite
- 13 database entities
- AuthModule (passwordless JWT)
- CarsModule (CRUD + odometer + stats)
- TimelineModule (union query)
- DocumentsModule (metadata)
- Frontend SPA connected to backend (RTL, Hebrew)
- Login page + auth context

### Phase 2 — AI Pipeline ✅
- Redis / BullMQ job queue
- `POST /api/documents/upload` — multipart, 20 MB, saved to `data/uploads/`
- JobsModule — lifecycle tracking (pending → running → done/failed), retry/backoff
- ParsingModule — Claude Vision API for receipts + issue photos; Hebrew prompts; mock mode
- RemindersModule — auto-create after every expense, time/km-based intervals
- Frontend Upload page — car selector, drag & drop, job polling, extracted fields display

### Phase 3 — Chat & Observability ⏳
- ChatModule (Quick / Investigate / Plan modes)
- ObservabilityModule (agent run traces, tool call logs)
- Google Drive integration
- Web search tool (Brave API)

### Phase 4 — Security & Production ⏳
- SecurityModule (tool scopes, confirmation policies)
- Audit log
- Production deployment

---

## API Reference

See [Backend/README.md](Backend/README.md) for the full list of endpoints with example requests.

---

## Key Design Decisions

| Decision | Choice |
|---|---|
| Database | SQLite (local, zero-ops) |
| Job queue | BullMQ + Redis (Memurai on Windows) |
| AI model | claude-opus-4-6 (Vision for images) |
| Auth | Passwordless — email only, JWT for session |
| RTL | `dir="rtl"` on root div, Tailwind logical properties |
| Mock mode | `USE_MOCK_AI=true` or no API key → full flow without Claude |

---

## Not in MVP

- Automatic garage pricing / quotes
- Phone integration
- Mobile application
- Automatic external garage connections
