import type { AuthError } from "firebase/auth";

const messages: Record<string, string> = {
  "auth/email-already-in-use": "Email уже используется",
  "auth/invalid-email": "Некорректный email",
  "auth/operation-not-allowed": "Операция запрещена",
  "auth/weak-password": "Слабый пароль",
  "auth/user-disabled": "Пользователь отключён",
  "auth/user-not-found": "Пользователь не найден",
  "auth/wrong-password": "Неверный пароль",
  "auth/popup-closed-by-user": "Окно авторизации закрыто",
  "auth/cancelled-popup-request": "Окно авторизации уже открыто",
};

export function mapAuthError(err: unknown): string {
  const code =
    typeof err === "object" && err !== null && "code" in err
      ? String((err as Pick<AuthError, "code">).code)
      : undefined;
  return (code && messages[code]) || "Ошибка авторизации";
}
