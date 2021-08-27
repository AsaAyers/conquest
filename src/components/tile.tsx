import classNames from 'classnames';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { activatePlanet, selectActivePlanet, } from '../slices/root-slice';
import { getAddressKey } from '../slices/generateSector';
import type { Planet, Player } from '../types';
import styles from './tile.module.scss';
import { selectAllPlayers } from '../slices/players-slice';
import { useDrag, useDrop } from 'react-dnd';
import { selectTurnInfo } from '../slices/game-slice';

export type TileProps = {
  planet?: Planet;
  useTooltip?: boolean
  address: Planet['address']
};
export function Tile({ address, planet, useTooltip }: TileProps): JSX.Element {
  const dispatch = useDispatch()
  const turn = useSelector(selectTurnInfo)
  const players = useSelector(selectAllPlayers)
  const activePlanet = useSelector(selectActivePlanet)
  const ownerIndex = planet?.owner ? players.findIndex(player => player.id === planet.owner) : undefined
  const owner = ownerIndex != null ? players[ownerIndex] : undefined
  const planetKey = planet ? getAddressKey(planet.address) : undefined

  const [, dragRef] = useDrag(
    () => ({
      type: 'planet',
      canDrag: Boolean(planet) && turn.playersTurn === ownerIndex,
      previewOptions: {},
      options: {},
      item: { id: planet?.name },
      collect: (_monitor) => ({
        // opacity: monitor.isDragging() ? 0.0 : 1,
        // isDragging: monitor.isDragging()
      })
    })
  )

  const [, dropRef] = useDrop(
    () => ({
      accept: 'planet',
      canDrop: () => {

        return Boolean(planet)
      },
      drop(item) {

        return undefined
      }
    })
  )

  return (
    <div
      ref={dropRef}
      className={classNames(styles.tile, {
        [styles.active]: activePlanet && getAddressKey(activePlanet.address) === planetKey,
        [styles.x]: activePlanet && activePlanet?.address.x === address.x,
        [styles.y]: activePlanet && activePlanet?.address.y === address.y,
      })}
      data-owner={ownerIndex}
      data-planet={planet?.planetIcon}
      data-unclaimed={planet && planet.owner == null ? true : undefined}
      onClick={() => {
        if (planet) {
          dispatch(activatePlanet(planet))
        }
      }}
    >
      {planet && (
        <span
          ref={dragRef}
          className={styles.planetName}>
          {useTooltip && <Tooltip planet={planet} owner={owner} />}
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
