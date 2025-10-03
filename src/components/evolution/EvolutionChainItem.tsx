import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import type { EvolutionStep } from "../../types/evolution";
import { getPokemon } from "../../utils/api";
import "./evolution.css";

type Props = { step: EvolutionStep };

export default function EvolutionChainItem({ step }: Props) {
  const qc = useQueryClient();

  const spriteUrl = step.speciesId
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${step.speciesId}.png`
    : "";

  const onHover = () => {
    if (!step.name) return;
    qc.prefetchQuery({
      queryKey: ["pokemon", step.name],
      queryFn: () => getPokemon(step.name),
      staleTime: 1000 * 60 * 5,
    });
  };

  const broken = !step.name || !step.speciesId;

  return (
    <div className="evo__item" onMouseEnter={onHover}>
      {broken ? (
        <div className="evo__card">
          <div className="evo__broken">Нет данных</div>
        </div>
      ) : (
        <Link className="evo__card" to={`/pokemon/${step.name}`}>
          <img className="evo__img" src={spriteUrl} alt={step.name} />
          <div className="evo__name">{step.name}</div>
        </Link>
      )}

      {(step.minLevel || step.trigger || step.item) && (
        <div className="evo__meta">
          {step.minLevel ? (
            <span className="evo__pill">Lvl {step.minLevel}</span>
          ) : null}
          {step.trigger ? (
            <span className="evo__pill">{step.trigger}</span>
          ) : null}
          {step.item ? <span className="evo__pill">{step.item}</span> : null}
        </div>
      )}
    </div>
  );
}
