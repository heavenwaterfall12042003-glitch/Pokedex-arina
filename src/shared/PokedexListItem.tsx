import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { getPokemon } from "../utils/api";
import "./PokemonListCard.css";

type Props = { name: string };

export default function PokedexListItem({ name }: Props) {
  const qc = useQueryClient();

  const onHover = () => {
    qc.prefetchQuery({
      queryKey: ["pokemon", name],
      queryFn: () => getPokemon(name),
      staleTime: 1000 * 60 * 5,
    });
  };

  return (
    <li onMouseEnter={onHover}>
      <Link className="pokemon-list-card" to={`/pokemon/${name}`}>
        <span className="pokemon-list-card__name">{name}</span>
      </Link>
    </li>
  );
}
