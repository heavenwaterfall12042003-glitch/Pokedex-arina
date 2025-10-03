import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "../hooks/redux";
import { getPokemon } from "../utils/api";
import type { PokemonTransformed, PokemonAPI } from "../hooks/usePokemonQuery";
import styles from "./PokemonCard.module.scss";

type Props = { name: string };

export default function PokemonCard({ name }: Props) {
  const qc = useQueryClient();
  const customAvatars = useAppSelector(
    (s) =>
      (s as { pokemon?: { customAvatars?: Record<string, string> } }).pokemon
        ?.customAvatars ?? {}
  );
  const customSprite: string | undefined = customAvatars[name];

  const onHover = () => {
    qc.prefetchQuery({
      queryKey: ["pokemon", name],
      queryFn: () => getPokemon(name),
      staleTime: 1000 * 60 * 5,
    });
  };

  const cachedT = qc.getQueryData<PokemonTransformed>(["pokemon", name]);
  const cachedRaw = qc.getQueryData<PokemonAPI>(["pokemon", name]) as
    | PokemonAPI
    | undefined;

  const sprite =
    customSprite ?? cachedT?.sprite ?? cachedRaw?.sprites?.front_default ?? "";

  return (
    <Link
      className={styles.card}
      to={`/pokemon/${name}`}
      onMouseEnter={onHover}
    >
      <img className={styles.image} src={sprite} alt={name} />
      <div className={styles.name}>{name}</div>
    </Link>
  );
}
