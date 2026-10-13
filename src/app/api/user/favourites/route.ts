// src/app/api/user/favourites/route.ts
// GET  – return the authenticated user's favourite categories
// PUT  – replace the user's favourite categories

import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  const rows = db
    .prepare("SELECT category FROM user_favourite_categories WHERE user_id = ?")
    .all(user.sub) as { category: string }[];

  return NextResponse.json({ categories: rows.map((r) => r.category) });
}

export async function PUT(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { categories } = await req.json() as { categories: string[] };
  if (!Array.isArray(categories)) {
    return NextResponse.json({ error: "categories must be an array" }, { status: 400 });
  }

  const db = getDb();
  const replace = db.transaction(() => {
    db.prepare("DELETE FROM user_favourite_categories WHERE user_id = ?").run(user.sub);
    const ins = db.prepare("INSERT INTO user_favourite_categories (user_id, category) VALUES (?, ?)");
    for (const cat of categories) ins.run(user.sub, cat);
  });
  replace();

  return NextResponse.json({ categories });
}
