"use client";
import React, { useEffect, useState } from "react";
import { fetchPokemonDetails } from "../../../lib/pokeApi";

export default function PokemonDetails({ name }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTypeIndex, setActiveTypeIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setData(null);
    setActiveTypeIndex(0);

    fetchPokemonDetails(name)
      .then((res) => !cancelled && setData(res))
      .catch((err) => !cancelled && setError(err.message || "Failed to load details"))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [name]);

  if (loading) return <div>Loading details for {name}…</div>;
  if (error) return <div className="text-red-700 bg-red-50 p-2 rounded">{error}</div>;
  if (!data) return null;

  const types = data.types;
  const activeType = types[activeTypeIndex];
  const gameIndicesCount = data.game_indices?.length ?? 0;
  const movesCount = data.moves?.length ?? 0;

  return (
    <div>
      <div className="mb-3">
        <div className="font-semibold text-lg capitalize">
          {data.name} (#{data.id})
        </div>
        <div className="text-sm text-gray-600">
          Height: {data.height}, Weight: {data.weight}
        </div>
      </div>

      <div className="flex gap-3 mb-3">
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

      <div className="bg-gray-50 rounded-lg p-3 transition-all">
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
        </div>
      </div>
    </div>
  );
}
