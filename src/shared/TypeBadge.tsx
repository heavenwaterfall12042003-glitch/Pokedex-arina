import { TYPE_COLORS } from "../utils/typeColors";

export default function TypeBadge({ type }: { type: string }) {
  const color = TYPE_COLORS[type] || "#999";
  const style: React.CSSProperties = {
    backgroundColor: color,
    color: "#fff",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    textTransform: "capitalize",
  };
  return <span style={style}>{type}</span>;
}
