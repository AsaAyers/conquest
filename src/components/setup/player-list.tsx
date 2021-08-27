import React from 'react';
import styles from '../setup.module.scss';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { activatePlanet } from '../../slices/root-slice';
import { removePlayer } from '../../slices/players-slice';
import type { Player, Planet } from '../../types';

type Props = {
  players: Player[]
  planets: Planet[]
  onSelect: (player: Player, position: number) => void
}
export function PlayerList({ players, planets, onSelect }: Props): JSX.Element {
  const dispatch = useDispatch();

  return (
    <ul id="players" className={styles.playerList} data-testid='user-list'>
      {players.map((player, i) => (
        <li
          key={i + player.name}
          data-testid='user-info'
          className={styles.player}
          onClick={() => {
            const home = planets.find(planet => planet.owner === player.id);
            if (home) {
              dispatch(activatePlanet(home));
            }

            onSelect(player, i);
          }}
        >
          <i
            className={classNames('fas fa-edit', styles.editIcon)}
            style={{
              color: `var(--color-player-${i})`,
            }} />
          <span>{player.name}</span>
          <i
            style={{
              color: `var(--color-player-${i})`,
            }}
            onClick={(e) => {
              e.stopPropagation();

              dispatch(removePlayer(player.id));
            }}
            className={classNames(styles.removeUser, 'fas fa-user-minus')}
          ></i>
        </li>
      ))}
    </ul>
  );
}
