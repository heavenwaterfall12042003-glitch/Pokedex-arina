import { useInfiniteQuery } from "@tanstack/react-query";
import type { QueryFunctionContext } from "@tanstack/react-query";

export type PokeListItem = { name: string; url: string };
export type PokeListResponse = { results: PokeListItem[]; next: string | null };

const PAGE_SIZE = 24;
const API = "https://pokeapi.co/api/v2/pokemon";

async function fetchPage(
  ctx: QueryFunctionContext<readonly ["pokemons"], string | null>
): Promise<PokeListResponse> {
  const url = ctx.pageParam ?? `${API}?limit=${PAGE_SIZE}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load pokemons");
  return (await res.json()) as PokeListResponse;
}

export function usePokemonsInfinite() {
  return useInfiniteQuery<
    PokeListResponse,
    Error,
    PokeListResponse,
    ["pokemons"],
    string | null
  >({
    queryKey: ["pokemons"],
    queryFn: fetchPage,
    initialPageParam: null,
    getNextPageParam: (last) => last.next,
    staleTime: 1000 * 60 * 5,
  });
}
