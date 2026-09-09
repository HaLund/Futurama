import { NextResponse } from "next/server";
import { readCharacter } from "../../../../lib/characters";

type CharacterRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: CharacterRouteContext) {
  const { id } = await params;
  const characterId = Number(id);

  if (!Number.isInteger(characterId) || characterId < 1) {
    return NextResponse.json({ error: "Invalid character id." }, { status: 400 });
  }

  try {
    const character = await readCharacter(characterId);
    if (!character) {
      return NextResponse.json({ error: "Character not found." }, { status: 404 });
    }
    return NextResponse.json({ character });
  } catch (error) {
    console.error("Could not load character.", error);
    return NextResponse.json({ error: "Could not load character." }, { status: 503 });
  }
}
