"use client";
import React, { useEffect, useState } from "react";
import { fetchPokemonList } from "../../../lib/pokeApi";
import Pagination from "./Pagination";


export default function PokemonTable({ initialData, initialPage = 1, pageSize = 20 }) {
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (page === initialPage && initialData) {
      setData(initialData);
      return;
    }

    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const offset = (page - 1) * pageSize;
        const res = await fetchPokemonList({ limit: pageSize, offset });
        if (!cancelled) setData(res);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to fetch");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [page]);

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-lg font-medium mb-3">Pokémon List</h2>

      {loading && <div className="p-4">Loading page {page}…</div>}
      {error && <div className="p-4 text-red-700 bg-red-50 rounded">{error}</div>}

      {!loading && !error && data && (
        <>
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 px-2">Sr. Number</th>
                <th className="py-2 px-2">Poke Name</th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((p, idx) => {
                const sr = (page - 1) * pageSize + idx + 1;
                return (
                  <tr key={p.name} className="hover:bg-gray-50">
                    <td className="py-2 px-2 align-top">{sr}</td>
                    <td className="py-2 px-2">
                      <span className="text-gray-900">{p.name}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mt-4">
            <Pagination
              page={page}
              setPage={setPage}
              pageSize={pageSize}
              totalCount={data.count}
            />
          </div>
        </>
      )}
    </div>
  );
}
