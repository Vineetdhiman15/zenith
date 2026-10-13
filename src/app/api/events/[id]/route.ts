// src/app/api/events/[id]/route.ts
// GET  – single event (public)
// PATCH – admin only: update event fields

import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const event = db.prepare("SELECT * FROM events WHERE id = ?").get(id);
  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
  return NextResponse.json({ event });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const db = getDb();

  const existing = db.prepare("SELECT * FROM events WHERE id = ?").get(id);
  if (!existing) return NextResponse.json({ error: "Event not found" }, { status: 404 });

  try {
    const body = await req.json();
    const { title, category, city, date_time, price, description, image_url, is_active } = body;

    db.prepare(`
      UPDATE events SET
        title       = COALESCE(?, title),
        category    = COALESCE(?, category),
        city        = COALESCE(?, city),
        date_time   = COALESCE(?, date_time),
        price       = COALESCE(?, price),
        description = COALESCE(?, description),
        image_url   = COALESCE(?, image_url),
        is_active   = CASE WHEN ? IS NOT NULL THEN ? ELSE is_active END
      WHERE id = ?
    `).run(
      title ?? null,
      category ?? null,
      city ?? null,
      date_time ?? null,
      price ?? null,
      description ?? null,
      image_url ?? null,
      is_active !== undefined ? 1 : null,
      is_active !== undefined ? (is_active ? 1 : 0) : null,
      id,
    );

    const updated = db.prepare("SELECT * FROM events WHERE id = ?").get(id);
    return NextResponse.json({ event: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
