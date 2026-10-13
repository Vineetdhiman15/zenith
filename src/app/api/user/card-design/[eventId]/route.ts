// src/app/api/user/card-design/[eventId]/route.ts
// GET – fetch the user's card design for an event
// PUT – save the user's card design for an event

import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const user = await requireAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { eventId } = await params;
  const db = getDb();
  const design = db
    .prepare("SELECT theme, stickers FROM card_designs WHERE user_id = ? AND event_id = ?")
    .get(user.sub, eventId) as { theme: string; stickers: string } | undefined;

  if (!design) {
    return NextResponse.json({ theme: "aurora", stickers: [] });
  }

  return NextResponse.json({ theme: design.theme, stickers: JSON.parse(design.stickers) });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const user = await requireAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { eventId } = await params;
  const { theme, stickers } = await req.json() as { theme: string; stickers: string[] };

  const db = getDb();
  db.prepare(`
    INSERT INTO card_designs (user_id, event_id, theme, stickers, updated_at)
    VALUES (?, ?, ?, ?, datetime('now'))
    ON CONFLICT(user_id, event_id) DO UPDATE SET
      theme = excluded.theme,
      stickers = excluded.stickers,
      updated_at = excluded.updated_at
  `).run(user.sub, eventId, theme, JSON.stringify(stickers ?? []));

  return NextResponse.json({ ok: true });
}
