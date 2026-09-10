import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const cookieName = "pea-admin-session";

function secret() {
  return process.env.ADMIN_PASSWORD ?? "";
}

type AdminCredentials = {
  username: string;
  password: string;
};

type ConfiguredCredentials = {
  username: string | undefined;
  password: string | undefined;
};

function isAdminCredentials(value: unknown): value is AdminCredentials {
  if (!value || typeof value !== "object") return false;
  const credentials = value as Record<string, unknown>;
  return typeof credentials.username === "string" && typeof credentials.password === "string";
}

export function authenticateAdmin(
  credentials: unknown,
  configured: ConfiguredCredentials = {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
  },
) {
  return isAdminCredentials(credentials) &&
    Boolean(configured.username && configured.password) &&
    credentials.username === configured.username &&
    credentials.password === configured.password;
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
