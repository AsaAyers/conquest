import { assign, Machine, spawn } from 'xstate';
import { createPlanetMachine } from './createPlanetMachine';
import { planetNames } from './planetNames';
import type { GameEvent, SetupContext, Planet } from './Types';
import { NUM_PLANET_ICONS, getAddressKey } from './index';

export const sectorMachine = Machine<SetupContext, GameEvent>(
  {
    id: 'sector',
    initial: 'generate',
    context: {
      sectorSize: 10,
      numPlanets: 10,
      draftPlayer: {
        name: '',
      },
      players: [],
      planets: {},
    },
    states: {
      generate: {
        always: [
          {
            target: 'setup',
            actions: ['generatesector'],
          },
        ],
      },
      setup: {
        on: {
          START: {
            target: 'loading',
          },
          SET_FOCUS: {
            actions: { type: 'setter', key: 'focus' },
          },
          sector_SIZE: {
            target: 'generate',
            actions: [
              { type: 'setter', key: 'sectorSize' }
            ],
            cond: 'validsectorSize',
          },
          NUM_PLANETS: {
            target: 'generate',
            actions: [
              { type: 'setter', key: 'numPlanets' }
            ],
            cond: 'validDensity',
          },
          EDIT_PLAYER: {
            target: 'setup',
            actions: assign({
              draftPlayer: (context, { position }) => {
                return {
                  position,
                  name: context.players[position],
                };
              },
            }),
          },
          REMOVE_PLAYER: {
            actions: [
              assign({
                players: (context, { position }) => {
                  const tmp = [...context.players];
                  tmp.splice(position, 1);
                  return tmp;
                },
              }),
              assign({
                draftPlayer: (context, event) => {
                  if (event.position === context.draftPlayer.position) {
                    return {
                      position: context.players.length,
                      name: '',
                      isNew: true,
                    };
                  }
                  return context.draftPlayer;
                },
              }),
              'generatesector',
            ],
          },
          COMMIT_PLAYER: {
            target: 'setup',
            actions: [
              'commitPlayer',
              {
                cond: 'creatingNewPlayer',
                type: 'generatesector',
              },
              'clearDraft',
            ],
            cond: 'validPlayer',
          },
          UPDATE_DRAFT: {
            target: 'setup',
            actions: assign({
              draftPlayer: (context, event) => {
                return {
                  ...context.draftPlayer,
                  name: event.name,
                };
              },
            }),
          },
        },
      },

      loading: {
        entry: assign({
          planets: (context) => Object.fromEntries(
            Object.entries(context.planets).map(([address, planet]) => [
              address,
              {
                ...planet,
                ref: spawn(createPlanetMachine(planet)),
              },
            ])
          ),
        }),
        always: 'ready',
      },
      ready: {},
    },
  },
  {
    actions: {
      setter: assign((context, event, meta) => {
        if ('value' in event) {
          return {
            [meta.action.key]: event.value
          };
        }
        return {};
      }),
      commitPlayer: assign({
        players: (context) => {
          const tmp = [...context.players];
          const { position = tmp.length, name } = context.draftPlayer;
          tmp[position] = name;
          return tmp;
        },
      }),
      clearDraft: assign({
        draftPlayer: (_context) => {
          return {
            name: '',
          };
        },
      }),

      generatesector: assign({
        planets: (context) => {
          const { numPlanets, sectorSize } = context;

          let nameIndex = 0;
          const planets: Record<string, Planet> = {};

          while (Object.values(planets).length < numPlanets) {
            const planetCandidate: Planet = {
              id: planetNames[nameIndex],
              address: {
                x: Math.floor(Math.random() * sectorSize),
                y: Math.floor(Math.random() * sectorSize),
              },
              planet: 1 + Math.floor(Math.random() * NUM_PLANET_ICONS),
              owner: null,
              population: 100,
              shipsPerRound: 10,
            };
            if (planets[getAddressKey(planetCandidate.address)] == null) {
              planets[getAddressKey(planetCandidate.address)] = planetCandidate;
              nameIndex++;
            }
          }
          const allPlanets = Object.values(planets).sort(
            (a, b) => planetNames.indexOf(a.id) - planetNames.indexOf(b.id)
          );
          context.players.forEach((name, index) => {
            do {
              let home = allPlanets[Math.floor(Math.random() * allPlanets.length)];
              home = allPlanets[index];

              if (home.owner != null) {
                continue;
              }

              home.owner = index;
              return;
              // eslint-disable-next-line no-constant-condition
            } while (true);
          });

          return planets;
        },
      }),
    },
    guards: {
      validDensity: (context, event) => event.type === 'NUM_PLANETS' &&
        event.value >= context.players.length * 2 &&
        event.value <= planetNames.length,
      validsectorSize: (context, event) => event.type === 'sector_SIZE' && event.value >= 10 && event.value <= 40,
      validPlayer: (context, event) => event.type === 'COMMIT_PLAYER' && context.draftPlayer.name.length > 0,
      creatingNewPlayer: (context) => context.draftPlayer.position == null,
    },
  }
);
