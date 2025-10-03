import { configureStore } from "@reduxjs/toolkit";
import pokemonReducer from "../features/pokemon/pokemonSlice";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pokemon: pokemonReducer,
  },
});

store.subscribe(() => {
  const { team, customAvatars } = store.getState().pokemon;
  localStorage.setItem("team", JSON.stringify(team));
  localStorage.setItem("customAvatars", JSON.stringify(customAvatars));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
