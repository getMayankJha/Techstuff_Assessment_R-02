export async function fetchPokemonList({ limit = 20, offset = 0 } = {}) {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      throw new Error(`Failed to fetch Pokémon list — ${err.message}`);
    }
  }
  

  export async function fetchPokemonDetails(nameOrId) {
    const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(nameOrId)}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) throw new Error(`Pokémon not found: ${nameOrId}`);
        throw new Error(`API error: ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      throw new Error(`Failed to fetch Pokémon details — ${err.message}`);
    }
  }
  