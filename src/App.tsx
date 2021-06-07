import React from 'react';
import styles from './app.module.css';
import { Board } from './components/board';
import { useMachine } from '@xstate/react';
import { galaxyMachine } from './conquest-machine';
import { Setup } from './components/setup';
import { inspect } from '@xstate/inspect';

inspect({
  // options
  // url: 'https://statecharts.io/inspect', // (default)
  iframe: false, // open in new window
});

const STORAGE_KEY = 'conquest';

function App(): JSX.Element {
  const persistedState = React.useMemo(() => {
    try {
      // @ts-expect-error localStorage might return undefined, which can't be sent to JSON.parse
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      return {
        state: galaxyMachine.initialState,
      };
    }
  }, []);
  const [state, , service] = useMachine(galaxyMachine, {
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
    <div className={styles.app}>
      {state.matches('setup') && <Setup service={service} />}
      <div className={styles.boardContainer}>
        <Board
          className={styles.board}
          service={service}
          planets={state.context.planets}
        />
      </div>
    </div>
  );
}

export default App;
