import React from "react";
import PokemonTable from "./components/PokemonTable";
import { fetchPokemonList } from "../../lib/pokeApi";

export default async function PokePage({ searchParams }) {
  const page = Number(searchParams?.page || 1);
  const pageSize = 20;
  const offset = (page - 1) * pageSize;

  let data = null;
  let error = null;

  try {
    data = await fetchPokemonList({ limit: pageSize, offset });
  } catch (err) {
    error = err.message || "Unknown error";
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Pokémon Explorer</h1>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded">
          {error}
        </div>
      ) : (
        <PokemonTable initialData={data} initialPage={page} pageSize={pageSize} />
      )}
    </main>
  );
}
