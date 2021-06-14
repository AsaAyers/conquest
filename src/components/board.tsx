import classNames from 'classnames';
import React from 'react';
import { getAddressKey, useConquest } from '../conquest-machine';
import styles from './board.module.scss';
import { Tile } from './Tile';

type BoardProps = {
  className?: string;
};
export function Board({
  className,
}: BoardProps): JSX.Element {
  const [state] = useConquest()
  const { planets, sectorSize } = state.context;

  const tiles = React.useMemo(
    () =>
      Array(sectorSize * sectorSize)
        .fill(null)
        .map((n, index) => ({
          y: Math.floor(index / sectorSize),
          x: index % sectorSize,
        })),
    [sectorSize],
  );

  console.log('FOCUS',
    state.context.focus)

  return (
    <div
      className={classNames(styles.board, className)}
      style={{
        gridTemplateColumns: `repeat(${sectorSize}, 1fr)`,
        gridTemplateRows: `repeat(${sectorSize}, 1fr)`,
      }}
    >
      {tiles.map(getAddressKey).map((key) => (
        <Tile
          key={key}
          planet={planets[key]}
          focus={state.context.focus}
        />
      ))}
    </div>
  );
}
