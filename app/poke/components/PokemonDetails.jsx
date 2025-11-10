"use client";
import React, { useEffect, useState } from "react";
import { fetchPokemonDetails } from "../../../lib/pokeApi";
import Spinner from "./Spinner";

export default function PokemonDetails({ name }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTypeIndex, setActiveTypeIndex] = useState(0);
  const [version, setVersion] = useState(0);

  async function load(nameToLoad) {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetchPokemonDetails(nameToLoad);
      setData(res);
      setActiveTypeIndex(0);
      setVersion((v) => v + 1);
    } catch (err) {
      setError(err.message || "Failed to load details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!name) return;
    let cancelled = false;
    // small delay to show spinner for quick loads
    const t = setTimeout(() => {
      if (!cancelled) load(name);
    }, 50);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [name]);

  if (!name) return null;

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Spinner size={18} />
        <div>Loading {name} details…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <div className="text-red-700 bg-red-50 p-2 rounded">{error}</div>
        <div>
          <button
            onClick={() => load(name)}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white border rounded hover:bg-gray-50"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const types = data.types || [];
  const activeType = types[activeTypeIndex] || { type: { name: "unknown" } };
  const gameIndicesCount = data.game_indices?.length ?? 0;
  const movesCount = data.moves?.length ?? 0;

  return (
    <div key={version} className="transition-opacity duration-200">
      <div className="mb-3">
        <div className="font-semibold text-lg capitalize">
          {data.name} (#{data.id})
        </div>
        <div className="text-sm text-gray-600">
          Height: {data.height}, Weight: {data.weight}
        </div>
      </div>

      <div className="flex gap-3 mb-3 flex-wrap">
        {types.map((t, i) => (
          <button
            key={t.type.name}
            onClick={() => setActiveTypeIndex(i)}
            className={`px-3 py-1 rounded-lg border transition ${
              i === activeTypeIndex
                ? "bg-blue-100 border-blue-400 text-blue-800"
                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
            }`}
          >
            {t.type.name}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-3">
        <div className="mb-1">
          <span className="font-semibold text-gray-800">Active Type:</span>{" "}
          {activeType.type.name}
        </div>
        <div className="text-sm text-gray-700 space-y-1 mt-2">
          <div>
            <span className="font-medium">Game Indices Count:</span> {gameIndicesCount}
          </div>
          <div>
            <span className="font-medium">Total Moves Count:</span> {movesCount}
          </div>
          <div>
            <span className="font-medium">Abilities:</span>{" "}
            {data.abilities?.map((a) => a.ability.name).join(", ")}
          </div>
        </div>
      </div>
    </div>
  );
}
