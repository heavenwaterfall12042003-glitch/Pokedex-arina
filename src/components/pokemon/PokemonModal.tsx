import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "../../hooks/redux";
import { useAddToTeam } from "../../hooks/teamQueries";
import Modal from "../modal/Modal";
import { getPokemon } from "../../utils/api";

// Упрощённые типы ответа PokeAPI
type PokemonType = { slot: number; type: { name: string; url: string } };
type PokemonStat = {
  base_stat: number;
  effort: number;
  stat: { name: string; url: string };
};

type Props = { name: string | null; onClose: () => void };

export default function PokemonModal({ name, onClose }: Props) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["pokemon", name],
    queryFn: () => getPokemon(name!),
    enabled: !!name,
    staleTime: 300000,
  });

  const uid = useAppSelector((s) => s.auth.user?.uid) ?? null;
  const addTeam = useAddToTeam(uid);

  return (
    <Modal open={!!name} onClose={onClose}>
      {isLoading ? <div>Загрузка...</div> : null}
      {error ? (
        <div style={{ color: "#b91c1c" }}>{(error as Error).message}</div>
      ) : null}
      {data ? (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ margin: 0, textTransform: "capitalize" }}>
              {data.name}
            </h2>
            <button onClick={onClose}>Закрыть</button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "180px 1fr",
              gap: 16,
              marginTop: 12,
            }}
          >
            <img
              src={
                data.sprites?.other?.["official-artwork"]?.front_default ||
                data.sprites?.front_default
              }
              alt={data.name}
              width={180}
              height={180}
            />
            <div>
              <div>Вес: {data.weight}</div>
              <div>Рост: {data.height}</div>

              <div style={{ marginTop: 8 }}>
                Типы:{" "}
                {(data.types as PokemonType[])
                  .map((t) => t.type.name)
                  .join(", ")}
              </div>

              <div style={{ marginTop: 8 }}>
                Статы:
                <ul>
                  {(data.stats as PokemonStat[]).map((s) => (
                    <li key={s.stat.name}>
                      {s.stat.name}: {s.base_stat}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                disabled={!uid || addTeam.isPending}
                onClick={() =>
                  addTeam.mutate({
                    id: data.id,
                    name: data.name,
                    addedAt: Date.now(),
                  })
                }
              >
                Добавить в команду
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
