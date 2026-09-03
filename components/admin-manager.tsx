"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Character } from "../lib/characters";

const empty: Omit<Character, "id"> = { name: "", gender: "UNKNOWN", status: "UNKNOWN", species: "HUMAN", createdAt: new Date().toISOString(), image: "" };

export default function AdminManager() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [items, setItems] = useState<Character[]>([]);
  const [form, setForm] = useState<Character | Omit<Character, "id">>(empty);
  const [error, setError] = useState("");

  const load = async () => {
    const response = await fetch("/api/characters");
    if (!response.ok) throw new Error(`Characters request failed with status ${response.status}.`);
    setItems((await response.json() as { items: Character[] }).items);
  };
  useEffect(() => {
    load().catch((requestError: unknown) => {
      console.error("Could not load characters.", requestError);
      setError("Could not load characters.");
    });
  }, []);

  async function login(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(credentials) });
    if (!response.ok) { setError("Invalid credentials."); return; }
    setLoggedIn(true); setError("");
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    const editing = "id" in form;
    const response = await fetch("/api/admin/characters", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (!response.ok) { setError("Could not save character."); return; }
    setForm(empty); setError(""); await load();
  }
  async function remove(id: number) {
    if (!window.confirm("Delete this character?")) return;
    await fetch(`/api/admin/characters?id=${id}`, { method: "DELETE" }); await load();
  }
  if (!loggedIn) return <main className="admin-shell"><form className="admin-login" onSubmit={login}><p className="eyebrow">Restricted area</p><h1>Admin login</h1><input aria-label="Username" placeholder="Username" value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} required /><input aria-label="Password" placeholder="Password" type="password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} required /><button type="submit">Sign in</button>{error && <p className="form-error">{error}</p>}</form></main>;
  return <main className="admin-shell"><div className="admin-heading"><div><p className="eyebrow">Planet Express Academy</p><h1>Character database</h1></div><button onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); setLoggedIn(false); }}>Sign out</button></div><form className="character-form" onSubmit={save}><h2>{"id" in form ? "Edit character" : "Add character"}</h2>{(["name", "gender", "status", "species", "image"] as const).map((key) => <input key={key} placeholder={key} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required />)}<button type="submit">{"id" in form ? "Update" : "Create"}</button>{"id" in form && <button type="button" onClick={() => setForm(empty)}>Cancel</button>}{error && <p className="form-error">{error}</p>}</form><div className="admin-table">{items.map((character) => <div className="admin-row" key={character.id}><span>{character.name}</span><span>{character.species} / {character.status}</span><button onClick={() => setForm(character)}>Edit</button><button onClick={() => remove(character.id)}>Delete</button></div>)}</div></main>;
}
