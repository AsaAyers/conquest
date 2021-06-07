import { useService } from '@xstate/react';
import classNames from 'classnames';
import React from 'react';
import type { GameInterpreter, Planet } from 'src/conquest-machine/Types';
import { getAddressKey } from '../conquest-machine';
import styles from './board.module.scss';

type TileProps = {
  planet: null | Planet;
};
function Tile({ planet }: TileProps): JSX.Element {
  return (
    <div
      className={styles.tile}
      data-owner={planet?.owner}
      data-planet={planet?.planet}
      data-unclaimed={planet != null && planet.owner == null ? true : undefined}
      style={
        {
          // backgroundColor: planet?.owner != null ? `var(--color-player-${planet?.owner})` : undefined
        }
      }
    >
      <span className={styles.planetName}>{planet?.id}</span>
    </div>
  );
}

type BoardProps = {
  className?: string;
  service: GameInterpreter;
  planets: Record<string, Planet>;
};
export function Board({
  className,
  service,
  planets,
}: BoardProps): JSX.Element {
  const [state] = useService(service);
  const galaxySize = state.context.galaxySize;

  const tiles = React.useMemo(
    () =>
      Array(galaxySize * galaxySize)
        .fill(null)
        .map((n, index) => ({
          y: Math.floor(index / galaxySize),
          x: index % galaxySize,
        })),
    [galaxySize],
  );

  return (
    <div
      className={classNames(styles.board, className)}
      style={{
        gridTemplateColumns: `repeat(${galaxySize}, 1fr)`,
        gridTemplateRows: `repeat(${galaxySize}, 1fr)`,
      }}
    >
      {tiles.map(getAddressKey).map((key) => (
        <Tile key={key} planet={planets[key]} />
      ))}
    </div>
  );
}
