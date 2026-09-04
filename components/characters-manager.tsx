"use client";

import { useEffect, useMemo, useState } from "react";
import type { Character } from "../lib/characters";

const charactersPerPage = 8;

function Logo() {
  return (
    <div className="logo" aria-label="Planet Express Academy">
      <span className="logo-rocket" aria-hidden="true">◢</span>
      <span>P.E.A</span>
    </div>
  );
}

export default function CharactersManager() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/characters")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Characters request failed with status ${response.status}.`);
        }
        return response.json() as Promise<{ items: Character[] }>;
      })
      .then((data) => {
        setCharacters(data.items);
        setError("");
      })
      .catch((requestError: unknown) => {
        console.error("Could not load characters.", requestError);
        setError("Could not load characters. Please try again later.");
      });
  }, []);
  const pageCount = Math.ceil(characters.length / charactersPerPage);
  const visibleCharacters = useMemo(
    () => characters.slice((page - 1) * charactersPerPage, page * charactersPerPage),
    [page],
  );

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), pageCount));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main>
      <header className="site-header">
        <Logo />
        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#characters" aria-current="page">Characters</a>
          <a href="#contact">Contact</a>
          <a href="/admin">Admin</a>
        </nav>
      </header>

      <section className="content" id="characters">
        <div className="intro">
          <p className="eyebrow">Planet Express Academy</p>
          <h1>Faculty &amp; Crew</h1>
          <p>Learn from the best (and the most eccentric) in the business.</p>
        </div>

        <div className="character-grid">
          {error && <p className="form-error">{error}</p>}
          {visibleCharacters.map((character) => (
            <article className="character-card" key={character.id}>
              <div className="image-frame">
                <img src={character.image} alt="" loading="lazy" />
              </div>
              <div className="card-body">
                <h2>{character.name}</h2>
                <button type="button">View dossier</button>
              </div>
            </article>
          ))}
        </div>

        <div className="pagination" aria-label="Character pages">
          <button
            className="page-arrow"
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
          >
            ‹
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
            <button
              className={pageNumber === page ? "page-number active" : "page-number"}
              type="button"
              key={pageNumber}
              onClick={() => goToPage(pageNumber)}
              aria-label={`Page ${pageNumber}`}
              aria-current={pageNumber === page ? "page" : undefined}
            >
              {pageNumber}
            </button>
          ))}
          <button
            className="page-arrow"
            type="button"
            onClick={() => goToPage(page + 1)}
            disabled={page === pageCount}
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      </section>
    </main>
  );
}