import React from 'react';
import { useSelector } from 'react-redux';
import styles from './app.module.css';
import Game from './components/game';
import { Setup } from './components/setup';
import { selectMode } from './slices/game-slice';

function App(): JSX.Element {
  const mode = useSelector(selectMode)
  console.log({ mode })

  if (mode === 'setup') {
    return (
      <div className={styles.app}>
        <Setup />
      </div>
    )
  }
  return (
    <div className={styles.app}>
      <Game />
    </div>
  )
}

export default function GameSetup(): JSX.Element {
  return (
    <App />
  );
}
