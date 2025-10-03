import { useEffect, useState } from "react";
import { useAppDispatch } from "./hooks/redux";
import { hydrateFromStorage } from "./features/pokemon/pokemonSlice";
import NavBar from "./shared/NavBar";
import AppRoutes from "./app/routes";
import {
  applyTheme,
  getStoredTheme,
  setStoredTheme,
  type ThemeMode,
} from "./app/localStorage";
import NetworkBanner from "./shared/NetworkBanner";
import ScrollTopButton from "./shared/ScrollTopButton";
import ErrorBoundary from "./shared/ErrorBoundary";
import useAuthListener from "./hooks/useAuthListener";
import ToastProvider from "./shared/Toast";

export default function App() {
  const dispatch = useAppDispatch();
  useAuthListener();

  const initialTheme: ThemeMode = getStoredTheme() ?? "system";
  const [theme, setTheme] = useState<ThemeMode>(initialTheme);

  useEffect(() => {
    dispatch(hydrateFromStorage());
  }, [dispatch]);

  useEffect(() => {
    applyTheme(theme);
    setStoredTheme(theme);
  }, [theme]);

  return (
    <ToastProvider>
      <NavBar theme={theme} onChangeTheme={(t: ThemeMode) => setTheme(t)} />
      <NetworkBanner />
      <ScrollTopButton />
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </ToastProvider>
  );
}
