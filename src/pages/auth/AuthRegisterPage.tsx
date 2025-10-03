import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import Input from "../../shared/forms/Input";
import PasswordInput from "../../shared/forms/PasswordInput";
import styles from "../AuthPage.module.scss";
import { useSignUpEmail } from "../../hooks/authMutations";
import useNextUrl from "../../hooks/useNextUrl";
import AuthSwitcher from "./AuthSwitcher";

const registerSchema = z
  .object({
    email: z.string().email("Некорректный email"),
    password: z.string().min(6, "Минимум 6 символов"),
    confirm: z.string().min(6, "Минимум 6 символов"),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Пароли не совпадают",
    path: ["confirm"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export default function AuthRegisterPage() {
  const next = useNextUrl("/");
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirm: "" },
  });
  const signUp = useSignUpEmail(() => (window.location.href = next));

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Регистрация</h2>
          <AuthSwitcher mode="register" />
        </div>

        <div className={styles.hero} />

        <form
          className={styles.form}
          onSubmit={form.handleSubmit(async (v) => {
            try {
              await signUp.mutateAsync({
                email: v.email,
                password: v.password,
              });
            } catch (e) {
              form.setError("root", {
                message: e instanceof Error ? e.message : "Ошибка регистрации",
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
            autoComplete="new-password"
            {...form.register("password")}
            error={form.formState.errors.password?.message}
          />
          <PasswordInput
            label="Повторите пароль"
            autoComplete="new-password"
            {...form.register("confirm")}
            error={form.formState.errors.confirm?.message}
          />

          {(form.formState.errors.root?.message || signUp.errorMsg) && (
            <div className={styles.error}>
              {form.formState.errors.root?.message || signUp.errorMsg}
            </div>
          )}

          <button
            className={styles.submit}
            type="submit"
            disabled={signUp.isPending}
          >
            {signUp.isPending ? "Создаём…" : "Создать аккаунт"}
          </button>

          <div className={styles.back}>
            <Link to="/">На главную</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
