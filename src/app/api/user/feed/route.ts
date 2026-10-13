// src/app/api/user/feed/route.ts
// GET – active + upcoming events in the user's favourite categories

import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const favRows = db
    .prepare("SELECT category FROM user_favourite_categories WHERE user_id = ?")
    .all(user.sub) as { category: string }[];

  const categories = favRows.map((r) => r.category);

  if (categories.length === 0) {
    return NextResponse.json({ events: [], categories: [] });
  }

  const now = new Date().toISOString().slice(0, 19);
  const placeholders = categories.map(() => "?").join(", ");
  const events = db
    .prepare(
      `SELECT * FROM events
       WHERE is_active = 1
         AND date_time > ?
         AND category IN (${placeholders})
       ORDER BY date_time ASC`
    )
    .all(now, ...categories);

  return NextResponse.json({ events, categories });
}
