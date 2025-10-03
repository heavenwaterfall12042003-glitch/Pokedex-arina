import {
  useQuery,
  useInfiniteQuery,
  type QueryKey,
} from "@tanstack/react-query";
import { getPokemon } from "../../utils/api";

export function usePokemon(name: string | null) {
  return useQuery({
    queryKey: ["pokemon", name] as QueryKey,
    queryFn: () => getPokemon(name!),
    enabled: !!name,
    staleTime: 300000,
  });
}

const PAGE_SIZE = 24;
const API = "https://pokeapi.co/api/v2/pokemon";

async function fetchPage({ pageParam }: { pageParam?: string | null }) {
  const url = pageParam ?? `${API}?limit=${PAGE_SIZE}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load pokemons");
  return (await res.json()) as {
    results: { name: string; url: string }[];
    next: string | null;
  };
}

export function usePokedexList(polling = false, paused = false) {
  return useInfiniteQuery({
    queryKey: ["pokemons"],
    queryFn: fetchPage,
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.next,
    staleTime: 300000,
    gcTime: 1800000,
    refetchInterval: polling && !paused ? 10000 : 0,
    refetchIntervalInBackground: true,
  });
}
