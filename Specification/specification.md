<link rel="stylesheet" href="style.css">

# 📘 מסמך אפיון מערכת

## Car-Ops Agent

גרסה: 0.1 (MVP מוגדר)
סטאק: NestJS + React 18 + Vite + TypeORM + SQLite + BullMQ + Redis

---

# 1️⃣ תקציר מנהלים

Car-Ops Agent היא מערכת לוקאלית לניהול אחזקת רכב מבוססת AI.

המערכת:

* אוספת מסמכים (קבלות/תמונות תקלות)
* מחלצת נתונים אוטומטית
* בונה היסטוריית תחזוקה
* מספקת אבחון תקלות עם מקורות
* מתריעה לפני טיפולים (לפי זמן/ק״מ)
* שומרת Trace מלא לכל תהליך AI

אופי המערכת:

> מכונאי רגוע ומדויק + בקרת איכות + אנליסט עלויות

קהל יעד:

* אתה + אשתך (MVP)
* עתידי: קהילה

---

# 2️⃣ מטרות מערכת

## מטרות פונקציונליות

1. בניית היסטוריית תחזוקה אוטומטית מקבלות
2. אבחון תקלות עם רמת דחיפות + מקורות
3. ניהול עלויות שנתי וחודשי
4. תזכורות לפי זמן + 500 ק״מ לפני טיפול
5. תמיכה ברכבים מרובים
6. Trace מלא לכל ריצה של AI

## מטרות לימודיות (AI)

1. תכנון ארכיטקטורת סוכנים
2. בניית Tools עם הרשאות
3. Context Engineering עם CLAUDE.md
4. Observability מתקדם
5. AI Infrastructure לצוות
6. Sandboxing ואבטחת AI

---

# 3️⃣ Scope MVP

## כולל ב-MVP

* Multi-Car
* Upload קבלות ותמונות
* BullMQ Job Processing
* Receipt Parsing v1
* Timeline אוטומטי
* Dashboard בסיסי
* Chat בסיסי
* Investigate Mode (עם מקורות)
* Reminders (500 ק״מ לפני)
* Observability בסיסי

## לא כולל ב-MVP

* התמחרות אוטומטית עם מוסך
* אינטגרציה טלפונית
* אפליקציית מובייל
* חיבור חיצוני אוטומטי למוסכים

---

# 4️⃣ ארכיטקטורת מערכת

## מבנה שכבות

Frontend (React + Vite) <br>
↓<br>
Nest Controllers<br>
↓<br>
Application Services<br>
↓<br>
BullMQ Queue<br>
↓<br>
Workers<br>
↓<br>
AI Orchestrator<br>
↓<br>
Tools Layer<br>
↓<br>
DB + Logs + Drive<br>

---

# 5️⃣ מודולי Backend (NestJS)

## 1. AuthModule

* משתמשים
* Roles (Owner / Partner)

## 2. CarsModule

* CRUD רכבים
* Multi-Car support
* יצירת תיקיות Drive לרכב

## 3. DriveModule

* upload
* list
* download
* manual scan

## 4. DocumentsModule

* שמירת metadata למסמכים
* קישור ל-carId

## 5. JobsModule

* BullMQ integration
* Job lifecycle
* retry/backoff

## 6. ParsingModule

* parse_receipt
* analyze_issue_image

## 7. TimelineModule

* איחוד expenses + maintenance + issues

## 8. RemindersModule

* חישוב תזכורות לפי זמן/ק״מ

## 9. ChatModule

* Orchestrator
* Modes: quick / investigate / plan

## 10. ObservabilityModule

* agent_runs
* tool_calls
* correlationId

## 11. SecurityModule

* Tool scopes
* Secret management
* Confirmation policies

---

# 6️⃣ מודל נתונים (TypeORM Entities)

## users

id, role, createdAt

## cars

id, ownerId, make, model, year, engine, transmission

## drive_folders

carId, receiptsFolderId, issuesFolderId

## documents

id, carId, type, driveFileId, checksum, status

## jobs

id, documentId, type, status, attempts, error

## expenses

id, carId, date, amount, vendor, category, odometerKm

## maintenance_events

id, carId, eventType, parts, labor, vendor, odometerKm

## issues

id, carId, title, severity, status, suspectedCauses

## reminders

id, carId, dueDate, dueOdometerKm, rule

## agent_runs

id, mode, status, startedAt, endedAt

## tool_calls

id, agentRunId, toolName, input, output, status

## sources

