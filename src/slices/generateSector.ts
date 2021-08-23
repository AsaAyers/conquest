import type { EntityId } from '@reduxjs/toolkit';
import type { Planet, Player } from '../types';

export function getAddressKey(address: Planet['address']): string {
  return `${address.x},${address.y}`;
}

export const NUM_PLANET_ICONS = 18;

export const planetNames: EntityId[] = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

export default function generateSector(
  numPlanets: number,
  sectorSize: number,
  playerIds: Array<Player['id']>
): Record<EntityId, Planet> {
  let nameIndex = 0;
  const planets: Record<Planet['id'], Planet> = {};

  while (Object.values(planets).length < numPlanets) {
    const planetCandidate: Planet = {
      id: planetNames[nameIndex],
      name: String(planetNames[nameIndex]),
      combatModifier: 1,
      address: {
        x: Math.floor(Math.random() * sectorSize),
        y: Math.floor(Math.random() * sectorSize),
      },
      planetIcon: 1 + Math.floor(Math.random() * NUM_PLANET_ICONS),
      owner: null,
      population: 100,
      shipsPerRound: 10,
    };
    if (planets[getAddressKey(planetCandidate.address)] == null) {
      planets[getAddressKey(planetCandidate.address)] = planetCandidate;
      nameIndex++;
    }
  }

  console.log('planets', planets)
  const allPlanets = Object.values(planets).sort(
    (a, b) => planetNames.indexOf(a.id) - planetNames.indexOf(b.id),
  );
  playerIds.forEach((playerId) => {
    let home
    do {
      home = allPlanets[Math.floor(Math.random() * allPlanets.length)];
      if (home.owner == null) {
        home.owner = playerId;
      }
    } while (home.owner !== playerId);
  });

  return planets;
}