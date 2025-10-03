import { useAppSelector } from "../hooks/redux";
import { useAddToTeam } from "../hooks/teamQueries";

type Props = { id: number; name: string; imageUrl?: string };

export default function PokemonCard({ id, name, imageUrl }: Props) {
  const uid = useAppSelector((s) => s.auth.user?.uid) ?? null;
  const addTeam = useAddToTeam(uid);

  return (
    <div className="poke-card">
      {imageUrl ? (
        <img src={imageUrl} alt={name} width={120} height={120} />
      ) : null}
      <div className="poke-title">{name}</div>
      <button
        disabled={!uid || addTeam.isPending}
        onClick={() => addTeam.mutate({ id, name, addedAt: Date.now() })}
      >
        Добавить в команду
      </button>
    </div>
  );
}
