const DEFAULT_TIMEOUT = 10000;
const DEFAULT_RETRIES = 2;

async function fetchWithTimeout(url, options = {}, timeout = DEFAULT_TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    if (err.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw err;
  }
}

async function fetchWithRetry(url, opts = {}, { retries = DEFAULT_RETRIES, timeout = DEFAULT_TIMEOUT } = {}) {
  let attempt = 0;
  let lastErr = null;
  while (attempt <= retries) {
    try {
      const res = await fetchWithTimeout(url, opts, timeout);
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        const msg = `API error: ${res.status} ${res.statusText}${text ? ` — ${text.slice(0, 200)}` : ""}`;
        if (res.status >= 500 || res.status === 429) {
          throw new Error(msg);
        } else {
          const e = new Error(msg);
          e.fatal = true;
          throw e;
        }
      }
      const json = await res.json();
      return json;
    } catch (err) {
      lastErr = err;
      if (err && err.fatal) throw err;
      attempt += 1;
      if (attempt > retries) break;
      await new Promise((r) => setTimeout(r, 300 * attempt));
    }
  }
  throw new Error(lastErr?.message || "Network request failed");
}

export async function fetchPokemonList({ limit = 20, offset = 0 } = {}) {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  try {
    return await fetchWithRetry(url);
  } catch (err) {
    throw new Error(`Failed to fetch Pokémon list — ${err.message}`);
  }
}

export async function fetchPokemonDetails(nameOrId) {
  const url = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(nameOrId)}`;
  try {
    return await fetchWithRetry(url);
  } catch (err) {
    throw new Error(`Failed to fetch Pokémon details — ${err.message}`);
  }
}
