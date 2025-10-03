import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserProfile,
  saveUserProfile,
  type UserProfileDoc,
} from "../services/firestore";

export function useUserProfile(uid: string | null) {
  return useQuery({
    queryKey: ["userProfile", uid],
    queryFn: () => {
      if (!uid) throw new Error("no uid");
      return getUserProfile(uid);
    },
    enabled: !!uid,
    staleTime: 300000,
  });
}

export function useSaveUserProfile(uid: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<UserProfileDoc>) => {
      if (!uid) throw new Error("no uid");
      return saveUserProfile(uid, data);
    },
    onSuccess: async () => {
      if (uid) await qc.invalidateQueries({ queryKey: ["userProfile", uid] });
    },
  });
}