id, agentRunId, type, title, url, confidence

---

# 7️⃣ Agents Architecture

## 1. Ingestion Agent

Trigger: Upload
Steps:

1. Extract text (OCR)
2. Parse structured fields
3. Validate
4. Save entities
5. Update reminders

Retry logic אם חסרים שדות.

---

## 2. Diagnosis Agent

Trigger: תמונת תקלה / שאלה בצ’אט

Steps:

1. Analyze image/text
2. Classify severity
3. Generate checks
4. Web search (Investigate mode בלבד)
5. Extract sources
6. Produce structured answer

Guardrails:

* לא לנחש
* לציין uncertainty
* להציע פנייה למוסך אם נדרש

---

## 3. Cost Analyst Agent

* מגמות
* חריגות
* עלות לק״מ

---

# 8️⃣ Chat Response Structure (Standard)

כל תשובה במצב Investigate כוללת:

1. סיכום הבעיה
2. רמת דחיפות
3. בדיקות עצמאיות
4. מה לשאול במוסך
5. מקורות
6. רמת ביטחון

פורמט אחיד נשמר ב-CLAUDE.md

---

# 9️⃣ AI Infrastructure for Teams

בתוך ה-repo:

```bash
/ai
 /prompts
 /tools
 /evals
 /runbooks
```

## Prompt Registry

כל prompt:

* name
* version
* schema
* allowed_tools

## Tool Manifest

JSON Schema לכל tool
כולל scopes והרשאות

## Eval Suite

Fixtures:

* קבלות לדוגמה
* תמונות נורות
* שאלות נפוצות

בדיקות:

* האם receipt מחזיר amount/date?
* האם investigate מחזיר לפחות 2 מקורות?
* האם severity קיים?

## Contribution Rules

* שינוי prompt מחייב bump גרסה
* Tool חדש מחייב schema
* אין שינוי בלי eval

---

# 🔟 Observability

לכל Agent Run נשמר:

* input
* steps
* tool calls
* retries
* duration
* sources
* errors

UI מאפשר צפייה ב-trace מלא.

---

# 1️⃣1️⃣ Security & Sandboxing

* אין SQL חופשי מה-AI
* אין גישה ל-secrets ב-frontend
* Tools מוגבלים לפי carId
* פעולות רגישות דורשות אישור משתמש
* Audit log לכל פעולה חיצונית

---

# 1️⃣2️⃣ Roadmap עתידי

שלב 2:

* get_car_specs Skill מלא
* Export PDF מקצועי
* השוואת מחירים אוטומטית

שלב 3:

* הכנת תסריט שיחה למוסך
* ניתוח הצעת מחיר והשוואה לשוק

שלב 4:

* Marketplace לקהילה
* Multi-user cloud version

---

# 1️⃣3️⃣ Definition of Done (MVP)

✔ Upload יוצר expense אוטומטי<br>
✔ Timeline מציג היסטוריה מלאה<br>
✔ Chat עונה עם מבנה אחיד<br>
✔ Investigate כולל מקורות<br>
✔ Reminders עובדים לפי ק״מ<br>
✔ כל Agent Run נשמר עם trace<br>

---
---
---

# 🎨 אפיון מסכים ו-UX – Car-Ops Agent

גרסה: UX Spec v1
Framework: React 18 + Vite
Design principle:

> “פשוט כברירת מחדל, עמוק כשצריך”

---

# 🧭 ניווט ראשי (Main Navigation)

Sidebar קבוע (Desktop-first):

1. **Garage**
2. **Dashboard**
3. **Timeline**
4. **Upload**
5. **Chat**
6. **Observability** (Advanced)
7. **Settings / Security**

Header עליון:

* בחירת רכב (Dropdown Multi-Car)
* שם משתמש
* מצב מערכת (Jobs Running / Errors)

---

# 🚗 מסך: Garage

## מטרה

ניהול רכבים ותיקיות Drive.

## רכיבים

### רשימת רכבים

Card לכל רכב:

* כינוי
* יצרן / דגם / שנה
* מנוע / תיבה
* כמות אירועים
* כפתור “בחר”

---

### Create Car Modal

שדות:

* יצרן
* דגם
* שנה
* מנוע
* תיבה
* כינוי לרכב

עם יצירה:

* נוצר root folder ב-Drive
* נוצרת תיקיית Receipts
* נוצרת תיקיית Issues
* נשמרים folderIds ב-DB

אפשרות:

* “בחר תיקייה קיימת במקום ליצור חדשה”

