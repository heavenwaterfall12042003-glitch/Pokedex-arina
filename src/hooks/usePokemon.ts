import { useEffect, useState } from "react";
import { getPokemon } from "../utils/api";

export type Pokemon = {
  name: string;
  id: number;
  sprites: { front_default?: string };
  types: { slot: number; type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  height: number; // дм
  weight: number; // гд
  stats: { base_stat: number; stat: { name: string } }[];
};

type CacheEntry = { data: Pokemon; ts: number };

const cache = new Map<string, CacheEntry>();
const STALE_MS = 5 * 60 * 1000; // 5 минут

export async function prefetchPokemon(name: string | undefined): Promise<void> {
  if (!name) return;
  const hit = cache.get(name);
  const now = Date.now();
  if (hit && now - hit.ts < STALE_MS) return;
  try {
    const data = await getPokemon(name);
    cache.set(name, { data, ts: Date.now() });
  } catch {
    // тихий префетч — игнорируем ошибки
  }
}

export function usePokemon(name: string | undefined) {
  const [data, setData] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(!!name);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) return;
    setError(null);

    const hit = cache.get(name);
    const now = Date.now();
    if (hit && now - hit.ts < STALE_MS) {
      setData(hit.data);
      setLoading(false);
      return;
    }

    setLoading(true);
    getPokemon(name)
      .then((json) => {
        cache.set(name, { data: json, ts: Date.now() });
        setData(json);
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Unknown error")
      )
      .finally(() => setLoading(false));
  }, [name]);

  return { data, loading, error };
}
