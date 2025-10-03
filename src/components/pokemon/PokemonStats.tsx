import "./pokemon-stats.css";

export type StatItem = { name: string; value: number };

type Props = {
  title?: string;
  stats: StatItem[];
};

const MAX_STAT = 255;

export default function PokemonStats({
  title = "Базовые статы",
  stats,
}: Props) {
  return (
    <div className="pst">
      <h3 className="pst__title">{title}</h3>
      <ul className="pst__list">
        {stats.map((s) => {
          const pct = Math.min(100, Math.round((s.value / MAX_STAT) * 100));
          return (
            <li key={s.name} className="pst__row">
              <div className="pst__name">{s.name}</div>
              <div className="pst__val">{s.value}</div>
              <div className="pst__bar">
                <div className="pst__fill" style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
