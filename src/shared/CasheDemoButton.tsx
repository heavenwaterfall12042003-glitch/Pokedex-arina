import { useQueryClient } from "@tanstack/react-query";
import type { PokemonTransformed } from "../hooks/usePokemonQuery";

type Props = { name: string };

export default function CacheDemoButton({ name }: Props) {
  const qc = useQueryClient();

  const onRead = () => {
    const cached = qc.getQueryData<PokemonTransformed>(["pokemon", name]);
    console.log('[RQ] getQueryData(["pokemon", name]) =', cached);
    alert("Содержимое кэша выведено в консоль DevTools.");
  };

  const onPatch = () => {
    qc.setQueryData<PokemonTransformed | undefined>(
      ["pokemon", name],
      (prev) => {
        if (!prev) return prev;
        return { ...prev, nickname: (prev.nickname ?? prev.name) + " ★" };
      }
    );
    alert("Кэш обновлён: добавлен nickname c ★");
  };

  const onInvalidate = () => {
    qc.invalidateQueries({ queryKey: ["pokemon", name] });
    alert("Инвалидация выполнена — произойдёт refetch при возможности.");
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button onClick={onRead}>Показать кэш</button>
      <button onClick={onPatch}>Патч кэша</button>
      <button onClick={onInvalidate}>Инвалидировать</button>
    </div>
  );
}
