import styles from "./UserCard.module.scss";

type Props = {
  uid: string;
  email: string;
  displayName: string;
  onCopyUid?: () => void;
};

export default function UserCard({
  uid,
  email,
  displayName,
  onCopyUid,
}: Props) {
  const shortUid =
    uid.length > 16 ? uid.slice(0, 8) + "…" + uid.slice(-4) : uid;

  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <div className={styles.k}>UID</div>
        <div
          className={styles.v}
          style={{ display: "flex", gap: 8, alignItems: "center" }}
        >
          <span>{shortUid}</span>
          <button
            className={styles.copy}
            onClick={onCopyUid}
            aria-label="Copy UID"
          >
            Копировать
          </button>
        </div>

        <div className={styles.k}>Email</div>
        <div>{email}</div>

        <div className={styles.k}>Имя</div>
        <div>{displayName || "—"}</div>
      </div>
    </div>
  );
}
