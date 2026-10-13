# Community Events Board

A full-stack Next.js application where an admin posts local events and visitors browse, filter, and personalise their experience.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite via `better-sqlite3` (file-based, zero setup)
- **Styling**: **styled-components** (SSR-ready via ServerStyleSheet registry)
- **Auth**: JWT (`jose`) + `bcryptjs` for password hashing
- **Language**: TypeScript throughout

---

## Setup (< 5 minutes)

```bash
git clone <repo-url>
cd <repo-folder>
npm install
npm run dev
```

Open **http://localhost:3000**

> The SQLite database (`data/events.db`) is created automatically on first run, with **15 sample events** seeded (different categories, cities, some inactive, some past).

---

## Admin Login

| Field    | Value                  |
|----------|------------------------|
| Email    | `admin@events.com`     |
| Password | `Admin@1234`           |

Admin pages: `/admin/dashboard`, `/admin/events/new`, `/admin/events/[id]/edit`

---

## API List

| Method   | Path                              | Auth     | Description                          |
|----------|-----------------------------------|----------|--------------------------------------|
| `POST`   | `/api/auth/signup`                | –        | Register a new visitor               |
| `POST`   | `/api/auth/login`                 | –        | Login (visitor or admin), get JWT    |
| `POST`   | `/api/auth/logout`                | –        | Clear auth cookie                    |
| `GET`    | `/api/auth/me`                    | Bearer   | Get current user info                |
| `GET`    | `/api/events`                     | –        | List active+upcoming events (filters, pagination) |
| `POST`   | `/api/events`                     | Admin    | Create a new event                   |
| `GET`    | `/api/events/:id`                 | –        | Get single event                     |
| `PATCH`  | `/api/events/:id`                 | Admin    | Update event (including is_active)   |
| `GET`    | `/api/admin/events`               | Admin    | List ALL events (incl. inactive)     |
| `GET`    | `/api/user/favourites`            | Bearer   | Get user's favourite categories      |
| `PUT`    | `/api/user/favourites`            | Bearer   | Replace favourite categories         |
| `GET`    | `/api/user/feed`                  | Bearer   | Upcoming events in favourite cats    |
| `GET`    | `/api/user/reminders`             | Bearer   | List reminded event IDs              |
| `POST`   | `/api/user/reminders`             | Bearer   | Add a reminder                       |
| `DELETE` | `/api/user/reminders/:eventId`    | Bearer   | Remove a reminder                    |
| `GET`    | `/api/user/card-design/:eventId`  | Bearer   | Get saved card design                |
| `PUT`    | `/api/user/card-design/:eventId`  | Bearer   | Save card design (theme + stickers)  |

---

## Three Short Answers

### 1 — Database Structure

```
users            (id, email, password_hash, role, created_at)
events           (id, title, category, city, date_time, price, description, image_url, is_active, created_at)
user_favourite_categories (user_id FK, category  — composite PK)
reminders        (id, user_id FK, event_id FK  — UNIQUE user+event)
card_designs     (id, user_id FK, event_id FK  — UNIQUE user+event, theme, stickers JSON)
```

**Why this design?**  
Events are a flat table — no JSON blobs, so every field is directly filterable and indexable. Favourites use a join table (one row per category per user) rather than a JSON array, so adding/removing categories is a simple INSERT/DELETE without parsing. Reminders and card designs both have a `UNIQUE(user_id, event_id)` constraint enabling `INSERT OR IGNORE` (idempotent) and `ON CONFLICT DO UPDATE` (upsert) without extra round-trips.

---

### 2 — Filter Query

The `/api/events` route builds a dynamic `WHERE` clause:

```sql
SELECT * FROM events
WHERE is_active = 1
  AND date_time > ?            -- upcoming only
  AND category = ?             -- if category filter set
  AND city = ?                 -- if city filter set
  AND (title LIKE ? OR description LIKE ? OR city LIKE ?)  -- if search set
ORDER BY date_time ASC
LIMIT 9 OFFSET ?
```

All active conditions are ANDed together — this is how Music + Coimbatore + "night" works correctly. A **separate COUNT query** (same WHERE, no LIMIT) provides the total for pagination.

**Indexes to add in production:**
```sql
CREATE INDEX idx_events_active_date ON events(is_active, date_time);
CREATE INDEX idx_events_category    ON events(category);
CREATE INDEX idx_events_city        ON events(city);
-- For text search at scale, use SQLite FTS5:
CREATE VIRTUAL TABLE events_fts USING fts5(title, description, content=events);
```

---

### 3 — Password Storage & Route Protection

**Passwords** are hashed with `bcryptjs` (cost factor 10) before storage. Plain-text passwords are never stored or logged. The hard-coded admin password is compared as a string (no hash needed since it never hits the DB).

**Protection:** Every admin API route calls `requireAdmin(req)` which:
1. Extracts the `Authorization: Bearer <token>` header
2. Verifies the JWT signature with `jose` (HS256, server-side secret)
3. Checks `payload.role === 'admin'`
4. Returns `403 Forbidden` if any check fails

Visitor-only routes use `requireAuth(req)` (same flow, no role check). All sensitive logic runs on the server — no client code can bypass it.

---

## What's Left / Known Limitations

- No email verification on signup
- No rate limiting on auth endpoints
- Card designer stickers are stored as a JSON string (fine for SQLite, would use a separate table in Postgres)
- The admin is hard-coded (one admin only, per spec)
