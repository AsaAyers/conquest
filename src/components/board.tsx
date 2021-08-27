import classNames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import { getAddressKey } from '../slices/generateSector';
import { selectConfig, selectPlanetEntities } from '../slices/root-slice';
import styles from './board.module.scss';
import { Tile } from './tile';

type BoardProps = {
  className?: string;
  useTooltip?: boolean
};
export function Board({ className, useTooltip }: BoardProps): JSX.Element {
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
      {tiles.map((address) => {
        const key = getAddressKey(address)
        return <Tile key={key} address={address} planet={planets[key]} useTooltip={useTooltip} />
      })}
    </div>
  );
}
