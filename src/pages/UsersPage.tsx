import { useQuery } from "@tanstack/react-query";
import styles from "./UsersPage.module.scss";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";

type UserRow = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
};
type TeamRow = {
  uid: string;
  list: { id: number; name: string; addedAt: number }[];
};

async function fetchUsers(): Promise<UserRow[]> {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => d.data() as UserRow);
}

async function fetchTeams(): Promise<Record<string, TeamRow["list"]>> {
  const snap = await getDocs(collection(db, "teams"));
  const out: Record<string, TeamRow["list"]> = {};
  snap.forEach((d) => {
    out[d.id] = (d.data() as TeamRow).list ?? [];
  });
  return out;
}

export default function UsersPage() {
  const { data: users } = useQuery({
    queryKey: ["users-list"],
    queryFn: fetchUsers,
    staleTime: 60000,
  });
  const { data: teams } = useQuery({
    queryKey: ["users-teams"],
    queryFn: fetchTeams,
    staleTime: 60000,
  });

  return (
    <div className={styles.root}>
      <h2 style={{ margin: 0 }}>Пользователи</h2>
      <div className={styles.grid}>
        {(users ?? []).map((u) => (
          <div key={u.uid} className={styles.card}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <img
                src={u.photoURL || "https://placehold.co/48x48"}
                width={48}
                height={48}
                style={{ borderRadius: "50%" }}
              />
              <div>
                <div className={styles.name}>
                  {u.displayName || "Без имени"}
                </div>
                <div className={styles.sub}>{u.email || "—"}</div>
              </div>
            </div>
            <div className={styles.team}>
              {(teams?.[u.uid] ?? []).slice(0, 6).map((p) => (
                <div key={p.id} className={styles.sub}>
                  • {p.name}
                </div>
              ))}
              {(teams?.[u.uid]?.length ?? 0) === 0 && (
                <div className={styles.sub}>Команда пуста</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
