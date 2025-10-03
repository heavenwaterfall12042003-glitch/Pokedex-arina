import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebase";
import type { AuthError } from "firebase/auth";
import { mapAuthError } from "./authErrors";

export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (e: unknown) {
    throw new Error(mapAuthError(e as AuthError));
  }
}
