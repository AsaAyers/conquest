import {
  createAction,
  createSlice,
  current,
  isAnyOf,
  PayloadAction,
} from '@reduxjs/toolkit';
import type { Config, Planet } from '../types';
import { planetAdapter } from './adapters';
import generateSector, { getAddressKey } from './generateSector';
import playerReducer, { addPlayer, removePlayer } from './players-slice';
import sectorReducer, { selectPlanet } from './sector-slice';
import gameReducer from './game-slice';

const planetSelectors = planetAdapter.getSelectors<RootSliceShape>(
  (state) => state.sector,
);

export type RootSliceShape = {
  numPlanets: number;
  sectorSize: number;
  sector: ReturnType<typeof sectorReducer>;
  // players: EntityState<Player>;
  players: ReturnType<typeof playerReducer>;
  activePlanet?: Planet['address'];
  game: ReturnType<typeof gameReducer>;
};

const _generateSector = (state: RootSliceShape): RootSliceShape => {
  const planets = generateSector(
    state.numPlanets,
    state.sectorSize,
    state.players.ids,
  );

  state.sector = planetAdapter.setAll(planetAdapter.getInitialState(), planets);
  return state;
};
const initialState: RootSliceShape = _generateSector({
  numPlanets: 25,
  sectorSize: 20,
  players: playerReducer(undefined, { type: '' }),
  sector: planetAdapter.getInitialState(),
  activePlanet: undefined,
  game: gameReducer(undefined, { type: '' }),
});

export const regenerateSector = createAction('regenerateSector');

export const setNumPlanets = createAction<number>('setNumPlanets');
export const setSectorSize = createAction<number>('setSectorSize');
export const setupSlice = createSlice({
  name: 'setup',
  initialState,
  reducers: {
    activatePlanet(state, action: PayloadAction<Planet | undefined>) {
      state.activePlanet = action.payload?.address;
    },
  },
  extraReducers(builder) {
    builder.addCase(setSectorSize, (state, action) => {
      state.sectorSize = action.payload;
    });
    builder.addCase(setNumPlanets, (state, action) => {
      state.numPlanets = action.payload;
    });


    builder.addMatcher(
      () => true,
      (state, action) => {
        state.sector = sectorReducer(state.sector, action);
        state.game = gameReducer(state.game, action);
        state.players = playerReducer(state.players, action);
      },
    );


    builder.addMatcher(
      isAnyOf(
        regenerateSector,
        addPlayer,
        removePlayer,
        setSectorSize,
        setNumPlanets,
      ),
      (state) => {
        _generateSector(state);
      },
    );
  },
});

export const { activatePlanet } = setupSlice.actions;

export const selectConfig = (state: RootSliceShape): Config => state;
export const selectActivePlanet = (state: RootSliceShape): Planet | undefined =>
  !state.activePlanet ? undefined : selectPlanet(state, getAddressKey(state.activePlanet)) 
export const selectPlanetEntities = planetSelectors.selectEntities;
export const selectAllPlanets = planetSelectors.selectAll;

export default setupSlice.reducer;
