"use client";

import type { Character } from "../../lib/characters";

type CharacterTableProps = {
  items: Character[];
  onEdit: (character: Character) => void;
  onDelete: (id: number) => Promise<void>;
};

export default function CharacterTable({ items, onEdit, onDelete }: CharacterTableProps) {
  async function remove(id: number) {
    if (!window.confirm("Delete this character?")) return;
    await onDelete(id);
  }

  return (
    <div className="admin-table">
      {items.map((character) => (
        <div className="admin-row" key={character.id}>
          <span>{character.name}</span>
          <span>{character.species} / {character.status}</span>
          <button onClick={() => onEdit(character)}>Edit</button>
          <button onClick={() => remove(character.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
