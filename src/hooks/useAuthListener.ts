import { useEffect } from "react";
import { subscribeAuth } from "../services/auth";
import { useAppDispatch } from "./redux";
import { setUser } from "../features/auth/authSlice";

export default function useAuthListener() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const unsub = subscribeAuth((u) => dispatch(setUser(u)));
    return unsub;
  }, [dispatch]);
}
