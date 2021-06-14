import React from 'react';
import styles from './setup.module.css';
import { planetNames } from '../conquest-machine/planetNames';
import classNames from 'classnames';
import { useConquest } from '../conquest-machine';

export function Setup(): JSX.Element {
  const [state, send] = useConquest()

  return (
    <div className={styles.vertiacalCenter}>
      <div className={styles.setup}>
        <h1>Setup</h1>

        <label htmlFor="sectorSize">sector Size:</label>
        <input
          id="sectorSize"
          type="number"
          value={state.context.sectorSize}
          onChange={(e) =>
            send({ type: 'sector_SIZE', value: Number(e.target.value) })
          }
        />

        <label htmlFor="numPlanets">{state.context.numPlanets} Planets:</label>
        <input
          type="range"
          id="numPlanets"
          min={state.context.players.length * 2}
          max={planetNames.length}
          value={state.context.numPlanets}
          onChange={(e) => {
            console.log('NUM_PLANETS', Number(e.target.value));
            send({ type: 'NUM_PLANETS', value: Number(e.target.value) });
          }}
        />

        <label htmlFor="players">Players:</label>
        <ul id="players" className={styles.playerList}>
          {state.context.players.map((name, i) => (
            <li
              key={i + name}
              className={styles.player}
              onMouseOver={() => send({ type: 'SET_FOCUS', value: i })}
              onMouseOut={() => send({ type: 'SET_FOCUS', value: undefined })}
              onClick={() =>
                send({
                  type: 'EDIT_PLAYER',
                  position: i,
                })
              }
            >
              <i
                className={classNames('fas fa-edit', styles.editIcon)}
                style={{
                  color: `var(--color-player-${i})`,
                }}
              />
              <span>{name}</span>
              <i
                style={{
                  color: `var(--color-player-${i})`,
                }}
                onClick={(e) => {
                  e.stopPropagation();

                  send({
                    type: 'REMOVE_PLAYER',
                    position: i,
                  });
                }}
                className={classNames(styles.removeUser, 'fas fa-user-minus')}
              ></i>
            </li>
          ))}
        </ul>

        <label htmlFor="draftPlayer">
          {state.context.draftPlayer.position != null
            ? `Player ${state.context.draftPlayer.position + 1}`
            : 'New Player'}
          :
        </label>

        <form
          className={styles.draftPlayerForm}
          onSubmit={(e) => {
            e.preventDefault();
            send({ type: 'COMMIT_PLAYER' });
          }}
        >
          <input
            type="text"
            id="draftPlayer"
            value={state.context.draftPlayer.name}
            onChange={(e) =>
              send({
                type: 'UPDATE_DRAFT',
                name: e.target.value,
              })
            }
          />
          <button type="submit">
            {state.context.draftPlayer.position == null ? 'Add' : 'Update'}
          </button>
        </form>

        <button
          type="button"
          className={styles.start}
          onClick={() => send({ type: 'START' })}
        >
          Start Game
        </button>
      </div>
    </div>
  );
}
