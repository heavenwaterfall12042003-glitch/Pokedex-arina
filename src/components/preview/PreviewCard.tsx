import { useEffect } from "react";
import { usePokemonQuery } from "../../hooks/usePokemonQuery";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import PokemonStats, { type StatItem } from "../pokemon/PokemonStats";
import "./preview.css";

type Props = {
  name: string;
  x: number;
  y: number;
  onClose: () => void;
};

export default function PreviewCard({ name, x, y, onClose }: Props) {
  const { data, isLoading } = usePokemonQuery(name);

  useLockBodyScroll(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div className="preview__overlay" onClick={onClose} />
      <div
        role="dialog"
        aria-label={`Превью ${name}`}
        className="preview"
        style={{ left: x, top: y }}
      >
        <button
          className="preview__close"
          aria-label="Закрыть превью"
          onClick={onClose}
        >
          ×
        </button>

        {isLoading || !data ? (
          <div className="preview__loading">Загрузка…</div>
        ) : (
          <div className="preview__body">
            <div className="preview__header">
              <img
                className="preview__img"
                src={data.sprite ?? ""}
                alt={data.name}
              />
              <div className="preview__title">
                <div className="preview__name">{data.name}</div>
                <div className="preview__id">
                  #{String(data.id).padStart(3, "0")}
                </div>
              </div>
            </div>

            <div className="preview__row">
              <span className="preview__label">Типы</span>
              <span className="preview__tags">
                {data.types.map((t) => (
                  <span key={t} className={`preview__tag type-${t}`}>
                    {t}
                  </span>
                ))}
              </span>
            </div>

            <div className="preview__row">
              <span className="preview__label">Рост</span>
              <span>{data.heightM} м</span>
            </div>

            <div className="preview__row">
              <span className="preview__label">Вес</span>
              <span>{data.weightKg} кг</span>
            </div>

            {Array.isArray(data.raw?.stats) && (
              <PokemonStats
                title="Статы"
                stats={(
                  data.raw.stats as {
                    base_stat: number;
                    stat: { name: string };
                  }[]
                ).map(
                  (s) => ({ name: s.stat.name, value: s.base_stat }) as StatItem
                )}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}
