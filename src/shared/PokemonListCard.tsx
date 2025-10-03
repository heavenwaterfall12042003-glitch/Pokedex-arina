import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { usePokemonMini } from "../hooks/usePokemonMini";
import TypeBadge from "./TypeBadge";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { addToTeam, removeFromTeam } from "../features/pokemon/pokemonSlice";
import useInView from "../hooks/useInView";
import { makeSelectInTeamByName } from "../features/pokemon/selectors";
import "./PokemonListCard.css";

type Props = { name: string; active?: boolean };

function PokemonListCardBase({ name, active = false }: Props) {
  const { data, loading, error } = usePokemonMini(name);
  const dispatch = useAppDispatch();

  const selectInTeam = useMemo(() => makeSelectInTeamByName(name), [name]);
  const inTeam = useAppSelector(selectInTeam);
  const teamLen = useAppSelector((s) => s.pokemon.team.length);

  const { ref, inView } = useInView<HTMLDivElement>("150px");

  const onToggle = () => {
    if (inTeam) {
      dispatch(removeFromTeam(name));
    } else {
      if (teamLen >= 6) {
        alert("Команда уже полная (максимум 6 покемонов)");
        return;
      }
      dispatch(addToTeam(name));
    }
  };

  return (
    <div className={`plc-card ${active ? "plc-card--active" : ""}`} ref={ref}>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            (e.currentTarget.querySelector("a") as HTMLAnchorElement)?.click();
          }
        }}
        aria-label={`Открыть ${name}`}
        style={{ outline: "none" }}
      >
        <Link to={`/pokemon/${name}`} className="plc-left">
          {loading || !inView ? (
            <div className="plc-skeleton" />
          ) : error ? (
            <div className="plc-error">Ошибка</div>
          ) : (
            <img src={data?.sprite} alt={name} loading="lazy" />
          )}

          <div className="plc-info">
            <div className="plc-name">{name}</div>
            <div className="plc-types">
              {data?.types?.map((t) => (
                <TypeBadge key={t} type={t} />
              ))}
            </div>
          </div>
        </Link>
      </div>

      <button
        className={`plc-btn ${inTeam ? "plc-btn--danger" : ""}`}
        onClick={onToggle}
        aria-label={
          inTeam ? `Удалить ${name} из команды` : `Добавить ${name} в команду`
        }
      >
        {inTeam ? "− Удалить" : "+ Команда"}
      </button>
    </div>
  );
}

export default memo(PokemonListCardBase);
