import Link from "next/link";
import type { Character } from "../lib/characters";

type CharacterDossierProps = {
  character: Character;
};

export default function CharacterDossier({ character }: CharacterDossierProps) {
  return (
    <section className="content dossier" aria-labelledby="dossier-title">
      <Link className="back-link" href="/#characters">← Back to characters</Link>
      <div className="dossier-card">
        <div className="dossier-image">
          <img src={character.image} alt={character.name} />
        </div>
        <div className="dossier-body">
          <p className="eyebrow">Planet Express Academy</p>
          <h1 id="dossier-title">{character.name}</h1>
          <dl className="dossier-details">
            <div><dt>Name</dt><dd>{character.name}</dd></div>
            <div><dt>Gender</dt><dd>{character.gender}</dd></div>
            <div><dt>Status</dt><dd>{character.status}</dd></div>
            <div><dt>Species</dt><dd>{character.species}</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
}
