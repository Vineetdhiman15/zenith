// src/lib/auth.ts
// JWT helpers using the `jose` library (Edge-compatible).
// Admin credentials are hard-coded per spec.

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "community-events-super-secret-key-2026"
);

export const ADMIN_EMAIL = "admin@events.com";
export const ADMIN_PASSWORD = "Admin@1234"; // hard-coded per spec

export interface JWTPayload {
  sub: string;       // user id as string
  email: string;
  role: "visitor" | "admin";
  iat?: number;
  exp?: number;
}

/** Sign a JWT that expires in 7 days */
export async function signToken(payload: Omit<JWTPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

/** Verify a JWT string and return the payload, or null on failure */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

/** Extract JWT from the Authorization header (Bearer <token>) */
export function tokenFromRequest(req: NextRequest): string | null {
  const auth = req.headers.get("authorization") ?? "";
  if (auth.startsWith("Bearer ")) return auth.slice(7);
  return null;
}

/** Get authenticated user from server cookies (for RSC / Server Actions) */
export async function getSessionUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** Verify the request carries a valid token (API routes) */
export async function requireAuth(req: NextRequest): Promise<JWTPayload | null> {
  const token = tokenFromRequest(req);
  if (!token) return null;
  return verifyToken(token);
}

/** Same as requireAuth but additionally checks role === 'admin' */
export async function requireAdmin(req: NextRequest): Promise<JWTPayload | null> {
  const user = await requireAuth(req);
  if (!user || user.role !== "admin") return null;
  return user;
}
