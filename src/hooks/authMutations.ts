import { useMutation } from "@tanstack/react-query";
import { signInEmail, signUpEmail, signInGoogle } from "../services/auth";
import type { UserDTO } from "../types/auth";

type SignInVars = { email: string; password: string };
type SignUpVars = { email: string; password: string };

type MutationResult<TVars> = {
  mutate: (vars: TVars) => void;
  mutateAsync: (vars: TVars) => Promise<UserDTO>;
  isPending: boolean;
  errorMsg: string | null;
  reset: () => void;
};

function extractMsg(e: unknown, fallback: string) {
  return e instanceof Error ? e.message : fallback;
}

export function useSignInEmail(
  onSuccess?: (u: UserDTO) => void
): MutationResult<SignInVars> {
  const m = useMutation({
    mutationFn: ({ email, password }: SignInVars) =>
      signInEmail(email, password),
    onSuccess,
  });
  return {
    mutate: m.mutate,
    mutateAsync: m.mutateAsync,
    isPending: m.isPending,
    errorMsg: m.error ? extractMsg(m.error, "Ошибка входа") : null,
    reset: m.reset,
  };
}

export function useSignUpEmail(
  onSuccess?: (u: UserDTO) => void
): MutationResult<SignUpVars> {
  const m = useMutation({
    mutationFn: ({ email, password }: SignUpVars) =>
      signUpEmail(email, password),
    onSuccess,
  });
  return {
    mutate: m.mutate,
    mutateAsync: m.mutateAsync,
    isPending: m.isPending,
    errorMsg: m.error ? extractMsg(m.error, "Ошибка регистрации") : null,
    reset: m.reset,
  };
}

export function useSignInGoogle(onSuccess?: (u: UserDTO) => void) {
  const m = useMutation({
    mutationFn: () => signInGoogle(),
    onSuccess,
  });
  return {
    mutate: m.mutate,
    mutateAsync: m.mutateAsync,
    isPending: m.isPending,
    errorMsg: m.error ? extractMsg(m.error, "Ошибка Google") : null,
    reset: m.reset,
  };
}
