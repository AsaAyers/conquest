import classNames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import { getAddressKey } from '../slices/generateSector';
import { selectConfig, selectPlanetEntities } from '../slices/conquest';
import styles from './board.module.scss';
import { Tile } from './Tile';

type BoardProps = {
  className?: string;
};
export function Board({ className }: BoardProps): JSX.Element {
  const planets = useSelector(selectPlanetEntities)
  const { sectorSize } = useSelector(selectConfig)

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

  return (
    <div
      className={classNames(styles.board, className)}
      style={{
        gridTemplateColumns: `repeat(${sectorSize}, 1fr)`,
        gridTemplateRows: `repeat(${sectorSize}, 1fr)`,
      }}
    >
      {tiles.map(getAddressKey).map((key) => (
        <Tile key={key} planet={planets[key]} />
      ))}
    </div>
  );
}
