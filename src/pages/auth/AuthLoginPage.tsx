import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import Input from "../../shared/forms/Input";
import PasswordInput from "../../shared/forms/PasswordInput";
import styles from "../AuthPage.module.scss";
import { useSignInEmail, useSignInGoogle } from "../../hooks/authMutations";
import { resetPassword } from "../../services/password";
import useNextUrl from "../../hooks/useNextUrl";
import AuthSwitcher from "./AuthSwitcher";

const loginSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
});
type LoginValues = z.infer<typeof loginSchema>;

export default function AuthLoginPage() {
  const next = useNextUrl("/");
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const signIn = useSignInEmail(() => (window.location.href = next));
  const signInG = useSignInGoogle(() => (window.location.href = next));

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Вход</h2>
          <AuthSwitcher mode="login" />
        </div>

        <div className={styles.hero} />

        <form
          className={styles.form}
          onSubmit={form.handleSubmit(async (v) => {
            try {
              await signIn.mutateAsync({
                email: v.email,
                password: v.password,
              });
            } catch (e) {
              form.setError("root", {
                message: e instanceof Error ? e.message : "Ошибка входа",
              });
            }
          })}
        >
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            {...form.register("email")}
            error={form.formState.errors.email?.message}
          />
          <PasswordInput
            label="Пароль"
            autoComplete="current-password"
            {...form.register("password")}
            error={form.formState.errors.password?.message}
          />

          <button
            type="button"
            className={styles.link}
            onClick={async () => {
              const email = form.getValues("email");
              if (!email) {
                form.setError("email", { message: "Введите email" });
                return;
              }
              try {
                await resetPassword(email);
                form.setError("root", {
                  type: "success",
                  message: "Письмо отправлено на email",
                });
              } catch (e) {
                form.setError("root", {
                  message:
                    e instanceof Error
                      ? e.message
                      : "Не удалось отправить письмо",
                });
              }
            }}
          >
            Забыли пароль?
          </button>

          {(form.formState.errors.root?.message || signIn.errorMsg) && (
            <div className={styles.error}>
              {form.formState.errors.root?.message || signIn.errorMsg}
            </div>
          )}

          <button
            className={styles.submit}
            type="submit"
            disabled={signIn.isPending}
          >
            {signIn.isPending ? "Входим…" : "Войти"}
          </button>
          <button
            type="button"
            className={styles.oauth}
            onClick={async () => {
              try {
                await signInG.mutateAsync();
              } catch (e) {
                form.setError("root", {
                  message:
                    e instanceof Error ? e.message : "Ошибка Google входа",
                });
              }
            }}
            disabled={signInG.isPending}
          >
            {signInG.isPending ? "Google…" : "Войти через Google"}
          </button>

          <div className={styles.back}>
            <Link to="/">На главную</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
