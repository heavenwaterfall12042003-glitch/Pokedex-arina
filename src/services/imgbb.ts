const API = "https://api.imgbb.com/1/upload";

export default async function uploadToImgbb(file: File): Promise<string> {
  const key = import.meta.env.VITE_IMGBB_KEY as string | undefined;
  if (!key) throw new Error("Отсутствует VITE_IMGBB_KEY");

  const form = new FormData();
  form.append("key", key);
  form.append("image", file);

  const res = await fetch(API, { method: "POST", body: form });
  if (!res.ok) throw new Error("Upload failed");

  const json = await res.json();
  const url = json?.data?.url as string | undefined;
  if (!url) throw new Error("Upload: пустой url");
  return url;
}
