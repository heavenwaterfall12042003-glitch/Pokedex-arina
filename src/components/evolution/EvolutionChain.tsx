import EvolutionChainItem from "./EvolutionChainItem";
import type { EvolutionPath } from "../../types/evolution";
import "./evolution.css";

type Props = {
  paths: EvolutionPath[] | undefined;
  title?: string;
  isLoading?: boolean;
  error?: string | null;
};

export default function EvolutionChain({
  paths,
  title = "Эволюции",
  isLoading,
  error,
}: Props) {
  if (isLoading) {
    return (
      <section className="evo">
        <h3 className="evo__title">{title}</h3>
        <div className="evo__loading">Загрузка цепочки…</div>
      </section>
    );
  }
  if (error) {
    return (
      <section className="evo">
        <h3 className="evo__title">{title}</h3>
        <div className="evo__error">{error}</div>
      </section>
    );
  }
  if (!paths || paths.length === 0) {
    return (
      <section className="evo">
        <h3 className="evo__title">{title}</h3>
        <div className="evo__empty">Нет данных об эволюциях.</div>
      </section>
    );
  }

  return (
    <section className="evo">
      <h3 className="evo__title">{title}</h3>

      <div className="evo__paths">
        {paths.map((path, idx) => (
          <div key={idx} className="evo__path">
            {path.map((step, i) => (
              <div key={step.name} className="evo__node">
                <EvolutionChainItem step={step} />
                {i < path.length - 1 && (
                  <div className="evo__arrow" aria-hidden>
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
