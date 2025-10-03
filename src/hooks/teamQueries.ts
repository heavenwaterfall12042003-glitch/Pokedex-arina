import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserTeam,
  addToTeam,
  removeFromTeam,
  type TeamEntry,
} from "../services/firestore";

export function useUserTeam(uid: string | null) {
  return useQuery({
    queryKey: ["userTeam", uid],
    queryFn: () => {
      if (!uid) throw new Error("no uid");
      return getUserTeam(uid);
    },
    enabled: !!uid,
    staleTime: 60000,
  });
}

export function useAddToTeam(uid: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (entry: TeamEntry) => {
      if (!uid) throw new Error("no uid");
      return addToTeam(uid, entry);
    },
    onSuccess: async () => {
      if (uid) await qc.invalidateQueries({ queryKey: ["userTeam", uid] });
    },
  });
}

export function useRemoveFromTeam(uid: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (entry: TeamEntry) => {
      if (!uid) throw new Error("no uid");
      return removeFromTeam(uid, entry);
    },
    onSuccess: async () => {
      if (uid) await qc.invalidateQueries({ queryKey: ["userTeam", uid] });
    },
  });
}
