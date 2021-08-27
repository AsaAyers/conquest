import React from 'react';
import styles from './setup.module.scss';
import { planetNames } from '../planetNames';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { regenerateSector, selectConfig, selectAllPlanets, setNumPlanets, setSectorSize } from '../slices/root-slice';
import type { Player } from '../types';
import { Board } from './board';
import { startGame } from '../slices/game-slice';
import { addPlayer, selectAllPlayers, updatePlayer } from '../slices/players-slice';
import { PlayerList } from './setup/player-list';

type DraftPlayer = {
  id?: Player['id'],
  position: number,
  name: Player['name']
  color: Player['color']
}
export function Setup(): JSX.Element {
  const dispatch = useDispatch()
  const [showAdvanced, setShowAdvanced] = React.useState(false)
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

  }

  return (
    <div className={classNames(styles.setupScreen, {
      [styles.showAdvanced]: showAdvanced
    })}>
      <h1>Setup</h1>

      <div className={classNames(styles.setup)}>
        {showAdvanced && (
          <React.Fragment>
            <label htmlFor="sectorSize">Sector Size:</label>
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
          </React.Fragment>
        )}

        <label htmlFor="players">Players:</label>
        <PlayerList
          players={players}
          planets={planets}
          onSelect={(player, position) => {
            setDraftPlayer(() => {
              return {
                position,
                id: player.id,
                name: player.name,
                color: player.color,
              }
            })
          }} />

        <label htmlFor="draftPlayer">
          {draftPlayer.id != null
            ? `Player ${draftPlayer.position}`
            : 'New Player'}
          :
        </label>

        <form
          className={styles.draftPlayerForm}
          onSubmit={handleSubmit}
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
          disabled={players.length < 2}
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

        <button
          type="button"
          className={styles.customBoard}
          onClick={() => setShowAdvanced(advanced => !advanced)}
        >
          Custom Board
        </button>

      </div>
    </div>
  );
}
