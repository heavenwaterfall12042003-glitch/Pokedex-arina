import { useState } from "react";
import uploadToImgbb from "../services/imgbb";
import styles from "./UploadTest.module.scss";

export default function UploadTest() {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setLoading(true);
    try {
      const uploadedUrl = await uploadToImgbb(e.target.files[0]);
      setUrl(uploadedUrl);
    } catch (err) {
      alert("Не удалось загрузить изображение");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Test Upload</h2>
      <input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className={styles.inputFile}
      />
      {loading && <p className={styles.loading}>Загрузка…</p>}
      {url && (
        <div className={styles.preview}>
          <p>Готово</p>
          <img src={url} alt="Uploaded" />
          <a href={url} target="_blank" rel="noreferrer">
            {url}
          </a>
        </div>
      )}
    </div>
  );
}
