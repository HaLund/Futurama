"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Character } from "../lib/characters";

const empty: Omit<Character, "id"> = { name: "", gender: "UNKNOWN", status: "UNKNOWN", species: "HUMAN", createdAt: new Date().toISOString(), image: "" };
const maxImageSize = 5 * 1024 * 1024;
const genderOptions = ["FEMALE", "MALE", "UNKNOWN"] as const;
const statusOptions = ["ALIVE", "DEAD", "UNKNOWN"] as const;

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
  function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > maxImageSize) {
      setError("Images must be 5 MB or smaller.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const image = reader.result;
      if (typeof image !== "string") {
        setError("Could not read the selected image.");
        return;
      }
      setForm((current) => ({ ...current, image }));
      setError("");
    };
    reader.onerror = () => setError("Could not read the selected image.");
    reader.readAsDataURL(file);
  }
  async function remove(id: number) {
    if (!window.confirm("Delete this character?")) return;
    await fetch(`/api/admin/characters?id=${id}`, { method: "DELETE" }); await load();
  }
  if (!loggedIn) {
    return (
      <main className="admin-shell">
        <form className="admin-login" onSubmit={login}>
          <p className="eyebrow">Restricted area</p>
          <h1>Admin login</h1>
          <label htmlFor="username">Username</label>
          <input id="username" placeholder="Username" value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} required />
          <label htmlFor="password">Password</label>
          <input id="password" placeholder="Password" type="password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} required />
          <button type="submit">Sign in</button>{error && <p className="form-error">{error}</p>}
        </form>
      </main>
    );
  }
  return <main className="admin-shell">
    <div className="admin-heading">
    <div>
      <p className="eyebrow">Planet Express Academy</p>
      <h1>Character database</h1>
    </div>
    <button onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); setLoggedIn(false); }}>Sign out</button>
    </div>
    <form className="character-form" onSubmit={save}>
      <h2>{"id" in form ? "Edit character" : "Add character"}</h2>
      {(["name", "gender", "status", "species"] as const).map((key) => (
        <div key={key}>
          <label htmlFor={`character-${key}`}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
          {key === "gender" ? (
            <select id="character-gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} required>
              {genderOptions.map((gender) => <option key={gender} value={gender}>{gender}</option>)}
            </select>
          ) : key === "status" ? (
            <select id="character-status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} required>
              {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          ) : (
            <input id={`character-${key}`} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required />
          )}
        </div>
      ))}
      <div className="image-upload">
        <div>{form.image ? <img src={form.image} alt={`Preview of ${form.name || "character"}`} /> : <span>No image selected</span>}</div>
        <label className="file-upload-button" htmlFor="character-image">Upload image</label>
        <input className="file-upload-input" id="character-image" key={form.image} type="file" accept="image/*" onChange={uploadImage} />
        {!form.image && <span className="image-help">An image is required.</span>}</div>
        <button type="submit">{"id" in form ? "Update" : "Create"}</button>{"id" in form && <button type="button" onClick={() => setForm(empty)}>Cancel</button>}
        {error && <p className="form-error">{error}</p>}</form>
        <div className="admin-table">{items.map((character) => <div className="admin-row" key={character.id}><span>{character.name}</span><span>{character.species} / {character.status}</span>
        <button onClick={() => setForm(character)}>Edit</button><button onClick={() => remove(character.id)}>Delete</button></div>)}</div>
        </main>;
}
