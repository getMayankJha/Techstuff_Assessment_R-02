export async function fetchPokemonList({ limit = 20, offset = 0 } = {}) {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }
      return await res.json(); // returns { count, results, next, previous }
    } catch (err) {
      throw new Error(`Failed to fetch Pokémon list — ${err.message}`);
    }
  }
  