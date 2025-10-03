import { useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import PokemonCard from "../shared/PokemonCard";
import styles from "./TeamPage.module.scss";
import { clearTeam, reorderTeam } from "../features/pokemon/pokemonSlice";

export default function TeamPage() {
  const { team } = useAppSelector((state) => state.pokemon);
  const dispatch = useAppDispatch();

  const dragIndex = useRef<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const onDragStart = (index: number) => (e: React.DragEvent) => {
    dragIndex.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    setOverIndex(index);
  };

  const onDrop = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const from = dragIndex.current;
    if (from === null) return;
    dispatch(reorderTeam({ from, to: index }));
    dragIndex.current = null;
    setOverIndex(null);
  };

  const onDragEnd = () => {
    dragIndex.current = null;
    setOverIndex(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Моя команда</h1>

      {team.length === 0 && (
        <p className={styles.emptyMessage}>
          Пока нет покемонов в команде. Добавьте их на странице покемона.
        </p>
      )}

      {team.length > 0 && (
        <button
          className={styles.clearBtn}
          onClick={() => dispatch(clearTeam())}
        >
          Очистить команду
        </button>
      )}

      <div className={styles.grid}>
        {team.map((name, index) => (
          <div
            key={name}
            className={`${styles.draggable} ${overIndex === index ? styles.over : ""}`}
            draggable
            onDragStart={onDragStart(index)}
            onDragOver={onDragOver(index)}
            onDrop={onDrop(index)}
            onDragEnd={onDragEnd}
          >
            <PokemonCard name={name} />
          </div>
        ))}
      </div>
    </div>
  );
}
