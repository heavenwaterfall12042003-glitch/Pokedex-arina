import { useEffect, useState } from "react";
import { getPokemon } from "../utils/api";

type Mini = {
  id: number;
  sprite?: string;
  types: string[];
};

const cache = new Map<string, Mini>();

type ApiResponse = {
  id: number;
  sprites?: { front_default?: string };
  types?: { slot: number; type: { name: string; url: string } }[];
};

export function usePokemonMini(name: string) {
  const [data, setData] = useState<Mini | null>(cache.get(name) || null);
  const [loading, setLoading] = useState(!cache.has(name));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    if (cache.has(name)) {
      setData(cache.get(name)!);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getPokemon(name)
      .then((json: ApiResponse) => {
        if (!alive) return;
        const mini: Mini = {
          id: json.id,
          sprite: json.sprites?.front_default,
          types: (json.types ?? []).map((t) => t.type.name),
        };
        cache.set(name, mini);
        setData(mini);
      })
      .catch((e: unknown) => {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Unknown error");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [name]);

  return { data, loading, error };
}
