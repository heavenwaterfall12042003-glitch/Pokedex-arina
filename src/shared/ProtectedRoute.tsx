import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";
import Splash from "./Splash";

export default function ProtectedRoute() {
  const { user, initialized } = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (!initialized) return <Splash />;

  if (!user) {
    const next = encodeURIComponent(
      location.pathname + location.search + location.hash
    );
    return <Navigate to={`/auth/login?next=${next}`} replace />;
  }

  return <Outlet />;
}
