import classNames from 'classnames';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { activatePlanet, selectActivePlanet, selectAllPlayers } from '../slices/conquest';
import { getAddressKey } from '../slices/generateSector';
import type { Planet, Player } from '../types';
import styles from './tile.module.scss';

export type TileProps = {
  planet?: Planet;
  focus?: number;
};
export function Tile({ planet }: TileProps): JSX.Element {
  const dispatch = useDispatch()
  const players = useSelector(selectAllPlayers)
  const activePlanet = useSelector(selectActivePlanet)
  const ownerIndex = planet?.owner ? players.findIndex(player => player.id === planet.owner) : undefined
  const owner = ownerIndex != null ? players[ownerIndex] : undefined
  const planetKey = planet ? getAddressKey(planet.address) : undefined

  return (
    <div
      className={classNames(styles.tile, {
        [styles.active]: activePlanet === planetKey
      })}
      data-owner={ownerIndex}
      data-planet={planet?.planetIcon}
      data-unclaimed={planet?.owner == null ? true : undefined}
      onClick={() => {
        if (planet) {
          console.log('activate', planetKey)
          dispatch(activatePlanet(planetKey))
        }
      }}
    >
      {planet && (
        <span className={styles.planetName}>
          {planet.name}
          <Tooltip planet={planet} owner={owner} />
        </span>
      )}
    </div>
  );
}

type TooltipProps = {
  planet: Planet
  owner?: Player
};
function Tooltip({ owner }: TooltipProps) {
  return (
    <div className={styles.tooltip}>
      <span>{owner?.name ?? 'Unclaimed'}</span>
    </div>
  );
}
