import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import PokedexListItem from "../shared/PokedexListItem";
import PokemonListItemSkeleton from "../shared/PokemonListItemSkeleton";
import { getPokemon } from "../utils/api";
import useInView from "../hooks/useInView";
import PreviewCard from "../components/preview/PreviewCard";
import { useHoverPreview } from "../hooks/useHoverPreview";
import Portal from "../shared/Portal";
import PokemonModal from "../components/pokemon/PokemonModal";

type PokeListItem = { name: string; url: string };
type PokeListResponse = { results: PokeListItem[]; next: string | null };

const PAGE_SIZE = 24;
const API = "https://pokeapi.co/api/v2/pokemon";

async function fetchPage({ pageParam }: { pageParam?: string | null }) {
  const url = pageParam ?? `${API}?limit=${PAGE_SIZE}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load pokemons");
  return (await res.json()) as PokeListResponse;
}

export default function PokedexPage() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [polling, setPolling] = useState(false);
  const [paused, setPaused] = useState(false);
  const qc = useQueryClient();

  const {
    data,
    error,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["pokemons"],
    queryFn: fetchPage,
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.next,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchInterval: polling && !paused ? 10_000 : 0,
    refetchIntervalInBackground: true,
  });

  // Пауза polling при скрытии вкладки
  useEffect(() => {
    const onVis = () => setPaused(document.visibilityState === "hidden");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Синхронизация строки поиска с URL
  useEffect(() => {
    const nextParams = new URLSearchParams(params);
    if (q) nextParams.set("q", q);
    else nextParams.delete("q");
    if (nextParams.toString() !== params.toString()) {
      setParams(nextParams, { replace: true });
    }
  }, [q, params, setParams]);

  // Плоский список и фильтрация
  const items = useMemo<PokeListItem[]>(
    () => (data ? data.pages.flatMap((p) => p.results) : []),
    [data]
  );

  const filtered = useMemo<PokeListItem[]>(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((p) => p.name.toLowerCase().includes(s));
  }, [items, q]);

  // Сентинел для автодогрузки
  const { ref: sentinelRef, inView } = useInView<HTMLDivElement>("200px");

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    if (inView) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Префетч и превью по hover
  const [previewName, setPreviewName] = useState<string | null>(null);
  const { visible, coords, onEnter, onLeave, setVisible } =
    useHoverPreview(300);

  const onHoverName = (name: string) => {
    qc.prefetchQuery({
      queryKey: ["pokemon", name],
      queryFn: () => getPokemon(name),
      staleTime: 1000 * 60 * 5,
    });
  };

  const handleItemEnter = (name: string) => (e: React.MouseEvent) => {
    onEnter(e);
    onHoverName(name);
    setPreviewName(name);
  };
  const handleItemLeave = () => {
    onLeave();
    setPreviewName(null);
  };

  // Модалка покемона по клику
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const skeletons = useMemo(() => new Array(PAGE_SIZE).fill(null), []);

  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <h1 className="h1" style={{ margin: 0 }}>
          Pokedex
        </h1>
        <button className="btn" onClick={() => refetch()}>
          Обновить список
        </button>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            checked={polling}
            onChange={(e) => setPolling(e.target.checked)}
          />
          Автообновление
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              marginLeft: 6,
              background:
                document.visibilityState === "hidden"
                  ? "#f59e0b"
                  : polling
                    ? "#10b981"
                    : "#9ca3af",
              boxShadow: isFetching ? "0 0 0 3px rgba(16,185,129,0.2)" : "none",
              transition: "all .2s",
            }}
          />
        </label>
      </div>

      <input
        type="text"
        placeholder="Поиск по имени..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Поиск"
        style={{
          width: "100%",
          maxWidth: 360,
          padding: "8px 10px",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          marginBottom: 12,
        }}
      />

      {error && <p style={{ color: "#b91c1c" }}>{(error as Error).message}</p>}

      {!isLoading && filtered.length === 0 && (
        <div className="card" style={{ color: "#6b7280" }}>
          <p style={{ marginBottom: 8 }}>Ничего не найдено по запросу “{q}”.</p>
          <button
            className="btn"
            onClick={() => setQ("")}
            aria-label="Сбросить поиск"
          >
            Сбросить
          </button>
        </div>
      )}

      <ul
        aria-live="polite"
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "grid",
          gap: 8,
        }}
      >
        {isLoading && items.length === 0
          ? skeletons.map((_, i) => <PokemonListItemSkeleton key={i} />)
          : filtered.map((p) => (
              <li
                key={p.name}
                onMouseEnter={handleItemEnter(p.name)}
                onMouseLeave={handleItemLeave}
                onClick={() => setSelectedName(p.name)}
                style={{ cursor: "pointer" }}
              >
                <PokedexListItem name={p.name} />
              </li>
            ))}
      </ul>

      <div ref={sentinelRef} style={{ height: 1 }} />

      <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
        <button
          className="btn"
          disabled={!hasNextPage || isFetchingNextPage}
          onClick={() => fetchNextPage()}
          aria-busy={isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Загрузка..."
            : hasNextPage
              ? "Загрузить ещё"
              : "Больше нет"}
        </button>
      </div>

      {visible && previewName && (
        <Portal>
          <PreviewCard
            name={previewName}
            x={coords.x}
            y={coords.y}
            onClose={() => setVisible(false)}
          />
        </Portal>
      )}

      <PokemonModal name={selectedName} onClose={() => setSelectedName(null)} />
    </div>
  );
}
