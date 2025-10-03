import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Spinner from "../shared/Spinner";
import ProtectedRoute from "../shared/ProtectedRoute";
import AuthGuard from "../shared/AuthGuard";

const HomePage = lazy(() => import("../pages/HomePage"));
const TeamPage = lazy(() => import("../pages/TeamPage"));
const PokedexPage = lazy(() => import("../pages/PokedexPage"));
const PokemonPage = lazy(() => import("../pages/PokemonPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));
const UsersPage = lazy(() => import("../pages/UsersPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const AuthLoginPage = lazy(() => import("../pages/auth/AuthLoginPage"));
const AuthRegisterPage = lazy(() => import("../pages/auth/AuthRegisterPage"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        {/* public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/pokedex" element={<PokedexPage />} />
        <Route path="/pokemon/:name" element={<PokemonPage />} />

        {/* protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/team" element={<TeamPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Route>

        {/* auth */}
        <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
        <Route element={<AuthGuard />}>
          <Route path="/auth/login" element={<AuthLoginPage />} />
          <Route path="/auth/register" element={<AuthRegisterPage />} />
        </Route>

        {/* 404 */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}
