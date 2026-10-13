// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import getDb from "@/lib/db";
import { signToken, ADMIN_EMAIL, ADMIN_PASSWORD } from "@/lib/auth";

interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  role: "visitor" | "admin";
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // ── Hard-coded admin check ──
    if (email === ADMIN_EMAIL) {
      if (password !== ADMIN_PASSWORD) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
      const token = await signToken({ sub: "0", email, role: "admin" });
      const response = NextResponse.json({ token, user: { id: "0", email, role: "admin" } });
      response.cookies.set("token", token, { httpOnly: true, maxAge: 7 * 24 * 3600, path: "/" });
      return response;
    }

    // ── Regular visitor login ──
    const db = getDb();
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as UserRow | undefined;
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signToken({ sub: user.id.toString(), email: user.email, role: user.role });
    const response = NextResponse.json({
      token,
      user: { id: user.id.toString(), email: user.email, role: user.role },
    });
    response.cookies.set("token", token, { httpOnly: true, maxAge: 7 * 24 * 3600, path: "/" });
    return response;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
