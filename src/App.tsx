import classNames from 'classnames';
import React from 'react';
import styles from './app.module.css';
import { Board } from './components/board';
import { Setup } from './components/setup';
import { ConquestMachine } from './conquest-machine';

type Tabs = 'setup' | 'preview'

function App(): JSX.Element {
  const [tab, setTab] = React.useState<Tabs>('setup')

  return (
    <div className={styles.app}>
      <button
        className={classNames(styles.setupTab, {
          [styles.active]: tab === 'setup'
        })}
        onClick={() => setTab('setup')}
      >
        Setup
      </button>
      <button
        className={classNames(styles.sectorTab, {
          [styles.active]: tab === 'preview'
        })}
        onClick={() => setTab('preview')}
      >
        Sector Preview
      </button>

      <div className={styles.content}>
        {tab === 'setup' ? (
          <Setup />
        ) : (tab === 'preview') ? (
          <Board className={styles.board}
          />
        ) : null}
      </div>

      {/* {state.matches('setup') && <Setup />}
      <div className={styles.boardContainer}>
        <Board
          className={styles.board}
          planets={state.context.planets}
        />
      </div> */}
    </div>
  );
}

export default function GameSetup(): JSX.Element {
  return (
    <ConquestMachine>
      <App />
    </ConquestMachine>
  )
}