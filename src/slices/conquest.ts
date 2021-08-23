import {
  createAction,
  createEntityAdapter,
  createSlice,
  EntityState,
  nanoid,
  PayloadAction,
  Update,
} from '@reduxjs/toolkit';
import type { Config, Planet, Player } from '../types';
import generateSector, { getAddressKey } from './generateSector';

const playerAdapter = createEntityAdapter<Player>({
  selectId: (player) => player.id,
});
const playerSelectors = playerAdapter.getSelectors<StateShape>(
  (state) => state.config.players,
);

const planetAdapter = createEntityAdapter<Planet>({
  selectId: (planet) => getAddressKey(planet.address),
});
const planetSelectors = planetAdapter.getSelectors<StateShape>(
  (state) => state.sector,
);

type StateShape = {
  mode: 'setup' | 'playing' | 'game over';
  config: Config;
  sector: EntityState<Planet>;
  activePlanet?: string;
};

const _generateSector = (state: StateShape): StateShape => {
  if (state.mode === 'setup') {
    const planets = generateSector(
      state.config.numPlanets,
      state.config.sectorSize,
      playerSelectors.selectIds(state),
    );

    state.sector = planetAdapter.setAll(
      planetAdapter.getInitialState(),
      planets,
    );
  }
  return state;
};
const initialState: StateShape = _generateSector({
  mode: 'setup',
  config: {
    numPlanets: 25,
    sectorSize: 20,
    players: playerAdapter.getInitialState(),
  },
  sector: planetAdapter.getInitialState(),
  activePlanet: undefined,
});

export const regenerateSector = createAction('regenerateSector');
export const addPlayer = createAction(
  'addPlayer',
  (player: Pick<Player, 'name' | 'color'>) => {
    const payload: Player = {
      ...player,
      id: nanoid(),
      ready: false,
    };

    return {
      payload,
    };
  },
);

export const setNumPlanets = createAction<number>('setNumPlanets');
export const setSectorSize = createAction<number>('setSectorSize');
export const removePlayer = createAction<Player['id']>('removePlayer');
export const setupSlice = createSlice({
  name: 'setup',
  initialState,
  reducers: {
    activatePlanet(state, action: PayloadAction<string | undefined>) {
      state.activePlanet = action.payload
    },
    updatePlayer(state, action: PayloadAction<Update<Player>>) {
      if (state.mode === 'setup') {
        playerAdapter.updateOne(state.config.players, action.payload);
      }
    },
    ready(state, action: PayloadAction<Player['id']>) {
      if (state.mode === 'setup') {
        const update: Update<Player> = {
          id: action.payload,
          changes: { ready: true },
        };
        playerAdapter.updateOne(state.config.players, update);

        const allReady = playerSelectors
          .selectAll(state)
          .every((player) => player.ready);
        if (allReady) {
          state.mode = 'playing';
        }
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(regenerateSector, (state) => {
      _generateSector(state);
    });
    builder.addCase(addPlayer, (state, action) => {
      if (state.mode === 'setup') {
        playerAdapter.addOne(state.config.players, action.payload);
        _generateSector(state);
      }
    });
    builder.addCase(removePlayer, (state, action) => {
      if (state.mode === 'setup') {
        playerAdapter.removeOne(state.config.players, action.payload);
        _generateSector(state);
      }
    });
    builder.addCase(setSectorSize, (state, action) => {
      if (state.mode === 'setup') {
        state.config.sectorSize = action.payload;
        _generateSector(state);
      }
    });
    builder.addCase(setNumPlanets, (state, action) => {
      if (state.mode === 'setup') {
        state.config.numPlanets = action.payload;
        _generateSector(state);
      }
    });
  },
});

export const { ready, updatePlayer, activatePlanet } = setupSlice.actions;

export const selectConfig = (state: StateShape): Config => state.config;

export const selectActivePlanet = (state: StateShape): string | undefined => state.activePlanet

export const selectAllPlayers = playerSelectors.selectAll;

export const selectPlanetEntities = planetSelectors.selectEntities;
export const selectPlanets = planetSelectors.selectAll;

export const selectPlayer = playerSelectors.selectById;

export default setupSlice.reducer;
