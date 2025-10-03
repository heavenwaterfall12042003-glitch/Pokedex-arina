import { Link, useSearchParams } from "react-router-dom";

export default function AuthSwitcher({ mode }: { mode: "login" | "register" }) {
  const [sp] = useSearchParams();
  const next = sp.get("next");
  const to = mode === "login" ? "/auth/register" : "/auth/login";
  const href = next ? `${to}?next=${encodeURIComponent(next)}` : to;
  return (
    <Link
      to={href}
      style={{
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: "6px 10px",
      }}
    >
      {mode === "login" ? "Регистрация" : "Вход"}
    </Link>
  );
}
