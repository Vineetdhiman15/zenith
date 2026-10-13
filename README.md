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
