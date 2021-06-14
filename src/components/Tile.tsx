import React from 'react';
import type { GameInterpreter, Planet } from '../conquest-machine/Types';
import styles from './tile.module.scss';

export type TileProps = {
  planet: null | Planet;
  focus?: number
};
export function Tile({ planet, focus }: TileProps): JSX.Element {
  return (
    <div
      className={styles.tile}
      data-owner={planet?.owner}
      data-planet={planet?.planet}
      data-unclaimed={planet != null && planet.owner == null ? true : undefined}
      data-focus={focus != undefined
        ? (focus == planet?.owner)
        : undefined}
      style={{
        // backgroundColor: planet?.owner != null ? `var(--color-player-${planet?.owner})` : undefined
      }}
    >
      <span className={styles.planetName}>{planet?.id}</span>

      {planet != null
        ? (
          planet.owner
        )
        : undefined
      }
    </div>
  );
}

type TooltipProps = {
  planet: Planet;
  service: GameInterpreter;
}
function Tooltip({ planet, service }: TooltipProps) {

  const ownerName =
    planet.owner == null
      ? "Unclaimed"
      : service.state.context.players[planet.owner]

  return (
    <div className={styles.tooltip}>
      <span>
        {ownerName}

      </span>

    </div>
  )
}