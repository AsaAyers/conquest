import { assign, Machine } from 'xstate';
import type { GameEvent, Planet } from './Types';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createPlanetMachine = (context: Planet) =>
  Machine<Planet, GameEvent>(
    {
      id: 'planet',
      initial: 'unclaimed',
      context,
      on: {
        SHIPS_ARRIVED: [
          { cond: 'foreignShips', actions: 'attack' },
          { cond: 'friendlyShips', actions: 'reinforcements' },
        ],
      },
      states: {
        unclaimed: {
          on: {
            BUILD: undefined,
          },
        },
        idle: {
          on: {
            BUILD: [{ actions: 'produceShips' }],
            SEND_SHIPS: {
              actions: [
                assign({
                  population: (context, event) =>
                    context.population - event.numShips,
                }),
              ],
            },
          },
        },
      },
    },
    {
      guards: {
        isDead: (context) => context.population < 1,
        friendlyShips: (context, event) =>
          event.type === 'SHIPS_ARRIVED' && context.owner === event.owner,
        foreignShips: (context, event) =>
          event.type === 'SHIPS_ARRIVED' && context.owner !== event.owner,
      },
      actions: {
        attack: assign({
          population: (context, event) =>
            event.type === 'SHIPS_ARRIVED' && event.numShips > 0
              ? Math.abs(context.population - event.numShips)
              : context.population,
          owner: (context, event) =>
            event.type === 'SHIPS_ARRIVED' &&
            event.numShips > context.population
              ? event.owner
              : context.owner,
        }),
        reinforcements: assign({
          population: (context, event) =>
            event.type === 'SHIPS_ARRIVED' && event.numShips > 0
              ? context.population + event.numShips
              : context.population,
        }),
        produceShips: assign({
          population: (context) =>
            context.owner != null
              ? context.population + context.shipsPerRound
              : context.population,
        }),
      },
    },
  );
