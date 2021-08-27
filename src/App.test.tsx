/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from 'react';
import { configure, Queries, render, RenderResult, within } from '@testing-library/react';
import { wrapWithTestBackend } from 'react-dnd-test-utils'
import { assert, util } from 'chai';
import userEvent from '@testing-library/user-event'
import App from './App';
import { Provider } from 'react-redux';
import { createStore } from './store';
import { byLabelText, byRole, byTestId } from 'testing-library-selector'
import { fireEvent } from '@testing-library/dom';

const MAX_DENSITY = 50
const MAX_SECTOR_SIZE = 25

const ui = {
  addUserButton: byRole('button', { name: 'Add' }),
  board: byTestId('board'),
  customBoard: byRole('button', { name: 'Custom Board' }),
  newSector: byRole('button', { name: 'New Sector' }),
  newUserInput: byLabelText<HTMLInputElement>(/New Player/),
  numPlanetsInput: byLabelText<HTMLInputElement>(/Planets:$/),
  planet: byTestId('planet'),
  sectorSizeInput: byLabelText<HTMLInputElement>(/Sector Size/),
  startGame: byRole<HTMLButtonElement>('button', { name: 'Start Game' }),
  userInfo: byTestId('user-info'),
  userList: byTestId('user-list'),
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
const [AppContext] = wrapWithTestBackend(TestApp)

describe('Setup', () => {
  async function addPlayer<T extends Queries>(utils: RenderResult<T>, name: string) {
    userEvent.type(await ui.newUserInput.find(), name)
    userEvent.click(ui.addUserButton.get())
    assert.isEmpty(
      ui.newUserInput.get().value,
      'The input did not clear when adding user'
    )
  }

  it('New Player: A user can submit thier name', async () => {
    const utils = render(<AppContext />);

    const myName = 'borg'
    await addPlayer(utils, myName)

    const allUsers = ui.userInfo.getAll(
      await ui.userList.find()
    )
    const me = allUsers.filter((context) => {
      return within(context).queryByText(myName, { normalizer: (name) => name.trim() })
    })
    assert.isNotEmpty(me, 'New user not found')
  })

  async function readBoard() {
    const board = await ui.board.find()

    const planets = await ui.planet.findAll(board)

    const sectorSize = Number(board.dataset.sectorSize)
    const numPlanets = planets.length
    const planetNames = planets.map(el => el.dataset.name)

    return {
      numPlanets,
      planetNames,
      sectorSize,
      boardFingerprint: `${sectorSize}:${numPlanets}\n${planetNames.join(' ')}`
    }
  }

  it('The sector is regenerated when a player is added', async () => {
    const utils = render(<AppContext />);

    const boardBefore = await readBoard()
    await addPlayer(utils, 'cylons')

    const boardAfter = await readBoard()

    assert(
      boardBefore.boardFingerprint !== boardAfter.boardFingerprint,
      'All the planets are in the same order'
    )
  })

  it('Sector: Changing the sector size changes the number of tiles', async () => {
    render(<AppContext />);

    userEvent.click(await ui.customBoard.find())

    const value = 10
    fireEvent.change(
      await ui.sectorSizeInput.find(),
      {
        target: { value }
      }
    )

    const board = await readBoard()

    assert(
      board.sectorSize === value,
      'Changing the sector size should update the board'
    )
  })
  it('NumPlanets: changing the number of planets is reflected in the game board', async () => {
    render(<AppContext />);
    const value = 15

    userEvent.click(await ui.customBoard.find())
    fireEvent.change(
      await ui.numPlanetsInput.find(),
      { target: { value } }
    )

    const { numPlanets } = await readBoard()
    assert(
      numPlanets === value,
      `Expected ${value} planets, found ${numPlanets}`
    )
  })
  it('Start button is disabled until there are at least 2 players', async () => {
    const utils = render(<AppContext />);

    const startButton = await ui.startGame.find()
    assert(
      startButton.disabled,
      'Start button should be disabled when there are no users'
    )

    await addPlayer(utils, 'cylons')
    await addPlayer(utils, 'borg')

    assert(
      !startButton.disabled,
      'Start button should be disabled when there are no users'
    )
  })
  it('Clicking new sector shows a new game board', async () => {
    render(<AppContext />);

    const boardBefore = await readBoard()
    userEvent.click(
      await ui.newSector.find()
    )
    const boardAfter = await readBoard()

    assert(
      boardBefore.boardFingerprint !== boardAfter.boardFingerprint,
      'All the planets are in the same order'
    )
  })
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
