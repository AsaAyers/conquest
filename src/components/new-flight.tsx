import classNames from 'classnames'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectTurnInfo } from '../slices/game-slice'
import { getAddressKey, getDistance } from '../slices/generateSector'
import { selectAllPlayers } from '../slices/players-slice'
import { selectActivePlanet } from '../slices/root-slice'
import type { Flight } from '../types'
import styles from './new-flight.module.scss'

type Props = {
  className?: string
}
export default function NewFlight({ className }: Props): JSX.Element {
  const activePlanet = useSelector(selectActivePlanet)
  const { playersTurn, turnNumber } = useSelector(selectTurnInfo)
  const players = useSelector(selectAllPlayers)
  const [draftFlight, setDraft] = React.useState<Partial<Flight & { total: number }>>({})

  const currentPlayer = players[playersTurn]

  React.useEffect(() => {
    if (activePlanet) {
      if (!draftFlight.from && activePlanet.owner === currentPlayer.id) {
        setDraft((draft) => ({
          ...draft,
          from: activePlanet.address,
          total: activePlanet.population
        }))
        return
      }

      setDraft((draft) => ({
        ...draft,
        to: activePlanet.address
      }))
      return
    }

  }, [activePlanet])

  return (
    <form className={classNames(className, styles.newFlight, {
      [styles.showSave]: true, // Boolean(draftFlight.from),
      [styles.showShips]: true, // Boolean(draftFlight.ships),
      [styles.showTo]: true, // Boolean(draftFlight.to),
      [styles.showDistance]: true, // Boolean(draftFlight.to),

    })}>
      <span className={styles.header}>
        New Flight
      </span>

      <label htmlFor="from">From</label>
      <input id="from" value={
        draftFlight.from ? getAddressKey(draftFlight.from) : ''
      } readOnly />

      <label htmlFor="ships">Ships</label>
      <input
        id="ships"
        value={draftFlight.ships}
        type="range"
        min={1}
        max={draftFlight.total}
        onChange={(e) => {
          const ships = Number(e.target.value)
          setDraft((draft) => ({
            ...draft,
            ships
          }))
        }}
      />
      <span className={styles.total}>
        {draftFlight.ships}/{draftFlight.total}
      </span>

      <label htmlFor="to">To</label>
      <input id="to" value={
        draftFlight.to ? getAddressKey(draftFlight.to) : ''
      } readOnly />

      <label htmlFor="distance">Arrive on turn</label>
      <input id="distance" value={
        draftFlight.from && draftFlight.to ? turnNumber + getDistance(draftFlight.from, draftFlight.to) : ''
      } readOnly />

      <button className={styles.save} type="submit">
        Send
      </button>
    </form>
  )
}
