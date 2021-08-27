import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { planetAdapter } from "./adapters";

const sectorSlice = createSlice({
  name: 'sector',
  initialState: planetAdapter.getInitialState(),
  reducers: {}
})

const selectors = planetAdapter.getSelectors<RootState>(
  (state) => state.sector
)

export const selectPlanet = selectors.selectById

export default sectorSlice.reducer