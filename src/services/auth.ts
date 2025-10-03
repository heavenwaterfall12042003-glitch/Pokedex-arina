import { auth, googleProvider } from "./firebase";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  type AuthError,
  type User,
} from "firebase/auth";
import type { UserDTO } from "../types/auth";
import { mapAuthError } from "./authErrors";

function toDTO(u: User | null): UserDTO | null {
  if (!u) return null;
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoURL: u.photoURL,
  };
}

export async function signUpEmail(
  email: string,
  password: string
): Promise<UserDTO> {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    return toDTO(res.user)!;
  } catch (e) {
    throw new Error(mapAuthError(e as AuthError));
  }
}

export async function signInEmail(
  email: string,
  password: string
): Promise<UserDTO> {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return toDTO(res.user)!;
  } catch (e) {
    throw new Error(mapAuthError(e as AuthError));
  }
}

export async function signInGoogle(): Promise<UserDTO> {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    return toDTO(res.user)!;
  } catch (e) {
    throw new Error(mapAuthError(e as AuthError));
  }
}

export async function signOut(): Promise<void> {
  await fbSignOut(auth);
}

export function subscribeAuth(cb: (user: UserDTO | null) => void): () => void {
  return onAuthStateChanged(auth, (u) => cb(toDTO(u)));
}
