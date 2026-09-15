import Link from "next/link";
import { notFound } from "next/navigation";
import CharacterDossier from "../../../components/character-dossier";
import { readCharacter } from "../../../lib/characters";

type CharacterPageProps = {
  params: Promise<{ id: string }>;
};

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { id } = await params;
  const characterId = Number(id);

  if (!Number.isInteger(characterId) || characterId < 1) {
    notFound();
  }

  const character = await readCharacter(characterId);
  if (!character) {
    notFound();
  }

  return (
    <main id="main-content" tabIndex={-1}>
      <header className="site-header">
        <div className="logo" aria-label="Planet Express Academy">
          <span className="logo-rocket" aria-hidden="true">◢</span>
          <span>P.E.A</span>
        </div>
        <nav aria-label="Main navigation">
          <Link href="/#characters">Characters</Link>
          <a href="/admin">Admin</a>
        </nav>
      </header>

      <CharacterDossier character={character} />
    </main>
  );
}
