// src/proxy.ts
// Server-side protection for admin PAGES.
// The admin APIs are already guarded by requireAdmin() in each route handler.
// This proxy (formerly "middleware") blocks the page routes themselves on the
// server (edge), so a non-admin can never even render an /admin/* page — the
// request is redirected to the login page before any server rendering happens.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Must match the secret used in src/lib/auth.ts
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "community-events-super-secret-key-2026"
);

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  let isAdmin = false;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload.role === "admin") isAdmin = true;
    } catch {
      // expired / tampered token
      isAdmin = false;
    }
  }

  if (!isAdmin) {
    // Send non-admins (and logged-out visitors) to the login page
    const loginUrl = new URL("/auth/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Only run on admin PAGE routes — NOT /api/admin/* (those guard themselves)
export const config = {
  matcher: ["/admin/:path*"],
};
