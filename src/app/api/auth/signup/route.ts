// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import getDb from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const db = getDb();
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = db
      .prepare("INSERT INTO users (email, password_hash, role) VALUES (?, ?, 'visitor')")
      .run(email, password_hash);

    const userId = result.lastInsertRowid.toString();
    const token = await signToken({ sub: userId, email, role: "visitor" });

    const response = NextResponse.json({ token, user: { id: userId, email, role: "visitor" } }, { status: 201 });
    response.cookies.set("token", token, { httpOnly: true, maxAge: 7 * 24 * 3600, path: "/" });
    return response;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
