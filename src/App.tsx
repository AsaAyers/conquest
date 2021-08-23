import React from 'react';
import { useSelector } from 'react-redux';
import styles from './app.module.css';
import { Setup } from './components/setup';

function App(): JSX.Element {
  const mode = useSelector((state) => state.mode)

  if (mode === 'setup') {
    return (
      <div className={styles.app}>
        <Setup />
      </div>
    )
  }
  return (
    <div className={styles.app}>
      Hello World
    </div>
  )
}

export default function GameSetup(): JSX.Element {
  return (
    <App />
  );
}
