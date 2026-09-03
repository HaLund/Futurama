import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const cookieName = "pea-admin-session";

function secret() {
  return process.env.ADMIN_PASSWORD ?? "";
}

export function createSession(username: string) {
  return `${username}.${createHmac("sha256", secret()).update(username).digest("hex")}`;
}

export function isValidSession(value: string | undefined) {
  if (!value || !secret()) return false;
  const [username, signature] = value.split(".");
  if (!username || !signature) return false;
  const expected = createSession(username).split(".")[1];
  if (!expected || signature.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function isAdmin() {
  return isValidSession((await cookies()).get(cookieName)?.value);
}

export { cookieName };
