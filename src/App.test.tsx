/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from 'react';
import { configure, Queries, render, RenderResult, within } from '@testing-library/react';
import { wrapWithTestBackend } from 'react-dnd-test-utils'
import { assert } from 'chai';
import userEvent from '@testing-library/user-event'
import App from './App';
import { Provider } from 'react-redux';
import { createStore } from './store';
import { byLabelText, byRole, byTestId } from 'testing-library-selector'

const MAX_DENSITY = 50
const MAX_SECTOR_SIZE = 25

const ui = {
  newUserInput: byLabelText<HTMLInputElement>(/New Player/),
  addUserButton: byRole('button', { name: 'Add' }),
  userList: byTestId('user-list'),
  sectorInput: byLabelText<HTMLInputElement>(/Sector Size/),
  numPlanetsInput: byLabelText<HTMLInputElement>(/Planets:$/),

  userInfo: byTestId('user-info')
}

configure({
  showOriginalStackTrace: true,
  throwSuggestions: false,
})

function TestApp() {
  const store = createStore()
  return (
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  )
}

describe('Setup', () => {
  async function addPlayer<T extends Queries>(utils: RenderResult<T>, name: string) {
    userEvent.type(await ui.newUserInput.find(), name)
    userEvent.click(await ui.addUserButton.find())
    assert.isEmpty(
      (await ui.newUserInput.find()).value,
      'The input did not clear when adding user'
    )
  }

  it('New Player: A user can submit thier name', async () => {
    const [AppContext] = wrapWithTestBackend(TestApp)
    const utils = render(<AppContext />);

    const myName = 'borg'
    await addPlayer(utils, myName)

    const allUsers = await ui.userInfo.findAll(
      await ui.userList.find()
    )
    const me = allUsers.filter((context) => {
      return within(context).queryByText(myName, { normalizer: (name) => name.trim() })
    })
    assert.isNotEmpty(me, 'New user not found')
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
