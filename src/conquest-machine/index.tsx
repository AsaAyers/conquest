/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import type { GameEvent, GameInterpreter, Planet, SetupContext } from './Types';
import { inspect } from '@xstate/inspect';
import { sectorMachine } from './sectorMachine';
import { useMachine, useService } from '@xstate/react';
import type { PayloadSender, State } from 'xstate';

inspect({
  // options
  // url: 'https://statecharts.io/inspect', // (default)
  iframe: false, // open in new window
});

const conquestContext = React.createContext<null | GameInterpreter>(null)

export type GameState = State<SetupContext, GameEvent, any, {
  value: any;
  context: SetupContext;
}>
export function useConquest(): [
  GameState, PayloadSender<GameEvent>
] {
  const foo = React.useContext(conquestContext)

  if (foo == null) {
    throw new Error()
  }

  return useService(foo)
}


export const NUM_PLANET_ICONS = 18;
const STORAGE_KEY = 'conquest';

export function getAddressKey(address: Planet['address']): string {
  return `${address.x},${address.y}`;
}

type Props = {
  children: JSX.Element
}
export function ConquestMachine({ children }: Props): JSX.Element {

  const persistedState = React.useMemo(() => {
    try {
      // @ts-expect-error localStorage might return undefined, which can't be sent to JSON.parse
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      return {
        state: sectorMachine.initialState,
      };
    }
  }, []);
  const [state, , service] = useMachine(sectorMachine, {
    ...persistedState,
    devTools: import.meta.env.NODE_ENV === 'develop',
  });
  React.useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        state: state,
      }),
    );
  }, [state]);

  return (
    <conquestContext.Provider value={service}>
      {children}
    </conquestContext.Provider>
  )
}