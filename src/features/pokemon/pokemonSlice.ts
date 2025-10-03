import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getPokemonList } from "../../utils/api";

type PokemonListItem = { name: string; url: string };
type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
};

export type PokemonState = {
  items: PokemonListItem[];
  next: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string;
  customAvatars: Record<string, string>;
  team: string[];
};

const initialState: PokemonState = {
  items: [],
  next: null,
  status: "idle",
  customAvatars: {},
  team: [],
};

export const fetchPokemons = createAsyncThunk(
  "pokemon/fetchPokemons",
  async (url?: string) => {
    return getPokemonList(url);
  }
);

const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {
    reset(state) {
      state.items = [];
      state.next = null;
      state.status = "idle";
      state.error = undefined;
      state.customAvatars = {};
      state.team = [];
    },
    hydrateFromStorage(state) {
      try {
        const team = JSON.parse(
          localStorage.getItem("team") || "[]"
        ) as string[];
        const customAvatars = JSON.parse(
          localStorage.getItem("customAvatars") || "{}"
        ) as Record<string, string>;
        state.team = Array.isArray(team) ? team : [];
        state.customAvatars =
          customAvatars && typeof customAvatars === "object"
            ? customAvatars
            : {};
      } catch {
        /* noop */
      }
    },
    setCustomAvatar(
      state,
      action: PayloadAction<{ name: string; url: string }>
    ) {
      state.customAvatars[action.payload.name] = action.payload.url;
    },
    addToTeam(state, action: PayloadAction<string>) {
      if (!state.team.includes(action.payload) && state.team.length < 6) {
        state.team.push(action.payload);
      }
    },
    removeFromTeam(state, action: PayloadAction<string>) {
      state.team = state.team.filter((n) => n !== action.payload);
    },
    clearTeam(state) {
      state.team = [];
    },
    reorderTeam(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;
      if (from === to) return;
      if (
        from < 0 ||
        to < 0 ||
        from >= state.team.length ||
        to >= state.team.length
      )
        return;
      const copy = [...state.team];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      state.team = copy;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPokemons.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(
      fetchPokemons.fulfilled,
      (state, action: PayloadAction<PokemonListResponse>) => {
        state.status = "succeeded";
        state.items = [...state.items, ...action.payload.results];
        state.next = action.payload.next;
      }
    );
    builder.addCase(fetchPokemons.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
  },
});

export const {
  reset,
  hydrateFromStorage,
  setCustomAvatar,
  addToTeam,
  removeFromTeam,
  clearTeam,
  reorderTeam,
} = pokemonSlice.actions;

export default pokemonSlice.reducer;