---

# 📊 מסך: Dashboard

## מטרה

תמונה יומית ברורה.

---

## ברירת מחדל (Simple View)

Card 1:

### “הדבר הבא שצריך לעשות”

* סוג: טיפול שמן
* עוד 380 ק״מ
* או: בעוד 12 ימים
* כפתור “פרטים”

Card 2:

### הוצאה חודשית

₪ X

Card 3:

### הוצאה שנתית

₪ X

Card 4:

### עלות לק״מ

₪ X/km

כפתור מרכזי:

### “שאל את המכונאי”

---

## Advanced View (Toggle)

### פילוח לפי קטגוריות

Pie/Bar:

* טיפולים
* דלק
* ביטוח
* חלקים
* תקלות

### תקלות פתוחות

* רשימה קצרה
* severity badge
* כפתור “חקור”

### תקלות חוזרות

* אם אותה תקלה חזרה X פעמים

---

# 📂 מסך: Upload

Tabs:

## 1️⃣ Receipts

Upload Zone:

* Drag & Drop
* בחירת קובץ

אחרי העלאה:

* סטטוס Job:

  * pending
  * running
  * failed
  * done

תצוגת תוצאות:

| שדה     | ערך        | ניתן לעריכה |
| ------- | ---------- | ----------- |
| תאריך   | 12/01/2025 | ✔           |
| ק״מ     | 82,000     | ✔           |
| סכום    | 950 ₪      | ✔           |
| ספק     | מוסך כהן   | ✔           |
| קטגוריה | טיפול שמן  | ✔           |

כפתור:

* “הרץ עיבוד עכשיו”
* “אשר ושמור”

---

## 2️⃣ Issues (תקלות / נורות)

Upload תמונה

לאחר עיבוד:

* זוהתה נורת מנוע
* Severity: Medium
* כפתור “חקור עכשיו”

---

# 🕒 מסך: Timeline

## פילטרים

* רכב
* טווח תאריכים
* קטגוריה
* סוג אירוע

---

## תצוגה כרונולוגית

Event Card:

כותרת:
“טיפול שמן + פילטר”

פרטים:

* תאריך
* ק״מ
* ספק
* סכום

מקור:

* קישור למסמך Drive

כפתורים:

* “שאל על האירוע בצ’אט”
* “ערוך”

---

# 💬 מסך: Chat (לב המערכת)

שלושה מצבים:

---

## 🟢 Quick Help

* תשובה מהירה
* ללא חיפוש חיצוני

---

## 🔎 Investigate

כולל:

* web.search tool
* מקורות
* סרטוני YouTube
* רמת ביטחון

---

## 📋 Plan

יצירת משימה:

* השוואת מחירים
* תכנון טיפול
* הכנת תסריט שיחה

---

## מבנה תשובה קבוע

### סיכום הבעיה

טקסט ברור ופשוט.

### רמת דחיפות

Low / Medium / High
כולל: “מתי לא לנסוע”

### בדיקות עצמאיות

1.
2.
3.

### מה לשאול במוסך

* שאלה 1
* שאלה 2

### מקורות

* קישור
* סרטון
* פורום

### רמת ביטחון

אחוז / Low/Medium/High

### אי-ודאות

מה לא בטוח.

---

# 🔬 מסך: Observability (מתקדם)

## רשימת Runs

טבלה:

| ID | סוג | סטטוס | זמן ריצה | כמות Tool Calls |

---

## Run Detail View

### Timeline של Steps

1. parse_receipt
2. validate
3. save_expense
4. update_reminder

---

### Tool Calls

| Tool | Input | Output | Status | Duration |

---

### Errors / Retries

אם קיימים.

---

### Token Usage

אם זמין.

---

# 🔐 מסך: Settings / Security

---

## Users

* Owner
* Partner

ניהול הרשאות.

---

## Tool Permissions

Toggle לכל Tool:

* Drive
* Web
* DB
* Filesystem
* Export

---

## Secrets

* Google API
* Web search API
* אחרים

גישה רק ל-Owner.

---

## Safety Policies

Checkbox:

* Require Confirmation for external actions
* Allow web search only in Investigate
* Allow auto-reminders creation

---

# 🧠 חוויית משתמש כוללת

## עקרונות UX

1. 80% שימוש = Dashboard + Chat
2. הכל ניתן לחקירה עמוקה
3. אין אוטומציה חיצונית בלי אישור
4. תמיד יש שקיפות מלאה למה שה-AI עשה