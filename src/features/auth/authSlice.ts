import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserDTO } from "../../types/auth";

type AuthState = {
  user: UserDTO | null;
  loading: boolean;
  initialized: boolean;
};

const initialState: AuthState = {
  user: null,
  loading: true,
  initialized: false,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserDTO | null>) {
      state.user = action.payload;
      state.loading = false;
      state.initialized = true;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setUser, setLoading } = slice.actions;
export default slice.reducer;
