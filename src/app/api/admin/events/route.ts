// src/app/api/admin/events/route.ts
// Admin: list ALL events (including inactive) for the admin dashboard

import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = getDb();
  const events = db.prepare("SELECT * FROM events ORDER BY created_at DESC").all();
  return NextResponse.json({ events });
}
