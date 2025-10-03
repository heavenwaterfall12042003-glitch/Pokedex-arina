import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  doc,
  updateDoc,
  type DocumentReference,
  type Firestore,
  type UpdateData,
} from "firebase/firestore";
import { db } from "../services/firebase";

// Допускаем пути только вида ['col', 'id'], ['col', 'id', 'sub', 'subId'], ['c','id','s','sid','s2','s2id']
type DocPath =
  | readonly [string, string]
  | readonly [string, string, string, string]
  | readonly [string, string, string, string, string, string];

function toRef<T>(firestore: Firestore, path: DocPath): DocumentReference<T> {
  // Вариативная перегрузка doc(...) требует точных кортежей; раскладываем вручную
  switch (path.length) {
    case 2: {
      const [c1, d1] = path;
      return doc(firestore, c1, d1) as DocumentReference<T>;
    }
    case 4: {
      const [c1, d1, c2, d2] = path;
      return doc(firestore, c1, d1, c2, d2) as DocumentReference<T>;
    }
    case 6: {
      const [c1, d1, c2, d2, c3, d3] = path;
      return doc(firestore, c1, d1, c2, d2, c3, d3) as DocumentReference<T>;
    }
    default:
      throw new Error("Unsupported DocPath length");
  }
}

type QueryKey = readonly unknown[];

export function useUpdateDocument<T>(
  path: DocPath,
  invalidate: QueryKey[] = []
) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateData<unknown> & Partial<T>) => {
      const ref = toRef<T>(db as Firestore, path);
      await updateDoc(
        ref as DocumentReference<unknown>,
        data as UpdateData<unknown>
      );
    },
    onSuccess: async () => {
      await Promise.all(
        invalidate.map((key) => qc.invalidateQueries({ queryKey: key }))
      );
    },
  });
}
