import React from 'react';
import styles from './setup.module.css';
import { planetNames } from '../conquest-machine/planetNames';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { addPlayer, ready, regenerateSector, removePlayer, selectAllPlayers, selectConfig, selectPlanets, setNumPlanets, setSectorSize, updatePlayer } from '../slices/conquest';
import type { Player } from '../types';
import { Board } from './board';

type DraftPlayer = {
  id?: Player['id'],
  position: number,
  name: Player['name']
  color: Player['color']
}
export function Setup(): JSX.Element {
  const dispatch = useDispatch()
  const [, setFocus] = React.useState<number | undefined>()
  const config = useSelector(selectConfig)
  const players = useSelector(selectAllPlayers)
  const planets = useSelector(selectPlanets)
  const [tab, setTab] = React.useState<'setup' | 'preview'>('setup')

  const numPlanets = planets.length

  const [draftPlayer, setDraftPlayer] = React.useState<DraftPlayer>({
    id: undefined,
    position: 0,
    name: '',
    color: ''
  })

  return (
    <div className={styles.setupScreen}>
      <h1>
        Setup
      </h1>

      <div className={classNames(styles.setup)}>
        <label htmlFor="sectorSize">sector Size:</label>
        <input
          id="sectorSize"
          type="number"
          value={config.sectorSize}
          onChange={(e) => {
            dispatch(setSectorSize(Number(e.target.value)))
          }}
        />

        <label htmlFor="numPlanets">{numPlanets} Planets:</label>
        <input
          type="range"
          id="numPlanets"
          min={config.players.ids.length * 2}
          max={planetNames.length}
          value={planets.length}
          onChange={(e) => {
            dispatch(setNumPlanets(Number(e.target.value)))
          }}
        />

        <label htmlFor="players">Players:</label>
        <ul id="players" className={styles.playerList}>
          {players.map((player, i) => (
            <li
              key={i + player.name}
              className={styles.player}
              onMouseOver={() => setFocus(i)}
              onMouseOut={() => setFocus(undefined)}
              onClick={() =>

                setDraftPlayer(() => {
                  return {
                    position: i,
                    id: player.id,
                    name: player.name,
                    color: player.color,
                  }

                })
              }
            >
              <i
                className={classNames('fas fa-edit', styles.editIcon)}
                style={{
                  color: `var(--color-player-${i})`,
                }}
              />
              <span>{player.name}</span>
              <i
                style={{
                  color: `var(--color-player-${i})`,
                }}
                onClick={(e) => {
                  e.stopPropagation();

                  dispatch(removePlayer(player.id))
                }}
                className={classNames(styles.removeUser, 'fas fa-user-minus')}
              ></i>
            </li>
          ))}
        </ul>

        <label htmlFor="draftPlayer">
          {draftPlayer.id != null
            ? `Player ${draftPlayer.position}`
            : 'New Player'}
          :
        </label>

        <form
          className={styles.draftPlayerForm}
          onSubmit={(e) => {
            e.preventDefault();
            if (draftPlayer.id == null) {

              dispatch(addPlayer({
                name: draftPlayer.name,
                color: draftPlayer.color,
              }))
            } else {
              dispatch(updatePlayer({
                id: draftPlayer.id,
                changes: {
                  name: draftPlayer.name,
                  color: draftPlayer.color,
                }
              }))
            }

            setDraftPlayer({
              id: undefined,
              position: 0,
              name: '',
              color: '',
            })

          }}
        >
          <input
            type="text"
            id="draftPlayer"
            value={draftPlayer.name}
            onChange={(e) => {
              const name = e.target.value
              console.log('name', name)
              setDraftPlayer((draft) => ({
                ...draft,
                name,
              }))
            }}
          />
          <button type="submit">
            {draftPlayer.id == null ? 'Add' : 'Update'}
          </button>
        </form>

        <button
          type="button"
          className={styles.start}
          onClick={() => {
            players.forEach((player) => {
              dispatch(ready(player.id))
            })
          }}
        >
          Start Game
        </button>

        <Board className={styles.preview} />
        <button
          type="button"
          className={styles.regenerateSector}
          onClick={() => dispatch(regenerateSector())}
        >
          New Sector
        </button>
      </div>
    </div>
  );
}
