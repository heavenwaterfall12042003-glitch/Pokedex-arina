import styles from "./PokemonShortCard.module.scss";

type Props = {
  id: number;
  name: string;
  onRemove?: () => void;
};

export default function PokemonShortCard({ id, name, onRemove }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.name}>{name}</div>
        <button className={styles.btn} onClick={onRemove}>
          Удалить
        </button>
      </div>
      <div style={{ fontSize: 12, color: "#6b7280" }}>ID: {id}</div>
    </div>
  );
}
