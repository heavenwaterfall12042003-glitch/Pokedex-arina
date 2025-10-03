import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePokemonQuery } from "../hooks/usePokemonQuery";
import PokemonStats from "../components/pokemon/PokemonStats";
import EvolutionChain from "../components/evolution/EvolutionChain";
import { useEvolutionPaths } from "../hooks/useEvolutionQueries";
import { getPokemon } from "../utils/api";
import styles from "./PokemonPage.module.scss";

export default function PokemonPage() {
  const { name = "" } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data, error, isLoading } = usePokemonQuery(name);

  const numericId = useMemo(() => {
    if (data?.id) return Number(data.id) || null;
    const maybe = Number(name);
    return Number.isFinite(maybe) ? maybe : null;
  }, [data?.id, name]);

  // Префетч соседей по id
  useEffect(() => {
    if (!numericId) return;
    const neighbors = [numericId - 1, numericId + 1].filter((n) => n > 0);
    neighbors.forEach((id) => {
      qc.prefetchQuery({
        queryKey: ["pokemon", String(id)],
        queryFn: () => getPokemon(String(id)),
        staleTime: 1000 * 60 * 5,
      });
    });
  }, [numericId, qc]);

  // Эволюции для текущего покемона
  const evo = useEvolutionPaths(name);

  // Префетч всех узлов цепочки, чтобы переходы были мгновенными
  useEffect(() => {
    if (!evo.paths) return;
    const names = Array.from(
      new Set(evo.paths.flatMap((p) => p.map((s) => s.name)))
    );
    names.forEach((n) => {
      qc.prefetchQuery({
        queryKey: ["pokemon", n],
        queryFn: () => getPokemon(n),
        staleTime: 1000 * 60 * 5,
      });
    });
  }, [evo.paths, qc]);

  const goPrev = () => {
    if (!numericId || numericId <= 1) return;
    navigate(`/pokemon/${numericId - 1}`);
  };
  const goNext = () => {
    if (!numericId) return;
    navigate(`/pokemon/${numericId + 1}`);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (error || !data) {
    const message =
      error instanceof Error ? error.message : "Неизвестная ошибка";
    return (
      <div className={styles.container}>
        <p className={styles.error}>Ошибка загрузки данных: {message}</p>
        <Link to="/">На главную</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <p className={styles.header}>
          <Link to="/">← Назад</Link>
        </p>

        <div className={styles.navButtons}>
          <button
            onClick={goPrev}
            disabled={!numericId || numericId <= 1}
            aria-label="Предыдущий покемон"
          >
            Предыдущий
          </button>
          <button
            onClick={goNext}
            disabled={!numericId}
            aria-label="Следующий покемон"
          >
            Следующий
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div
          className={styles.imageBox}
          aria-busy={!data.sprite}
          aria-live="polite"
        >
          {data.sprite ? (
            <img className={styles.image} src={data.sprite} alt={data.name} />
          ) : (
            <div className={styles.imageSkeleton} />
          )}
        </div>

        <div className={styles.details}>
          <h2 className={styles.name}>
            {data.name}{" "}
            <span className={styles.muted}>
              #{String(data.id).padStart(3, "0")}
            </span>
            {data.nickname ? (
              <span className={styles.nick}>({data.nickname})</span>
            ) : null}
          </h2>

          <div className={styles.types}>
            Типы:
            <span className={styles.tags}>
              {data.types.map((t) => (
                <span key={t} className={styles.tag}>
                  {t}
                </span>
              ))}
            </span>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Характеристики</h3>
            <ul className={styles.kv}>
              <li>
                <span>Рост</span>
                <span>{data.heightM} м</span>
              </li>
              <li>
                <span>Вес</span>
                <span>{data.weightKg} кг</span>
              </li>
              <li>
                <span>Способности</span>
                <span className={styles.tags}>
                  {data.abilities.map((a) => (
                    <span key={a} className={styles.tag}>
                      {a}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <PokemonStats
              stats={(data.raw.stats ?? []).map(
                (s: { base_stat: number; stat: { name: string } }) => ({
                  name: s.stat.name,
                  value: s.base_stat,
                })
              )}
            />
          </div>

          <div className={styles.section}>
            <EvolutionChain
              title="Эволюции"
              paths={evo.paths}
              isLoading={evo.isLoading}
              error={evo.error?.message ?? null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
