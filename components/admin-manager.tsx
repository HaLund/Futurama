"use client";

import { useEffect, useState } from "react";
import AdminLogin from "./admin/admin-login";
import CharacterEditor, { createEmptyCharacter } from "./admin/character-editor";
import CharacterTable from "./admin/character-table";
import { deleteCharacter, getCharacters, login, logout, saveCharacter } from "../lib/api-client";
import type { Character } from "../lib/characters";

type EditableCharacter = Character | Omit<Character, "id">;

export default function AdminManager() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [items, setItems] = useState<Character[]>([]);
  const [form, setForm] = useState<EditableCharacter>(createEmptyCharacter);
  const [error, setError] = useState("");

  async function load() {
    setItems(await getCharacters());
  }

  useEffect(() => {
    load().catch((requestError: unknown) => {
      console.error("Could not load characters.", requestError);
      setError("Could not load characters.");
    });
  }, []);

  async function handleLogin(username: string, password: string) {
    try {
      await login(username, password);
      setLoggedIn(true);
      setError("");
    } catch {
      setError("Invalid credentials.");
    }
  }

  async function handleSave(character: EditableCharacter) {
    try {
      await saveCharacter(character);
      setForm(createEmptyCharacter());
      setError("");
      await load();
    } catch (requestError: unknown) {
      console.error("Could not save character.", requestError);
      setError("Could not save character.");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteCharacter(id);
      await load();
    } catch (requestError: unknown) {
      console.error("Could not delete character.", requestError);
      setError("Could not delete character.");
    }
  }

  async function handleLogout() {
    try {
      await logout();
      setLoggedIn(false);
      setError("");
    } catch (requestError: unknown) {
      console.error("Could not sign out.", requestError);
      setError("Could not sign out.");
    }
  }

  if (!loggedIn) {
    return <AdminLogin error={error} onLogin={handleLogin} />;
  }

  return (
    <main className="admin-shell" id="main-content" tabIndex={-1}>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">Planet Express Academy</p>
          <h1>Character database</h1>
        </div>
        <button onClick={handleLogout}>Sign out</button>
      </div>
      <CharacterEditor
        character={form}
        error={error}
        onSave={handleSave}
        onCancel={() => setForm(createEmptyCharacter())}
      />
      <CharacterTable items={items} onEdit={setForm} onDelete={handleDelete} />
    </main>
  );
}
