# 🎉 Community Events Board

A full-stack web application where an **admin** posts local events and **visitors** browse, filter, personalise their experience, and design custom event cards.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [How to Run](#-how-to-run)
- [Admin Credentials](#-admin-credentials)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Database Design](#-database-design)
- [Styling Architecture](#-styling-architecture)
- [Three Short Answers](#-three-short-answers)
- [Known Limitations](#-known-limitations)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 16** (App Router, TypeScript) |
| Database | **SQLite** via `better-sqlite3` (file-based, zero setup) |
| Styling | **styled-components** v6 (SSR-ready, no Tailwind) |
| Auth | **JWT** (`jose`, HS256, 7-day expiry) + `bcryptjs` (cost 10) |
| Language | TypeScript throughout |
| Fonts | Inter (Google Fonts) |

---

## ✨ Features

### A — Admin

| # | Feature |
|---|---------|
| 1 | **Admin login** — hard-coded credentials, fully server-protected |
| 2 | **Create event** — title, category (Music/Workshop/Food/Sports/Kids), city, date & time, price, description, image URL |
| 3 | **Edit event** — update any field |
| 4 | **Activate / Deactivate** — toggle event visibility (no deletion) |
| 5 | **Dashboard** — stats grid (total / active / upcoming / inactive) + full events table |

### B — Visitors

| # | Feature |
|---|---------|
| 4 | **Events page** — only active, upcoming events, nearest date first |
| 5 | **Filters** — category + city + text search, all work together, with pagination (9 per page) |
| 6 | **Signup / Login** — email & password, returns a JWT |
| 7 | **Favourite categories** — picked at signup, editable later via Interests page |
| 8 | **My Feed** — upcoming events from favourite categories only |
| 9 | **Remind me** — optimistic UI update, saved to DB, reverts with message if save fails |

### C — Event Card Designer

| # | Feature |
|---|---------|
| 10 | **3 background themes** — Aurora, Sunset, Ocean |
| 10 | **5 stickers** — ⭐ 🔥 ❤️ 🎵 🚀, tap to add (max 3), tap again to remove |
| 10 | **Live preview** — card updates instantly with smooth animations |
| 10 | **Persisted** — design saved per user per event, survives page refresh |

### D — Quality

- ✅ Indian price format: **₹1,50,000** (using `en-IN` locale)
- ✅ Friendly dates: **Sat, 1 Nov, 8:00 PM**
- ✅ Loading states: skeleton card loaders
- ✅ Empty states: friendly messages with action buttons
- ✅ Error states: retry buttons with clear messages
- ✅ Responsive: works on both phone and laptop screens
- ✅ 15 sample events pre-seeded (various categories, cities, some inactive, some past)
- ✅ JSON API usable by any mobile client (Authorization: Bearer header)

---

## 🚀 How to Run

### Prerequisites

- **Node.js 18+** — [download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### Steps (under 5 minutes)

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd <repo-folder>

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

**Open:** [http://localhost:3000](http://localhost:3000)

> **No database setup needed.** The SQLite database (`data/events.db`) is created automatically on first run with 15 sample events pre-loaded.

### Environment Variables (Optional)

The app works out of the box without any `.env` file. To customise the JWT secret:

```env
# .env.local (optional)
JWT_SECRET=your-custom-secret-here
```

If not set, a default secret is used (fine for development).

### Production Build

```bash
npm run build
npm start
```

---

## 🔐 Admin Credentials

| Field | Value |
|-------|-------|
| **Email** | `admin@events.com` |
| **Password** | `Admin@1234` |
| **Login URL** | [http://localhost:3000/auth/login](http://localhost:3000/auth/login) |

After login, the admin is automatically redirected to `/admin/dashboard`.

### Admin Pages

| Page | URL |
|------|-----|
| Dashboard (stats + table) | `/admin/dashboard` |
| Manage Events (full table) | `/admin/events` |
| Create New Event | `/admin/events/new` |
| Edit an Event | `/admin/events/:id/edit` |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                      # Landing / Home
│   ├── layout.tsx                    # Root layout (SSR registry + ClientShell)
│   ├── not-found.tsx                 # Custom 404 page
│   ├── events/
│   │   ├── page.tsx                  # Public events listing with filters
│   │   └── [id]/page.tsx             # Event detail + Card Designer
│   ├── feed/page.tsx                 # My Feed (auth required)
│   ├── auth/
│   │   ├── login/page.tsx            # Login form
│   │   └── signup/page.tsx           # 2-step signup (credentials → categories)
│   ├── settings/
│   │   └── categories/page.tsx       # Update favourite categories
│   ├── admin/
│   │   ├── dashboard/page.tsx        # Admin dashboard
│   │   ├── events/page.tsx           # Manage events table
│   │   ├── events/new/page.tsx       # Create event form
│   │   └── events/[id]/edit/page.tsx # Edit event form
│   └── api/
│       ├── auth/login/route.ts       # POST — login
│       ├── auth/signup/route.ts      # POST — signup
│       ├── auth/logout/route.ts      # POST — logout
│       ├── auth/me/route.ts          # GET  — current user
│       ├── events/route.ts           # GET (public), POST (admin)
│       ├── events/[id]/route.ts      # GET (public), PATCH (admin)
│       ├── admin/events/route.ts     # GET — all events including inactive
│       ├── user/favourites/route.ts  # GET/PUT — favourite categories
│       ├── user/feed/route.ts        # GET — personalised feed
│       ├── user/reminders/route.ts   # GET/POST — reminders
│       ├── user/reminders/[eventId]/ # DELETE — remove reminder
│       └── user/card-design/[eventId]/ # GET/PUT — card design
├── components/
│   ├── Navbar.tsx                    # Sticky glassmorphism navbar
│   ├── EventCard.tsx                 # Event card with reminder toggle
│   ├── FilterBar.tsx                 # Search + category + city filters
│   ├── Pagination.tsx                # Page number navigation
│   ├── CardDesigner.tsx              # Live card designer (themes + stickers)
│   └── ClientShell.tsx               # Mounts GlobalStyles + AuthProvider
├── context/
│   └── AuthContext.tsx               # Global auth state (JWT, user, login/logout)
├── lib/
│   ├── db.ts                         # SQLite setup, schema, 15-event seed
│   ├── auth.ts                       # JWT sign/verify, requireAuth, requireAdmin
│   ├── format.ts                     # Indian currency + friendly date formats
│   └── StyledComponentsRegistry.tsx  # SSR style collection for App Router
└── styles/
    ├── theme.ts                      # Design tokens (colors, gradients, radii…)
    ├── GlobalStyles.ts               # createGlobalStyle (reset + body + keyframes)
    └── shared.ts                     # 25+ reusable styled-components primitives
```

---

## 🔌 API Reference

All authenticated endpoints accept `Authorization: Bearer <token>` in the header.  
The same token is also stored in an `httpOnly` cookie for browser clients.

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/signup` | — | Register with email + password. Returns `{ token, user }` |
| `POST` | `/api/auth/login` | — | Login. Returns `{ token, user }` |
| `POST` | `/api/auth/logout` | — | Clears auth cookie |
| `GET` | `/api/auth/me` | Bearer | Returns current user info |

**Login request body:**
```json
{ "email": "user@example.com", "password": "yourpassword" }
```

**Login response:**
```json
{
  "token": "eyJhbGci...",
  "user": { "id": "1", "email": "user@example.com", "role": "visitor" }
}
```

---

### Events (Public)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/events` | — | List active + upcoming events |
| `GET` | `/api/events/:id` | — | Get a single event |

**GET `/api/events` query parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `category` | string | Filter by category (`Music`, `Workshop`, `Food`, `Sports`, `Kids`) |
| `city` | string | Filter by city |
| `search` | string | Full-text search (title, description, city) |
| `page` | number | Page number (default: 1, page size: 9) |

All filters work together (AND logic). Example:
```
GET /api/events?category=Music&city=Coimbatore&search=night&page=1
```

**Response:**
```json
{
  "events": [...],
  "total": 1,
  "page": 1,
  "totalPages": 1
}
```

---

### Events (Admin only)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/events` | Admin | Create a new event |
| `PATCH` | `/api/events/:id` | Admin | Update any event field (incl. `is_active`) |
| `GET` | `/api/admin/events` | Admin | List ALL events (including inactive) |

**POST `/api/events` body:**
```json
{
  "title": "Chennai Jazz Night",
  "category": "Music",
  "city": "Chennai",
  "date_time": "2026-11-01T20:00:00",
  "price": 599,
  "description": "A soulful evening...",
  "image_url": "https://...",
  "is_active": true
}
```

---

### User (Auth required)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/user/favourites` | Bearer | Get favourite categories |
| `PUT` | `/api/user/favourites` | Bearer | Replace favourite categories |
| `GET` | `/api/user/feed` | Bearer | Upcoming events in favourite categories |
| `GET` | `/api/user/reminders` | Bearer | List reminded event IDs |
| `POST` | `/api/user/reminders` | Bearer | Add a reminder `{ eventId }` |
| `DELETE` | `/api/user/reminders/:eventId` | Bearer | Remove a reminder |
| `GET` | `/api/user/card-design/:eventId` | Bearer | Get saved card design |
| `PUT` | `/api/user/card-design/:eventId` | Bearer | Save card design |

**PUT `/api/user/favourites` body:**
```json
{ "categories": ["Music", "Food"] }
```

**PUT `/api/user/card-design/:eventId` body:**
```json
{ "theme": "sunset", "stickers": ["star", "fire"] }
```

---

## 🗄 Database Design

```sql
-- Users
users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'visitor',  -- 'visitor' | 'admin'
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
)

-- Events
events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT NOT NULL,
  category    TEXT NOT NULL,   -- Music | Workshop | Food | Sports | Kids
  city        TEXT NOT NULL,
  date_time   TEXT NOT NULL,   -- ISO 8601 string
  price       REAL NOT NULL DEFAULT 0,
  description TEXT NOT NULL DEFAULT '',
  image_url   TEXT NOT NULL DEFAULT '',
  is_active   INTEGER NOT NULL DEFAULT 1,  -- 1=active, 0=inactive
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
)

-- Favourite categories (join table)
user_favourite_categories (
  user_id  INTEGER NOT NULL REFERENCES users(id),
  category TEXT    NOT NULL,
  PRIMARY KEY (user_id, category)      -- composite PK prevents duplicates
)

-- Reminders
reminders (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id),
  event_id   INTEGER NOT NULL REFERENCES events(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, event_id)            -- idempotent: INSERT OR IGNORE
)

-- Card designs
card_designs (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER NOT NULL REFERENCES users(id),
  event_id   INTEGER NOT NULL REFERENCES events(id),
  theme      TEXT NOT NULL DEFAULT 'aurora',
  stickers   TEXT NOT NULL DEFAULT '[]',  -- JSON array e.g. '["star","fire"]'
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, event_id)            -- upsert via ON CONFLICT DO UPDATE
)
```

**Indexes:**
```sql
CREATE INDEX idx_events_category  ON events(category);
CREATE INDEX idx_events_city      ON events(city);
CREATE INDEX idx_events_date_time ON events(date_time);
CREATE INDEX idx_events_is_active ON events(is_active);
```

**Why this design?**  
Events are a flat table — every field is directly filterable and indexable. Favourites use a join table (one row per category per user) rather than a JSON column, so adding/removing categories is a clean INSERT/DELETE with no string parsing. Reminders and card designs both use `UNIQUE(user_id, event_id)`, enabling `INSERT OR IGNORE` (idempotent reminder) and `ON CONFLICT DO UPDATE` (upsert card design) without extra round-trips.

---

## 🎨 Styling Architecture

All styling is done with **styled-components** — no Tailwind, no CSS modules.

```
theme.ts          ← Design tokens (colors, gradients, shadows, radii, breakpoints)
    ↓
GlobalStyles.ts   ← createGlobalStyle (CSS reset, body bg, keyframes, scrollbar)
    ↓
shared.ts         ← Reusable primitives exported from one file:
                     PrimaryButton, GhostButton, GlassPanel, InputField,
                     SelectField, TextAreaField, Skeleton, EventGrid,
                     AdminTable, Toast, ErrorBox, SuccessBox, CenteredContent…
    ↓
Component files   ← Component-specific styled-components, extending shared
                     primitives and consuming theme tokens
```

**SSR:** `StyledComponentsRegistry` (in `src/lib/`) wraps the app in `StyleSheetManager` on the server and uses `useServerInsertedHTML` to flush collected styles into `<head>` before first paint — preventing any flash of unstyled content in the Next.js App Router.

---

## ❓ Three Short Answers

### 1 — Database Structure

The app has five normalised SQLite tables: `users`, `events`, `user_favourite_categories`, `reminders`, and `card_designs`.  
`events` is flat — every filterable column (`category`, `city`, `date_time`, `is_active`) is a direct column with its own index, so filters translate to a straightforward `WHERE` clause with no JSON parsing.  
`user_favourite_categories` is a proper join table with a composite primary key `(user_id, category)` — duplicates are structurally impossible; adding or removing a favourite is a single `INSERT` or `DELETE`.  
`reminders` and `card_designs` both carry `UNIQUE(user_id, event_id)`, so SQLite enforces idempotency at the database level: reminders use `INSERT OR IGNORE`; card designs use `ON CONFLICT DO UPDATE SET theme = …` — the application never needs a read-before-write.

---

### 2 — Filter Query

`/api/events` dynamically builds a `WHERE` clause: each active filter appends a condition and its bind value, then all conditions join with `AND`:

```sql
SELECT * FROM events
WHERE  is_active = 1
  AND  date_time > ?                                           -- upcoming only
  AND  category  = ?                                           -- if ?category set
  AND  city      = ?                                           -- if ?city set
  AND  (title LIKE ? OR description LIKE ? OR city LIKE ?)    -- if ?search set
ORDER BY date_time ASC
LIMIT 9 OFFSET ((page - 1) * 9)
```

A second identical query with `SELECT COUNT(*)` and no `LIMIT` provides the total for pagination — both share the same bind values.  
**Index to add:** `CREATE INDEX idx_events_active_date ON events(is_active, date_time)` — a composite covering the most frequent path (upcoming active events, sorted by date).  
For production full-text search, replace `LIKE` with an FTS5 virtual table: `CREATE VIRTUAL TABLE events_fts USING fts5(title, description, content=events)`.

---

### 3 — Passwords & Admin Protection

Passwords are hashed with `bcryptjs` at cost factor 10 before storage — the plain-text password never touches the database or any log.  
On login, a JWT (HS256, 7-day expiry) is signed with a server-side secret using the `jose` library and returned to the client; the client sends it as `Authorization: Bearer <token>` on subsequent requests.  
Every admin API route calls `requireAdmin(request)` server-side: it extracts the Bearer token, calls `jose.jwtVerify`, checks `payload.role === "admin"`, and returns `403 Forbidden` immediately if any step fails — before any DB query runs.  
All enforcement is in Next.js Route Handlers (server code); the admin UI redirects are a convenience only — the API independently rejects any request without a valid admin token.

---

## ⚠️ Known Limitations

- No email verification on signup
- No rate limiting on auth endpoints (add in production)
- Hard-coded single admin (per spec — no admin management UI)
- Stickers stored as a JSON string in SQLite (fine at this scale; use a join table in Postgres)
- No HTTPS configuration (use a reverse proxy like Nginx in production)
