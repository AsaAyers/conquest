import { Machine } from 'xstate';

type ScreenContext = Record<string, never>;
type ScreenEvent = { type: 'START' } | { type: 'NEW_GAME' };

export const screensMachine = Machine<ScreenContext, ScreenEvent>({
  id: 'screens',
  initial: "setup",
  context: {},
  states: {
    setup: {
      on: {
        START: {
          target: 'playing'
        }
      }
    },
    playing: {
      on: {
        // I'm not sure if this is useful. Maybe if I have this trigger some
        // actions :shrug:
        'NEW_GAME': 'playing'
      }
    },
  }
});
