import type { EntityId, EntityState } from '@reduxjs/toolkit';

type Address = { x: number, y: number }

export type Config = {
  players: EntityState<Player>;
  numPlanets: number;
  sectorSize: number;
};

export type Flight = {
  leaveOnTurn: number;
  ships: number;
  from: Address,
  to: Address,
};

export type GameState = {
  sector: Array<Planet>;
  turnNumber: number;
  players: Array<Player>;
  playersTurn: number;
  schedules: Array<Schedule>;
};

export type Player = {
  id: EntityId;
  name: string;
  color: string;
  ready: boolean;
};

export type Schedule = {
  flight: Flight;
  startOnTurn: number;
  everyNTurns: number;
  player: Player['id'];
};

export type Planet = {
  name: string;
  owner: Player['id'] | null;
  planetIcon: number,
  shipsPerRound: number;
  population: number;
  combatModifier: number;
  address: Address;
};
