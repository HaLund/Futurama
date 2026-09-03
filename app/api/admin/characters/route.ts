import { NextResponse } from "next/server";
import { isAdmin } from "../../../../lib/auth";
import { createCharacter, deleteCharacter, updateCharacter, type Character } from "../../../../lib/characters";

function validCharacter(value: Partial<Character>) {
  return typeof value.name === "string" && value.name.trim() &&
    typeof value.image === "string" && value.image.trim() &&
    typeof value.gender === "string" && typeof value.status === "string" &&
    typeof value.species === "string" && typeof value.createdAt === "string";
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const value = await request.json() as Partial<Character>;
  if (!validCharacter(value)) return NextResponse.json({ error: "Invalid character" }, { status: 400 });
  const character = await createCharacter(value as Omit<Character, "id">);
  return NextResponse.json(character, { status: 201 });
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const value = await request.json() as Partial<Character>;
  if (!value.id || !validCharacter(value)) return NextResponse.json({ error: "Invalid character" }, { status: 400 });
  const updated = await updateCharacter(value as Character);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!(await deleteCharacter(id))) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
