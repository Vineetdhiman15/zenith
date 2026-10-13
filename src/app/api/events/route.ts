// src/app/api/events/route.ts
// GET  – public list of active + upcoming events with category/city/search filters and pagination
// POST – admin only: create a new event

import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const PAGE_SIZE = 9;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const category = searchParams.get("category") || "";
    const city     = searchParams.get("city")     || "";
    const search   = searchParams.get("search")   || "";
    const page     = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

    const db = getDb();
    const now = new Date().toISOString().slice(0, 19); // "2026-11-01T00:00:00"

    // Build dynamic WHERE clause
    const conditions: string[] = ["e.is_active = 1", "e.date_time > ?"];
    const params: unknown[] = [now];

    if (category) { conditions.push("e.category = ?"); params.push(category); }
    if (city)     { conditions.push("e.city = ?");     params.push(city);     }
    if (search)   {
      conditions.push("(e.title LIKE ? OR e.description LIKE ? OR e.city LIKE ?)");
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const where = conditions.join(" AND ");

    // Count for pagination
    const total = (db.prepare(`SELECT COUNT(*) as c FROM events e WHERE ${where}`).get(...params) as { c: number }).c;
    const totalPages = Math.ceil(total / PAGE_SIZE);

    // Data query – nearest date first
    const offset = (page - 1) * PAGE_SIZE;
    const events = db.prepare(
      `SELECT * FROM events e WHERE ${where} ORDER BY e.date_time ASC LIMIT ? OFFSET ?`
    ).all(...params, PAGE_SIZE, offset);

    return NextResponse.json({ events, total, page, totalPages });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = await req.json();
    const { title, category, city, date_time, price, description, image_url, is_active } = body;

    if (!title || !category || !city || !date_time) {
      return NextResponse.json({ error: "title, category, city, date_time are required" }, { status: 400 });
    }

    const db = getDb();
    const result = db.prepare(`
      INSERT INTO events (title, category, city, date_time, price, description, image_url, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, category, city, date_time, price ?? 0, description ?? "", image_url ?? "", is_active ? 1 : 0);

    const event = db.prepare("SELECT * FROM events WHERE id = ?").get(result.lastInsertRowid);
    return NextResponse.json({ event }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
