// src/app/api/user/reminders/[eventId]/route.ts
// DELETE – remove a reminder

import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const user = await requireAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { eventId } = await params;
  const db = getDb();
  db.prepare("DELETE FROM reminders WHERE user_id = ? AND event_id = ?").run(user.sub, eventId);
  return NextResponse.json({ ok: true });
}
