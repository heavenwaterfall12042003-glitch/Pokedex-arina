import { Navigate, Outlet, useSearchParams } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import Splash from "./Splash";

export default function AuthGuard() {
  const { user, initialized } = useAppSelector((s) => s.auth);
  const [sp] = useSearchParams();

  if (!initialized) return <Splash />;

  if (user) {
    const next =
      sp.get("next") || sessionStorage.getItem("intendedRoute") || "/";
    sessionStorage.removeItem("intendedRoute");
    try {
      const url = new URL(next, window.location.origin);
      return <Navigate to={url.pathname + url.search + url.hash} replace />;
    } catch {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}
