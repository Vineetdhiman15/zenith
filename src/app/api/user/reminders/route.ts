// src/app/api/user/reminders/route.ts
// GET  – list event IDs the user has reminded
// POST – add a reminder { eventId }

import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const rows = db
    .prepare("SELECT event_id FROM reminders WHERE user_id = ?")
    .all(user.sub) as { event_id: number }[];

  return NextResponse.json({ eventIds: rows.map((r) => r.event_id) });
}

export async function POST(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { eventId } = await req.json();
  if (!eventId) return NextResponse.json({ error: "eventId required" }, { status: 400 });

  const db = getDb();
  try {
    db.prepare("INSERT OR IGNORE INTO reminders (user_id, event_id) VALUES (?, ?)").run(user.sub, eventId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
