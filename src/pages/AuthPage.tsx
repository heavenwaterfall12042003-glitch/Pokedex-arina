import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Input from "../shared/forms/Input";
import PasswordInput from "../shared/forms/PasswordInput";
import styles from "./AuthPage.module.scss";
import {
  useSignInEmail,
  useSignUpEmail,
  useSignInGoogle,
} from "../hooks/authMutations";
import { resetPassword } from "../services/password";

const loginSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
});
type LoginValues = z.infer<typeof loginSchema>;

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

type NavState = { from?: string | null } | null;

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const navigate = useNavigate();
  const location = useLocation();
  const intended =
    (location.state as NavState)?.from ||
    sessionStorage.getItem("intendedRoute") ||
    "/";

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirm: "" },
  });

  const onSuccess = () => navigate(intended);

  const signIn = useSignInEmail(onSuccess);
  const signUp = useSignUpEmail(onSuccess);
  const signInG = useSignInGoogle(onSuccess);

  const onLogin = async (v: LoginValues) => {
    try {
      await signIn.mutateAsync({ email: v.email, password: v.password });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Ошибка входа";
      loginForm.setError("root", { message: msg });
    }
  };

  const onRegister = async (v: RegisterValues) => {
    try {
      await signUp.mutateAsync({ email: v.email, password: v.password });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Ошибка регистрации";
      registerForm.setError("root", { message: msg });
    }
  };

  const submitLogin = loginForm.handleSubmit(onLogin);
  const submitRegister = registerForm.handleSubmit(onRegister);

  return (
    <div className={styles.wrap}>
      <div className={styles.card} role="dialog" aria-labelledby="auth-title">
        <div className={styles.header}>
          <h2 id="auth-title" className={styles.title}>
            {mode === "login" ? "Вход" : "Регистрация"}
          </h2>
          <button
            className={styles.switch}
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              loginForm.clearErrors();
              registerForm.clearErrors();
              signIn.reset();
              signUp.reset();
              signInG.reset();
            }}
          >
            {mode === "login" ? "Регистрация" : "Вход"}
          </button>
        </div>

        <div className={styles.hero} />

        {mode === "login" ? (
          <form
            className={styles.form}
            onSubmit={submitLogin}
            aria-busy={signIn.isPending}
          >
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              {...loginForm.register("email")}
              error={loginForm.formState.errors.email?.message}
            />
            <PasswordInput
              label="Пароль"
              autoComplete="current-password"
              {...loginForm.register("password")}
              error={loginForm.formState.errors.password?.message}
            />

            <button
              type="button"
              className={styles.link}
              onClick={async () => {
                const email = loginForm.getValues("email");
                if (!email) {
                  loginForm.setError("email", { message: "Введите email" });
                  return;
                }
                try {
                  await resetPassword(email);
                  loginForm.setError("root", {
                    type: "success",
                    message: "Письмо отправлено на email",
                  });
                } catch (e) {
                  const msg =
                    e instanceof Error
                      ? e.message
                      : "Не удалось отправить письмо";
                  loginForm.setError("root", { message: msg });
                }
              }}
            >
              Забыли пароль?
            </button>

            {(loginForm.formState.errors.root?.message || signIn.errorMsg) && (
              <div className={styles.error}>
                {loginForm.formState.errors.root?.message || signIn.errorMsg}
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
                  const msg =
                    e instanceof Error ? e.message : "Ошибка Google входа";
                  loginForm.setError("root", { message: msg });
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
        ) : (
          <form
            className={styles.form}
            onSubmit={submitRegister}
            aria-busy={signUp.isPending}
          >
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              {...registerForm.register("email")}
              error={registerForm.formState.errors.email?.message}
            />
            <PasswordInput
              label="Пароль"
              autoComplete="new-password"
              {...registerForm.register("password")}
              error={registerForm.formState.errors.password?.message}
            />
            <PasswordInput
              label="Повторите пароль"
              autoComplete="new-password"
              {...registerForm.register("confirm")}
              error={registerForm.formState.errors.confirm?.message}
            />

            {(registerForm.formState.errors.root?.message ||
              signUp.errorMsg) && (
              <div className={styles.error}>
                {registerForm.formState.errors.root?.message || signUp.errorMsg}
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
        )}
      </div>
    </div>
  );
}
