# Car-Ops Backend

AI-powered car maintenance management system backend built with NestJS.

## Quick Start

```bash
# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env: set ANTHROPIC_API_KEY, Redis settings, JWT_SECRET

# Start Redis (required for BullMQ)
# Windows: Memurai runs as a service — start via Services or:
net start memurai

# Start development server
npm run start:dev
```

Server runs on **http://localhost:3001/api**

> **Mock mode**: If `ANTHROPIC_API_KEY` is not set (or `USE_MOCK_AI=true`), the parsing service returns realistic mock data so you can test the full flow without an API key.

---

## API Endpoints

### Authentication
```http
POST   /api/auth/login         # Login with email (auto-creates user, returns JWT)
GET    /api/auth/me            # Get current user
```

### Cars
```http
GET    /api/cars               # List all cars
POST   /api/cars               # Create car
GET    /api/cars/:id           # Get car with stats
PATCH  /api/cars/:id           # Update car
PATCH  /api/cars/:id/odometer  # Update odometer
DELETE /api/cars/:id           # Delete car
```

### Documents & File Upload
```http
POST   /api/documents/upload   # Upload file (multipart/form-data) → triggers AI job
GET    /api/documents?carId=:id # List documents for car
GET    /api/documents/:id       # Get document metadata
DELETE /api/documents/:id       # Delete document
```

**Upload form fields:**
- `file` — PDF, JPG, PNG, WebP (max 20 MB)
- `carId` — UUID of the car
- `type` — `receipt` or `issue_photo`

Files are saved to `Backend/data/uploads/`.

### Jobs (AI Processing)
```http
GET    /api/jobs/:id           # Get job status (poll this after upload)
GET    /api/jobs?documentId=:id # List jobs for a document
```

**Job statuses:** `pending` → `running` → `done` | `failed`

### Reminders
```http
GET    /api/reminders?carId=:id           # List reminders for car
GET    /api/reminders/due-soon?carId=:id  # Get overdue/due-soon reminders
PATCH  /api/reminders/:id/complete        # Mark reminder completed
```

### Timeline
```http
GET    /api/timeline?carId=:id&fromDate=:date&toDate=:date&category=:cat&type=:type
```

Query params: `carId`, `fromDate`, `toDate`, `category`, `type` (receipt | issue | maintenance)

---

## Upload → AI Processing Flow

```
POST /api/documents/upload
        ↓
  Save file to data/uploads/
  Create Document record (status: uploaded)
  Create Job record
        ↓
  Push to BullMQ (Redis)
        ↓
  DocumentProcessingProcessor
        ↓
  Claude AI (or mock)
  parse_receipt → create Expense + auto-create Reminder
  analyze_issue → create Issue
        ↓
  Job status: done / failed
```

The frontend polls `GET /api/jobs/:id` every 2.5 s until terminal state.

---

## Database

SQLite database is auto-created at `Backend/data/car-ops.db`.

### Entities (13)

| Entity | Purpose |
|---|---|
| User | Owner/Partner roles, email-based auth |
| Car | Vehicle details + odometer |
| Expense | Financial transactions (auto-created from receipts) |
| MaintenanceEvent | Service history |
| Issue | Problems with severity (auto-created from issue photos) |
| Document | Uploaded file metadata |
| Job | BullMQ job state + input/output |
| Reminder | Time/km-based maintenance reminders (auto-created) |
| DriveFolders | Google Drive folder references |
| AgentRun | AI execution tracking |
| ToolCall | Tool invocations log |
| Source | Citations and references |
| Settings | User preferences |

---

## Modules

| Module | Status | Key capabilities |
|---|---|---|
| AuthModule | ✅ | JWT, no-password local auth |
| CarsModule | ✅ | CRUD, odometer, stats |
| DocumentsModule | ✅ | Multipart upload, file validation |
| TimelineModule | ✅ | Union query across expenses/maintenance/issues |
| JobsModule | ✅ | BullMQ queue, retry/backoff, job lifecycle |
| ParsingModule | ✅ | Claude Vision API (receipts + issue photos), mock mode |
| RemindersModule | ✅ | Auto-create on expense, time/km intervals |
| ChatModule | ⏳ Phase 3 | AI orchestrator, 3 modes |
| ObservabilityModule | ⏳ Phase 3 | Agent run traces |
| DriveModule | ⏳ Phase 3 | Google Drive sync |
| SecurityModule | ⏳ Phase 4 | Tool scopes, policies |

---

## File Structure

```
Backend/
├── src/
│   ├── database/
│   │   └── entities/          # 13 TypeORM entities
│   ├── modules/
│   │   ├── auth/              # JWT authentication
│   │   ├── cars/              # CRUD + odometer + stats
│   │   ├── documents/         # File upload + metadata
│   │   ├── timeline/          # Union query
│   │   ├── jobs/              # BullMQ + job lifecycle
│   │   │   └── processors/    # document-processing.processor.ts
│   │   ├── parsing/           # Claude AI receipt/issue parsing
│   │   └── reminders/         # Time/km reminder logic
│   ├── config/                # Database, Redis config
│   └── main.ts                # Entry point (port 3001, CORS)
├── data/
│   ├── car-ops.db             # SQLite database (auto-created)
│   └── uploads/               # Uploaded files (auto-created)
└── .env                       # Environment variables
```

---

## Environment Variables

```env
NODE_ENV=development
PORT=3001
DB_PATH=./data/car-ops.db

# Redis (required for BullMQ)
REDIS_HOST=localhost
REDIS_PORT=6379

# Claude AI (leave as placeholder to use mock mode)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
USE_MOCK_AI=false

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
```

---

## Scripts

```bash
npm run start:dev   # Development with watch mode
npm run build       # Production build
npm run start:prod  # Run production build
npm run lint        # ESLint
npm run format      # Prettier
```

---

## Status

| Phase | Status |
|---|---|
| Phase 1 — Core API (Auth, Cars, Timeline, Documents) | ✅ Complete |
| Phase 2 — BullMQ + AI Parsing + Reminders + Upload | ✅ Complete |
| Phase 3 — Chat, Observability, Google Drive | ⏳ Next |
| Phase 4 — Security, Production | ⏳ Future |
