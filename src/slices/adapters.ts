import { createEntityAdapter } from "@reduxjs/toolkit";
import type { Player, Planet } from "../types";
import { getAddressKey } from "./generateSector";

export const playerAdapter = createEntityAdapter<Player>({
  selectId: (player) => player.id,
});

export const planetAdapter = createEntityAdapter<Planet>({
  selectId: (planet) => getAddressKey(planet.address),
});