import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPokemon } from "../utils/api";

export type PokemonAPI = {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites?: { front_default?: string | null };
  types?: { type?: { name?: string } }[];
  abilities?: { ability?: { name?: string } }[];
  stats?: { base_stat: number; stat: { name: string } }[];
  [k: string]: unknown;
};

export type PokemonTransformed = {
  id: number;
  name: string;
  heightM: number;
  weightKg: number;
  sprite: string | null;
  types: string[];
  abilities: string[];
  raw: PokemonAPI;
  nickname?: string;
};

export function usePokemonQuery(name?: string) {
  const qc = useQueryClient();

  // Берём exact-совпадение из кэша, если есть — это валидный PokemonAPI
  const cached = name
    ? qc.getQueryData<PokemonAPI>(["pokemon", name])
    : undefined;

  return useQuery<
    PokemonAPI,
    Error,
    PokemonTransformed,
    readonly [string, string | undefined]
  >({
    queryKey: ["pokemon", name],
    queryFn: () => getPokemon(name as string),
    enabled: !!name,

    // Поведение кэша
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    retry: 2,

    // Если кэш есть — выдадим его как placeholderData (не ломает типы перегрузки)
    // Это устраняет "No overload matches this call" для initialData.
    placeholderData: cached,

    // Альтернатива для метки времени кэша (необязательно, но помогает Devtools)
    // initialDataUpdatedAt: cached ? Date.now() : undefined,

    // Трансформация под UI
    select: (data: PokemonAPI): PokemonTransformed => ({
      id: data.id,
      name: data.name,
      heightM: data.height / 10,
      weightKg: data.weight / 10,
      sprite: data.sprites?.front_default ?? null,
      types: (data.types ?? []).map((t) => t.type?.name ?? "").filter(Boolean),
      abilities: (data.abilities ?? [])
        .map((a) => a.ability?.name ?? "")
        .filter(Boolean),
      raw: data,
    }),
  });
}
