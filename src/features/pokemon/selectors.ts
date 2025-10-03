import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

const selectPokemonState = (s: RootState) => s.pokemon;

export const selectItems = createSelector([selectPokemonState], (p) => p.items);
export const selectNext = createSelector([selectPokemonState], (p) => p.next);
export const selectStatus = createSelector(
  [selectPokemonState],
  (p) => p.status
);
export const selectError = createSelector([selectPokemonState], (p) => p.error);
export const selectTeam = createSelector([selectPokemonState], (p) => p.team);

export const selectTeamCount = createSelector(
  [selectTeam],
  (team) => team.length
);

export const makeSelectInTeamByName = (name: string) =>
  createSelector([selectTeam], (team) => team.includes(name));
