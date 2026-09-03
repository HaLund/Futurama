import { NextResponse } from "next/server";
import { createSession, cookieName } from "../../../../lib/auth";

export async function POST(request: Request) {
  const body = await request.json() as { username?: string; password?: string };
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password || body.username !== username || body.password !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, createSession(username), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8, path: "/",
  });
  return response;
}
