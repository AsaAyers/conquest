import classNames from 'classnames'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectTurnInfo } from '../slices/game-slice'
import { selectAllPlayers } from '../slices/players-slice'
import { Board } from './board'
import styles from './game.module.scss'
import NewFlight from './new-flight'

export default function Game(): JSX.Element {
  const players = useSelector(selectAllPlayers)
  const { playersTurn, turnNumber } = useSelector(selectTurnInfo)

  return (
    <div className={styles.game}>
      <span className={styles.turn}>
        Turn {turnNumber}
      </span>
      <ul className={styles.players}>
        {players.map((player, i) => (
          <li key={player.id} className={classNames(styles[`player-${i}`], {
            [styles.activePlayer]: i === playersTurn
          })}>
            {player.name}
          </li>
        ))}
      </ul>
      <Board className={styles.board} />
      <NewFlight className={styles.newFlight} />
    </div>
  )
}
