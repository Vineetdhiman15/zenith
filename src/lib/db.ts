// src/lib/db.ts
// SQLite database setup using better-sqlite3.
// All tables are created here on first run, so no migration step needed.

import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "events.db");

// Ensure the data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initSchema();
    seedIfEmpty();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      email     TEXT    NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role      TEXT    NOT NULL DEFAULT 'visitor', -- 'visitor' | 'admin'
      created_at TEXT   NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS events (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,
      category    TEXT NOT NULL,  -- Music | Workshop | Food | Sports | Kids
      city        TEXT NOT NULL,
      date_time   TEXT NOT NULL,  -- ISO 8601 stored as text for SQLite
      price       REAL NOT NULL DEFAULT 0,
      description TEXT NOT NULL DEFAULT '',
      image_url   TEXT NOT NULL DEFAULT '',
      is_active   INTEGER NOT NULL DEFAULT 1, -- 1 = active, 0 = inactive
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_events_category  ON events(category);
    CREATE INDEX IF NOT EXISTS idx_events_city      ON events(city);
    CREATE INDEX IF NOT EXISTS idx_events_date_time ON events(date_time);
    CREATE INDEX IF NOT EXISTS idx_events_is_active ON events(is_active);

    CREATE TABLE IF NOT EXISTS user_favourite_categories (
      user_id  INTEGER NOT NULL REFERENCES users(id),
      category TEXT    NOT NULL,
      PRIMARY KEY (user_id, category)
    );

    CREATE TABLE IF NOT EXISTS reminders (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER NOT NULL REFERENCES users(id),
      event_id   INTEGER NOT NULL REFERENCES events(id),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, event_id)
    );

    CREATE TABLE IF NOT EXISTS card_designs (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER NOT NULL REFERENCES users(id),
      event_id   INTEGER NOT NULL REFERENCES events(id),
      theme      TEXT NOT NULL DEFAULT 'aurora',
      stickers   TEXT NOT NULL DEFAULT '[]', -- JSON array of sticker keys
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, event_id)
    );
  `);
}

// ───────── seed ─────────
const SAMPLE_EVENTS = [
  // ── Active + upcoming ──
  {
    title: "Chennai Jazz Night",
    category: "Music",
    city: "Chennai",
    date_time: "2026-11-01T20:00:00",
    price: 599,
    description: "A soulful evening of jazz and blues at the iconic Music Academy. Featuring local legends and surprise guests.",
    image_url: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format",
    is_active: 1,
  },
  {
    title: "Coimbatore Music Night",
    category: "Music",
    city: "Coimbatore",
    date_time: "2026-11-08T19:30:00",
    price: 399,
    description: "An outdoor concert under the stars. Indie artists, food stalls, and good vibes.",
    image_url: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format",
    is_active: 1,
  },
  {
    title: "Bengaluru Food Fair 2026",
    category: "Food",
    city: "Bengaluru",
    date_time: "2026-11-15T11:00:00",
    price: 150,
    description: "Over 80 stalls serving cuisines from across India. Live cooking demos, chef talks, and food competitions.",
    image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format",
    is_active: 1,
  },
  {
    title: "React Workshop — Beginner to Pro",
    category: "Workshop",
    city: "Chennai",
    date_time: "2026-11-20T09:00:00",
    price: 1200,
    description: "A hands-on full-day React workshop. Bring your laptop. You'll build three projects from scratch.",
    image_url: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&auto=format",
    is_active: 1,
  },
  {
    title: "Hyderabad Marathon 2026",
    category: "Sports",
    city: "Hyderabad",
    date_time: "2026-12-05T06:00:00",
    price: 800,
    description: "5K, 10K, and 21K categories. Medals for all finishers. Hydration stations every 2 km.",
    image_url: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&auto=format",
    is_active: 1,
  },
  {
    title: "Kids Science Fair",
    category: "Kids",
    city: "Coimbatore",
    date_time: "2026-11-22T10:00:00",
    price: 0,
    description: "Free entry! Hands-on science experiments for children aged 5–14. Robotics, chemistry, and astronomy corners.",
    image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format",
    is_active: 1,
  },
  {
    title: "Mumbai Street Food Festival",
    category: "Food",
    city: "Mumbai",
    date_time: "2026-12-12T16:00:00",
    price: 200,
    description: "The best street food Mumbai has to offer — vada pav, bhel puri, pani puri, kebabs, and much more.",
    image_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format",
    is_active: 1,
  },
  {
    title: "Delhi Photography Workshop",
    category: "Workshop",
    city: "Delhi",
    date_time: "2026-11-28T10:00:00",
    price: 2500,
    description: "Learn composition, lighting, and post-processing with professional photographers. Includes field shoot at India Gate.",
    image_url: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&auto=format",
    is_active: 1,
  },
  {
    title: "Bengaluru Badminton Open",
    category: "Sports",
    city: "Bengaluru",
    date_time: "2026-12-20T08:00:00",
    price: 500,
    description: "Amateur doubles tournament. All skill levels welcome. Prizes for top 3 pairs in each category.",
    image_url: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&auto=format",
    is_active: 1,
  },
  {
    title: "Kolkata Durga Puja Music Night",
    category: "Music",
    city: "Kolkata",
    date_time: "2026-12-01T18:00:00",
    price: 0,
    description: "A free cultural evening celebrating classical and folk music of West Bengal. Family-friendly.",
    image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format",
    is_active: 1,
  },
  {
    title: "Kids Art Camp — Diwali Special",
    category: "Kids",
    city: "Mumbai",
    date_time: "2026-12-08T09:30:00",
    price: 350,
    description: "Pottery, painting, and craft activities for children aged 4–12. All materials provided. Take home your creations!",
    image_url: "https://images.unsplash.com/photo-1551966775-a4ddc8df052b?w=800&auto=format",
    is_active: 1,
  },
  // ── Inactive ──
  {
    title: "Chennai Comedy Night (Cancelled)",
    category: "Music",
    city: "Chennai",
    date_time: "2026-11-10T20:00:00",
    price: 299,
    description: "Stand-up comedy show — unfortunately cancelled. Refunds will be processed within 7 days.",
    image_url: "https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800&auto=format",
    is_active: 0,
  },
  {
    title: "Hyderabad Startup Workshop (Draft)",
    category: "Workshop",
    city: "Hyderabad",
    date_time: "2026-12-15T10:00:00",
    price: 999,
    description: "Entrepreneurship and funding workshop. Draft — not yet published.",
    image_url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format",
    is_active: 0,
  },
  // ── Past events (already happened) ──
  {
    title: "Bengaluru Jazz Brunch (Past)",
    category: "Music",
    city: "Bengaluru",
    date_time: "2026-09-14T11:00:00",
    price: 450,
    description: "A brunch event pairing jazz music with gourmet food. A memorable morning — now in the past.",
    image_url: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&auto=format",
    is_active: 1,
  },
  {
    title: "Delhi Half Marathon (Past)",
    category: "Sports",
    city: "Delhi",
    date_time: "2026-10-05T06:30:00",
    price: 700,
    description: "21K race through the historic streets of Delhi. Now completed. See you next year!",
    image_url: "https://images.unsplash.com/photo-1608138278598-f2f5cf818e82?w=800&auto=format",
    is_active: 1,
  },
];

function seedIfEmpty() {
  const count = (db.prepare("SELECT COUNT(*) as c FROM events").get() as { c: number }).c;
  if (count > 0) return;

  const insert = db.prepare(`
    INSERT INTO events (title, category, city, date_time, price, description, image_url, is_active)
    VALUES (@title, @category, @city, @date_time, @price, @description, @image_url, @is_active)
  `);

  const insertMany = db.transaction((events: typeof SAMPLE_EVENTS) => {
    for (const e of events) insert.run(e);
  });

  insertMany(SAMPLE_EVENTS);
}

export default getDb;
