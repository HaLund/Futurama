import type { Character } from "./characters";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`);
  }
  return response.json() as Promise<T>;
}

export async function login(username: string, password: string) {
  await request("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
}

export async function logout() {
  await request("/api/admin/logout", { method: "POST" });
}

export async function getCharacters() {
  const data = await request<{ items: Character[] }>("/api/characters");
  return data.items;
}

export async function saveCharacter(character: Character | Omit<Character, "id">) {
  const editing = "id" in character;
  return request<Character>("/api/admin/characters", {
    method: editing ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(character),
  });
}

export async function deleteCharacter(id: number) {
  await request(`/api/admin/characters?id=${id}`, { method: "DELETE" });
}
