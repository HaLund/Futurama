import { NextResponse } from "next/server";
import { authenticateAdmin, createSession, cookieName } from "../../../../lib/auth";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!authenticateAdmin(body)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const username = (body as { username: string }).username;
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, createSession(username), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8, path: "/",
  });
  return response;
}
