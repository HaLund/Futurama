import { NextResponse } from "next/server";
import { readCharacters } from "../../../lib/characters";

export async function GET() {
  try {
    return NextResponse.json({ items: await readCharacters() });
  } catch (error) {
    console.error("Could not load characters.", error);
    return NextResponse.json({ error: "Could not load characters." }, { status: 503 });
  }
}
