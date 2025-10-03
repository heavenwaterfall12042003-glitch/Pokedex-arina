import { useQuery } from "@tanstack/react-query";
import {
  getPokemonSpecies,
  getEvolutionChain,
  type PokemonSpecies,
  type EvolutionChain,
} from "../utils/api-evolution";
import { extractIdFromUrl, toIdOrName } from "../utils/pokeIds";
import { buildEvolutionPaths } from "../utils/evolution-builders";
import type { EvolutionPath } from "../types/evolution";

export function usePokemonSpeciesQuery(idOrName: string | number | undefined) {
  const key = toIdOrName(idOrName ?? "");
  return useQuery<PokemonSpecies, Error>({
    queryKey: ["pokemon-species", key],
    queryFn: () => getPokemonSpecies(key),
    enabled: key.length > 0,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 2,
  });
}

export function useEvolutionChainQuery(chainId: number | null | undefined) {
  return useQuery<EvolutionChain, Error>({
    queryKey: ["evolution-chain", chainId],
    queryFn: () => getEvolutionChain(chainId as number),
    enabled: typeof chainId === "number" && chainId > 0,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 2,
  });
}

export function useEvolutionPaths(idOrName: string | number | undefined) {
  const speciesQ = usePokemonSpeciesQuery(idOrName);

  const chainId = speciesQ.data?.evolution_chain?.url
    ? extractIdFromUrl(speciesQ.data.evolution_chain.url)
    : null;

  const chainQ = useEvolutionChainQuery(chainId);

  const paths: EvolutionPath[] | undefined = chainQ.data?.chain
    ? buildEvolutionPaths(chainQ.data.chain)
    : undefined;

  const isLoading = speciesQ.isLoading || chainQ.isLoading;
  const isError = speciesQ.isError || chainQ.isError;
  const error = speciesQ.error ?? chainQ.error ?? null;

  return {
    species: speciesQ.data,
    chain: chainQ.data,
    paths,
    isLoading,
    isError,
    error,
  };
}
