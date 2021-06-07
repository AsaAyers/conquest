import React from 'react';
import { useService } from '@xstate/react';
import styles from './setup.module.css';
import type { GameInterpreter } from 'src/conquest-machine/Types';
import { planetNames } from '../conquest-machine/planetNames';
import classNames from 'classnames';

type SetupProps = {
  service: GameInterpreter;
};
export function Setup({ service }: SetupProps): JSX.Element {
  const [state, send] = useService(service);

  return (
    <div className={styles.vertiacalCenter}>
      <div className={styles.setup}>
        <h1>Setup</h1>

        <label htmlFor="galaxySize">Galaxy Size:</label>
        <input
          id="galaxySize"
          type="number"
          value={state.context.galaxySize}
          onChange={(e) =>
            send({ type: 'GALAXY_SIZE', value: Number(e.target.value) })
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
            send({ type: 'NUM_PLANETS', numPlanets: Number(e.target.value) });
          }}
        />

        <label htmlFor="players">Players:</label>
        <ul id="players" className={styles.playerList}>
          {state.context.players.map((name, i) => (
            <li
              key={i + name}
              className={styles.player}
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
      </div>
    </div>
  );
}
