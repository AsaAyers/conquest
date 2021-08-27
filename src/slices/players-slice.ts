import { createAction, createSlice, nanoid } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Player } from "../types";
import { playerAdapter } from "./adapters";

const playerSelectors = playerAdapter.getSelectors<RootState>(
  state => state.players
);

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

const playersSlice = createSlice({
  name: 'players',
  initialState: playerAdapter.getInitialState(),
  reducers: {
    updatePlayer: playerAdapter.updateOne,
    removePlayer: playerAdapter.removeOne
  },
  extraReducers(builder) {
    builder.addCase(addPlayer, (state, action) => {
      console.log('addPlayer?', action)
      playerAdapter.addOne(state, action.payload);
    });
  }

})

export const { updatePlayer, removePlayer } = playersSlice.actions

export const selectAllPlayers = playerSelectors.selectAll
export const selectPlayer = playerSelectors.selectById
export const selectPlayerIds = playerSelectors.selectIds

export default playersSlice.reducer
