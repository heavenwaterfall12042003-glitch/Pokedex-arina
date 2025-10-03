import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.scss";

export default function NotFoundPage() {
  return (
    <div className={styles.container}>
      <h1>Страница не найдена</h1>
      <p>Похоже, такого маршрута нет.</p>
      <Link to="/" className={styles.button}>
        На главную
      </Link>
    </div>
  );
}
