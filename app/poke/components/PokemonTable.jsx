"use client";
import React, { useEffect, useState } from "react";
import { fetchPokemonList } from "../../../lib/pokeApi";
import Pagination from "./Pagination";
import PokemonDetails from "./PokemonDetails";
import Spinner from "./Spinner";
import { useRouter, useSearchParams } from "next/navigation";

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="py-2 px-2">
        <div className="h-4 w-8 bg-gray-200 rounded" />
      </td>
      <td className="py-2 px-2">
        <div className="h-4 w-32 bg-gray-200 rounded" />
      </td>
    </tr>
  );
}

export default function PokemonTable({ initialData, initialPage = 1, pageSize = 20 }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pageFromUrl = Number(searchParams?.get("page") || initialPage);

  const [page, setPage] = useState(pageFromUrl || initialPage);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [version, setVersion] = useState(0); 

  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("page", String(page));
    const qp = params.toString();
    const url = qp ? `/poke?${qp}` : `/poke`;
    router.replace(url);
  }, [page]);

  useEffect(() => {
    const urlPage = Number(searchParams?.get("page") || initialPage);
    if (!isNaN(urlPage) && urlPage !== page) setPage(urlPage);
  }, [searchParams?.toString()]); 

  useEffect(() => {
    if (page === initialPage && initialData) {
      setData(initialData);
      return;
    }

    let cancelled = false;
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const offset = (page - 1) * pageSize;
        const res = await fetchPokemonList({ limit: pageSize, offset });
        if (!cancelled) {
          setData(res);
          setVersion((v) => v + 1);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to fetch Pokémon list");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
      active = false;
    };
  }, [page]);

  function retry() {
    setPage((p) => p);
  }

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-lg font-medium mb-3">Pokémon List</h2>

      {loading && (
        <div className="p-4">
          <div className="flex items-center gap-2">
            <Spinner size={18} />
            <div>Loading page {page}…</div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 text-red-700 bg-red-50 rounded space-y-2">
          <div>{error}</div>
          <div>
            <button
              onClick={retry}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white border rounded hover:bg-gray-50"
            >
              <span>Retry</span>
            </button>
          </div>
        </div>
      )}

      {!loading && !error && data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="overflow-hidden transition-all duration-300 ease-out">
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2 px-2">Sr. Number</th>
                    <th className="py-2 px-2">Poke Name</th>
                  </tr>
                </thead>
                <tbody key={version} className="transition-opacity duration-300">
                  {data.results.length === 0
                    ? (
                      <tr>
                        <td colSpan="2" className="py-6 px-2 text-center text-gray-500">
                          No Pokémon found.
                        </td>
                      </tr>
                    )
                    : data.results.map((p, idx) => {
                      const sr = (page - 1) * pageSize + idx + 1;
                      return (
                        <tr key={p.name} className="hover:bg-gray-50">
                          <td className="py-2 px-2 align-top">{sr}</td>
                          <td className="py-2 px-2">
                            <button
                              onClick={() => setSelectedPokemon(p.name)}
                              className="text-blue-600 hover:underline capitalize"
                            >
                              {p.name}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <Pagination
                page={page}
                setPage={setPage}
                pageSize={pageSize}
                totalCount={data.count}
              />
            </div>
          </div>

          <div>
            <div className="bg-white rounded shadow p-4 sticky top-6">
              <h3 className="text-lg font-medium mb-3">Details</h3>
              {selectedPokemon ? (
                <PokemonDetails name={selectedPokemon} />
              ) : (
                <div className="text-sm text-gray-600">Click a Pokémon name to view details.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {loading && !data && (
        <div className="mt-4">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 px-2">Sr. Number</th>
                <th className="py-2 px-2">Poke Name</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
