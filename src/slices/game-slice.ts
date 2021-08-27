import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Flight, GameState, Player } from "../types";

type SetupMode = {
  mode: 'setup'
}

type PlayingMode = {
  mode: 'playing'
  draftFlight: Partial<Flight>
} & GameState

type GameOver = {
  mode: 'game over',
  winner: Player['id']
} & GameState


type SliceState = SetupMode | PlayingMode | GameOver 

const initialState= {
  mode: 'setup'
  // mode: 'setup' | 'playing' | 'game over',
  // turnNumber: 0,
  // playersTurn: 0,
  // players: playerAdapter.getInitialState(),
  // sector: planetAdapter.getInitialState(),
  // schedules: []
} as SliceState

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame(state) {
      if (state.mode === 'setup') {
        const nextState: PlayingMode = {
          mode: 'playing',
          turnNumber: 0,
          playersTurn: 0,
          schedules: [],
          draftFlight: {}
        }
        return nextState
      }
    }

  }
})


export const { startGame } = gameSlice.actions

export const selectMode = (state: RootState): SliceState['mode'] => state.game.mode
export const selectTurnInfo = (state: RootState): Pick<PlayingMode, 'turnNumber' | 'playersTurn'> => {
  if (state.game.mode === 'playing') {
    return {
      playersTurn: state.game.playersTurn,
      turnNumber: state.game.turnNumber
    }
  }
  return { playersTurn: 0, turnNumber: 0}
}

export default gameSlice.reducer