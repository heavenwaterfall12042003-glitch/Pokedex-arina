import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  type DocumentReference,
  type WithFieldValue,
  type UpdateData,
} from "firebase/firestore";

export type UserProfileDoc = {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  email: string | null;
  updatedAt: number;
};

export type TeamEntry = { id: number; name: string; addedAt: number };
export type UserTeamDoc = { uid: string; list: TeamEntry[]; updatedAt: number };

function userRef(uid: string): DocumentReference<UserProfileDoc> {
  return doc(db, "users", uid) as DocumentReference<UserProfileDoc>;
}
function teamRef(uid: string): DocumentReference<UserTeamDoc> {
  return doc(db, "teams", uid) as DocumentReference<UserTeamDoc>;
}

export async function getUserProfile(
  uid: string
): Promise<UserProfileDoc | null> {
  const ref = userRef(uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function saveUserProfile(
  uid: string,
  data: Partial<UserProfileDoc>
): Promise<void> {
  const ref = userRef(uid);
  const now = Date.now();
  const cur = await getDoc(ref);

  if (cur.exists()) {
    const payload: UpdateData<UserProfileDoc> = { ...data, updatedAt: now };
    await updateDoc(ref, payload);
  } else {
    const base: UserProfileDoc = {
      uid,
      email: null,
      displayName: null,
      photoURL: null,
      updatedAt: now,
    };
    const payload: WithFieldValue<UserProfileDoc> = { ...base, ...data };
    await setDoc(ref, payload);
  }
}

export async function getUserTeam(uid: string): Promise<UserTeamDoc | null> {
  const ref = teamRef(uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function addToTeam(uid: string, entry: TeamEntry): Promise<void> {
  const ref = teamRef(uid);
  const now = Date.now();
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const payload: WithFieldValue<UserTeamDoc> = {
      uid,
      list: [entry],
      updatedAt: now,
    };
    await setDoc(ref, payload);
  } else {
    const data = snap.data();
    if (data.list.length >= 6) throw new Error("Команда заполнена");
    if (data.list.some((x) => x.id === entry.id))
      throw new Error("Уже в команде");
    const payload: UpdateData<UserTeamDoc> = {
      list: arrayUnion(entry),
      updatedAt: now,
    };
    await updateDoc(ref, payload);
  }
}

export async function removeFromTeam(
  uid: string,
  entry: TeamEntry
): Promise<void> {
  const ref = teamRef(uid);
  const now = Date.now();
  const payload: UpdateData<UserTeamDoc> = {
    list: arrayRemove(entry),
    updatedAt: now,
  };
  await updateDoc(ref, payload);
}

export async function createUserIfMissing(
  uid: string,
  seed?: Partial<UserProfileDoc>
): Promise<void> {
  const ref = userRef(uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const now = Date.now();
    const base: WithFieldValue<UserProfileDoc> = {
      uid,
      email: seed?.email ?? null,
      displayName: seed?.displayName ?? null,
      photoURL: seed?.photoURL ?? null,
      updatedAt: now,
    };
    await setDoc(ref, base);
  }
}
