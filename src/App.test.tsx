/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from 'react';
import { render } from '@testing-library/react';
import { wrapWithTestBackend } from 'react-dnd-test-utils'
// import { expect } from 'chai';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';

const MAX_DENSITY = 50
const MAX_SECTOR_SIZE = 25

function TestApp() {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  )
}

describe('Setup', () => {
  // it('renders learn react link', () => {
  //   const { getByText } = render(<App />);
  //   const linkElement = getByText(/learn react/i);
  //   expect(document.body.contains(linkElement));
  // });

  it('New Player: A user can submit thier name', () => {
    const [AppContext, getBackend] = wrapWithTestBackend(TestApp)
    const utils = render(<AppContext />);
    utils.findByLabelText('New Player')
  })

  it('The sector is regenerated when a player is added')

  it('Sector: Changing the sector size changes the number of tiles', () => {

  })
  it('NumPlanets: changing the number of planets is reflected in the game board')
  it('Start button is disabled until there are at least 2 players')
  it('Clicking new sector shows a new game board')
  it(
    `Local Play: 3 player names can be entered, then start the game
    The game boardtransfers to the new screen
    `
  )

  describe('Error conditions', () => {
    it('sector size cannot be negative')
    describe(`Max Density: ${MAX_DENSITY}%`, () => {
      it('sector size has a lower boundary')
      it('numPlanets has an upper boundary')
    })

    it(`Max sector size: ${MAX_SECTOR_SIZE}`)


    it('unclaimedPlanets:players ratio cannot be less than 3:1')
    describe(`When a player is added that breaks the unclaimedPlanets ratio`, () => {
      it(`then planets are added automatically`)

      describe(`if the added planets breaks Max Density ${MAX_DENSITY}`, () => {
        it('the sector size is increased automatically')
      })
    })

  })


});
