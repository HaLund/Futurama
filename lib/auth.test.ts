import { describe, expect, it } from "vitest";
import { authenticateAdmin } from "./auth";

const configured = { username: "admin", password: "correct horse battery staple" };

describe("authenticateAdmin", () => {
  it("accepts matching credentials", () => {
    expect(authenticateAdmin(configured, configured)).toBe(true);
  });

  it("rejects an incorrect password", () => {
    expect(authenticateAdmin({ ...configured, password: "wrong" }, configured)).toBe(false);
  });

  it("rejects incomplete credentials", () => {
    expect(authenticateAdmin({ username: configured.username }, configured)).toBe(false);
    expect(authenticateAdmin(null, configured)).toBe(false);
  });

  it("rejects credentials when the admin account is not configured", () => {
    expect(authenticateAdmin(configured, { username: undefined, password: undefined })).toBe(false);
  });
});
