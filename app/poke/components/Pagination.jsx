"use client";
import React from "react";

export default function Pagination({ page, setPage, pageSize, totalCount }) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex items-center justify-between">
      <div>
        <button
          onClick={() => canPrev && setPage(page - 1)}
          disabled={!canPrev}
          aria-disabled={!canPrev}
          className={`px-3 py-1 rounded focus:outline-none focus:ring ${!canPrev ? "opacity-50 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200"}`}
        >
          Previous
        </button>
      </div>

      <div className="text-sm text-gray-700">
        Page <strong>{page}</strong> of <strong>{totalPages}</strong> — {totalCount} Pokémon
      </div>

      <div>
        <button
          onClick={() => canNext && setPage(page + 1)}
          disabled={!canNext}
          aria-disabled={!canNext}
          className={`px-3 py-1 rounded focus:outline-none focus:ring ${!canNext ? "opacity-50 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
