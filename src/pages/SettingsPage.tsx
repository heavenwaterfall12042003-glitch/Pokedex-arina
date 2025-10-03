import { useRef, useState } from "react";
import { useAppSelector } from "../hooks/redux";
import styles from "./SettingsPage.module.scss";
import uploadToImgbb from "../services/imgbb";
import { useUserProfile, useSaveUserProfile } from "../hooks/profileQueries";

export default function SettingsPage() {
  const user = useAppSelector((s) => s.auth.user);
  const uid = user?.uid ?? null;

  const { data: profile } = useUserProfile(uid);
  const save = useSaveUserProfile(uid);

  const [displayName, setDisplayName] = useState(
    profile?.displayName ?? user?.displayName ?? ""
  );
  const fileRef = useRef<HTMLInputElement>(null);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <h2 style={{ margin: 0 }}>Настройки профиля</h2>

        <div className={styles.row} style={{ marginTop: 12 }}>
          <label>Имя</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              className={styles.input}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <button
              className={styles.btn}
              onClick={async () => {
                setErr(null);
                setOk(null);
                try {
                  await save.mutateAsync({ displayName });
                  setOk("Сохранено");
                } catch (e) {
                  setErr(e instanceof Error ? e.message : "Ошибка сохранения");
                }
              }}
            >
              Сохранить
            </button>
          </div>
        </div>

        <div className={styles.row}>
          <label>Аватар</label>
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setErr(null);
                setOk(null);
                try {
                  const url = await uploadToImgbb(f);
                  await save.mutateAsync({ photoURL: url });
                  setOk("Фото обновлено");
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
              Загрузить файл
            </button>
            <div className={styles.note}>
              Файл загружается в imgbb, а URL сохраняется в Firestore.
            </div>
          </div>
        </div>

        {err ? <div className={styles.err}>{err}</div> : null}
        {ok ? <div style={{ color: "#059669", fontSize: 14 }}>{ok}</div> : null}
      </div>
    </div>
  );
}
