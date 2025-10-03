import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchPokemons } from "../features/pokemon/pokemonSlice";
import PokemonListCard from "../shared/PokemonListCard";
import { useDebounce } from "../hooks/useDebounce";
import { useSentinel } from "../hooks/useSentinel";
import {
  selectItems,
  selectStatus,
  selectNext,
  selectError,
} from "../features/pokemon/selectors";
import styles from "./HomePage.module.scss";

export default function HomePage() {
  const dispatch = useAppDispatch();

  const items = useAppSelector(selectItems);
  const status = useAppSelector(selectStatus);
  const next = useAppSelector(selectNext);
  const error = useAppSelector(selectError);

  const [params, setParams] = useSearchParams();
  const initialQ = params.get("q") ?? "";
  const [search, setSearch] = useState(initialQ);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPokemons());
    }
  }, [status, dispatch]);

  useEffect(() => {
    const q = search.trim();
    const nextParams = new URLSearchParams(params);
    if (q) nextParams.set("q", q);
    else nextParams.delete("q");
    if (nextParams.toString() !== params.toString()) {
      setParams(nextParams, { replace: true });
    }
  }, [search, params, setParams]);

  const debouncedSearch = useDebounce(search, 300);
  const searching = search !== debouncedSearch;

  const filteredItems = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    if (!q) return items;
    return items.filter((p) => p.name.toLowerCase().includes(q));
  }, [items, debouncedSearch]);

  const { ref: sentinelRef, hit, reset } = useSentinel<HTMLDivElement>("300px");

  useEffect(() => {
    if (!hit) return;
    if (next && status !== "loading") {
      dispatch(fetchPokemons(next));
    }
    reset();
  }, [hit, next, status, dispatch, reset]);

  // активная карточка по URL и навигация стрелками
  const location = useLocation();
  const navigate = useNavigate();

  const activeName = useMemo(() => {
    const m = location.pathname.match(/^\/pokemon\/([^/]+)/);
    return m ? decodeURIComponent(m[1]) : "";
  }, [location.pathname]);

  const activeIndex = useMemo(() => {
    return filteredItems.findIndex((p) => p.name === activeName);
  }, [filteredItems, activeName]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!filteredItems.length) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const delta = e.key === "ArrowDown" ? 1 : -1;
        const base = activeIndex >= 0 ? activeIndex : 0;
        const nextIdx = Math.min(
          filteredItems.length - 1,
          Math.max(0, base + delta)
        );
        const nextName = filteredItems[nextIdx]?.name;
        if (nextName) navigate(`/pokemon/${nextName}`);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filteredItems, activeIndex, navigate]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Покемоны</h1>

      <input
        type="text"
        placeholder="Поиск по имени..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
        aria-label="Поиск по имени"
      />

      {searching && (
        <p style={{ opacity: 0.7, margin: "6px 0" }}>Идёт поиск...</p>
      )}

      {status === "failed" && <p className={styles.error}>{error}</p>}
      {status === "loading" && items.length === 0 && <p>Загрузка...</p>}

      <div className={styles.grid}>
        {filteredItems.map((p) => (
          <PokemonListCard
            key={p.name}
            name={p.name}
            active={p.name === activeName}
          />
        ))}
      </div>

      <div ref={sentinelRef} style={{ height: 1 }} />

      {status === "loading" && items.length > 0 && (
        <p style={{ marginTop: 12 }}>Загрузка...</p>
      )}
    </div>
  );
}
