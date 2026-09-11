"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type AdminLoginProps = {
  error: string;
  onLogin: (username: string, password: string) => Promise<void>;
};

export default function AdminLogin({ error, onLogin }: AdminLoginProps) {
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  async function submit(event: FormEvent) {
    event.preventDefault();
    await onLogin(credentials.username, credentials.password);
  }

  return (
    <main className="admin-shell">
      <form className="admin-login" onSubmit={submit}>
        <p className="eyebrow">Restricted area</p>
        <h1>Admin login</h1>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          placeholder="Username"
          value={credentials.username}
          onChange={(event) => setCredentials({ ...credentials, username: event.target.value })}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          placeholder="Password"
          type="password"
          value={credentials.password}
          onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
          required
        />
        <button type="submit">Sign in</button>
        {error && <p className="form-error">{error}</p>}
      </form>
    </main>
  );
}
