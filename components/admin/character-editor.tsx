"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Character } from "../../lib/characters";

type EditableCharacter = Character | Omit<Character, "id">;

type CharacterEditorProps = {
  character: EditableCharacter;
  error: string;
  onSave: (character: EditableCharacter) => Promise<void>;
  onCancel: () => void;
};

const maxImageSize = 5 * 1024 * 1024;
const genderOptions = ["FEMALE", "MALE", "UNKNOWN"] as const;
const statusOptions = ["ALIVE", "DEAD", "UNKNOWN"] as const;
const speciesOptions = ["HUMAN", "MONSTER", "MUTANT", "ROBOT", "UNKNOWN"] as const;

export function createEmptyCharacter(): Omit<Character, "id"> {
  return {
    name: "",
    gender: "UNKNOWN",
    status: "UNKNOWN",
    species: "HUMAN",
    createdAt: new Date().toISOString(),
    image: "",
  };
}

export default function CharacterEditor({ character, error, onSave, onCancel }: CharacterEditorProps) {
  const [form, setForm] = useState<EditableCharacter>(character);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    setForm(character);
    setUploadError("");
  }, [character]);

  async function save(event: FormEvent) {
    event.preventDefault();
    await onSave(form);
  }

  function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file.");
      return;
    }
    if (file.size > maxImageSize) {
      setUploadError("Images must be 5 MB or smaller.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const image = reader.result;
      if (typeof image !== "string") {
        setUploadError("Could not read the selected image.");
        return;
      }
      setForm((current) => ({ ...current, image }));
      setUploadError("");
    };
    reader.onerror = () => setUploadError("Could not read the selected image.");
    reader.readAsDataURL(file);
  }

  const editing = "id" in form;
  return (
    <form className="character-form" onSubmit={save}>
      <h2>{editing ? "Edit character" : "Add character"}</h2>
      {(["name", "gender", "status", "species"] as const).map((key) => (
        <div key={key}>
          <label htmlFor={`character-${key}`}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
          {key === "gender" ? (
            <select id="character-gender" value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value })} required>
              {genderOptions.map((gender) => <option key={gender} value={gender}>{gender}</option>)}
            </select>
          ) : key === "status" ? (
            <select id="character-status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} required>
              {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          ) : key === "species" ? (
            <select id="character-species" value={form.species} onChange={(event) => setForm({ ...form, species: event.target.value })} required>
              {speciesOptions.map((species) => <option key={species} value={species}>{species}</option>)}
            </select>
          ) : (
            <input id={`character-${key}`} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} required />
          )}
        </div>
      ))}
      <div className="image-upload">
        <div>{form.image ? <img src={form.image} alt={`Preview of ${form.name || "character"}`} /> : <span>No image selected</span>}</div>
        <label className="file-upload-button" htmlFor="character-image">Upload image</label>
        <input className="file-upload-input" id="character-image" key={form.image} type="file" accept="image/*" onChange={uploadImage} />
        {!form.image && <span className="image-help">An image is required.</span>}
      </div>
      <button type="submit">{editing ? "Update" : "Create"}</button>
      {editing && <button type="button" onClick={onCancel}>Cancel</button>}
      {(error || uploadError) && <p className="form-error">{error || uploadError}</p>}
    </form>
  );
}
