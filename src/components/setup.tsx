import React from 'react';
import styles from './setup.module.css';
import { planetNames } from '../planetNames';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { regenerateSector, selectConfig, selectAllPlanets, setNumPlanets, setSectorSize, activatePlanet } from '../slices/root-slice';
import type { Player } from '../types';
import { Board } from './board';
import { startGame } from '../slices/game-slice';
import { addPlayer, removePlayer, selectAllPlayers, updatePlayer } from '../slices/players-slice';

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
  const planets = useSelector(selectAllPlanets)

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
        <ul id="players" className={styles.playerList} data-testid='user-list'>
          {players.map((player, i) => (
            <li
              key={i + player.name}
              data-testid='user-info'
              className={styles.player}
              onMouseOver={() => setFocus(i)}
              onMouseOut={() => setFocus(undefined)}
              onClick={() => {
                const home = planets.find(planet => planet.owner === player.id)
                if (home) {
                  dispatch(activatePlanet(home))
                }

                setDraftPlayer(() => {
                  return {
                    position: i,
                    id: player.id,
                    name: player.name,
                    color: player.color,
                  }

                })
              }}
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
              setDraftPlayer((draft) => ({
                ...draft,
                name,
              }))
            }}
          />
          <input
            type="submit"
            role="button"
            name="Submit"
            value={draftPlayer.id == null ? 'Add' : 'Update'}
          />

        </form>

        <button
          type="button"
          className={styles.start}
          onClick={() => {
            dispatch(startGame())
          }}
        >
          Start Game
        </button>

        <Board useTooltip={true} className={styles.preview} />
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
