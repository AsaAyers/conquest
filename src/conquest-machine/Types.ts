import type { Interpreter } from 'xstate';

export type Planet = {
  id: string;
  address: { x: number; y: number };
  owner: null | number;
  planet: number;
  population: number;
  shipsPerRound: number;
};

export type GameContext = {
  planets: Record<string, Planet>;
  galaxySize: number;
  numPlanets: number;
  players: Array<string>;
  draftPlayer: {
    position?: number;
    name: string;
  };
};

export type GameInterpreter = Interpreter<
  GameContext,
  any,
  GameEvent,
  {
    value: any;
    context: GameContext;
  }
>;
type Player = string;

export type GameEvent =
  | { type: 'SHIPS_ARRIVED'; numShips: number; owner: number }
  | { type: 'SEND_SHIPS'; numShips: number }
  | { type: 'BUILD'; owner: Player }
  | { type: 'GALAXY_SIZE'; value: number }
  | { type: 'NUM_PLANETS'; numPlanets: number }
  | { type: 'REMOVE_PLAYER'; position: number }
  | { type: 'EDIT_PLAYER'; position: number }
  | { type: 'COMMIT_PLAYER' }
  | { type: 'UPDATE_DRAFT'; name: string };
