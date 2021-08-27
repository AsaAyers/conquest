/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import App from './App';

const MAX_DENSITY = 50
const MAX_SECTOR_SIZE = 25

describe('Setup', () => {
  // it('renders learn react link', () => {
  //   const { getByText } = render(<App />);
  //   const linkElement = getByText(/learn react/i);
  //   expect(document.body.contains(linkElement));
  // });

  test('New Player: A user can submit thier name', () => {
    const utils = render(<App />);
    utils.findByLabelText('New Player')
  })

  test('The sector is regenerated when a player is added')

  test('Sector: Changing the sector size changes the number of tiles', () => {

  })
  test('NumPlanets: changing the number of planets is reflected in the game board')
  test('Start button is disabled until there are at least 2 players')
  test('Clicking new sector shows a new game board')
  test(
    `Local Play: 3 player names can be entered, then start the game
    The game boardtransfers to the new screen
    `
  )

  describe('Error conditions', () => {
    test('sector size cannot be negative')
    describe(`Max Density: ${MAX_DENSITY}%`, () => {
      test('sector size has a lower boundary')
      test('numPlanets has an upper boundary')
    })

    test(`Max sector size: ${MAX_SECTOR_SIZE}`)


    test('unclaimedPlanets:players ratio cannot be less than 3:1')
    describe(`When a player is added that breaks the unclaimedPlanets ratio`, () => {
      test(`then planets are added automatically`)

      describe(`if the added planets breaks Max Density ${MAX_DENSITY}`, () => {
        test('the sector size is increased automatically')
      })
    })

  })


});
