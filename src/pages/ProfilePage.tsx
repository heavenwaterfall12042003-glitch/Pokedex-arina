import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import styles from "./ProfilePage.module.scss";
import uploadToImgbb from "../services/imgbb";
import { useUserProfile, useSaveUserProfile } from "../hooks/profileQueries";
import { useUserTeam, useRemoveFromTeam } from "../hooks/teamQueries";
import UserCard from "../components/profile/UserCard";
import PokemonShortCard from "../components/pokemon/PokemonShortCard";

export default function ProfilePage() {
  const user = useAppSelector((s) => s.auth.user);
  const uid = user?.uid ?? null;

  const { data: profile } = useUserProfile(uid);
  const saveProfile = useSaveUserProfile(uid);
  const { data: teamDoc } = useUserTeam(uid);
  const removeTeam = useRemoveFromTeam(uid);

  const [name, setName] = useState(
    profile?.displayName ?? user?.displayName ?? ""
  );
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <h2 className={styles.title}>Профиль</h2>
          <Link to="/settings">Перейти в настройки</Link>
        </div>

        <div className={styles.row}>
          <div>
            <img
              className={styles.avatar}
              src={
                profile?.photoURL ||
                user?.photoURL ||
                "https://placehold.co/140x140?text=Avatar"
              }
              alt="avatar"
            />
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setErr(null);
                  try {
                    const url = await uploadToImgbb(f);
                    await saveProfile.mutateAsync({ photoURL: url });
                  } catch (ex) {
                    setErr(
                      ex instanceof Error ? ex.message : "Не удалось загрузить"
                    );
                  } finally {
                    if (fileRef.current) fileRef.current.value = "";
                  }
                }}
              />
              <button
                className={styles.btn}
                onClick={() => fileRef.current?.click()}
              >
                Загрузить фото
              </button>
            </div>
          </div>

          <div>
            <UserCard
              uid={user?.uid ?? "—"}
              email={user?.email ?? "—"}
              displayName={profile?.displayName ?? user?.displayName ?? ""}
              onCopyUid={() => navigator.clipboard.writeText(user?.uid ?? "")}
            />

            <div style={{ marginTop: 12 }}>
              <label className={styles.sub}>Имя</label>
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <input
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <button
                  className={styles.btn}
                  onClick={async () => {
                    setErr(null);
                    try {
                      await saveProfile.mutateAsync({ displayName: name });
                    } catch (e) {
                      setErr(
                        e instanceof Error ? e.message : "Ошибка сохранения"
                      );
                    }
                  }}
                >
                  Сохранить
                </button>
              </div>
              {err ? <div className={styles.err}>{err}</div> : null}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.title}>Моя команда</h3>
        <div className={styles.grid}>
          {(teamDoc?.list ?? []).map((p) => (
            <PokemonShortCard
              key={p.id}
              id={p.id}
              name={p.name}
              onRemove={() =>
                removeTeam.mutate({
                  id: p.id,
                  name: p.name,
                  addedAt: p.addedAt,
                })
              }
            />
          ))}
          {(!teamDoc?.list || teamDoc.list.length === 0) && (
            <div className={styles.sub}>Команда пуста</div>
          )}
        </div>
      </div>
    </div>
  );
}
