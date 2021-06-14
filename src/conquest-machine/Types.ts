/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Interpreter, State } from 'xstate';

export type Planet = {
  id: string;
  address: { x: number; y: number };
  owner: null | number;
  planet: number;
  population: number;
  shipsPerRound: number;
};

export type SetupContext = {
  planets: Record<string, Planet>;
  sectorSize: number;
  numPlanets: number;
  players: Array<string>;
  focus?: number;
  draftPlayer: {
    position?: number;
    name: string;
  };
};

export type GameState = State<SetupContext, GameEvent, any, {
    value: any;
    context: SetupContext;
}>

export type GameInterpreter = Interpreter<
  SetupContext,
  any,
  GameEvent,
  {
    value: any;
    context: SetupContext;
  }
>;
type Player = string;

export type GameEvent =
  | { type: 'SHIPS_ARRIVED'; numShips: number; owner: number }
  | { type: 'SEND_SHIPS'; numShips: number }
  | { type: 'BUILD'; owner: Player }
  | { type: 'sector_SIZE'; value: SetupContext['sectorSize'] }
  | { type: 'NUM_PLANETS'; value: SetupContext['numPlanets'] }
  | { type: 'SET_FOCUS'; value: SetupContext['focus'] }
  | { type: 'REMOVE_PLAYER'; position: number }
  | { type: 'EDIT_PLAYER'; position: number }
  | { type: 'COMMIT_PLAYER' }
  | { type: 'START' }
  | { type: 'UPDATE_DRAFT'; name: string };
