

import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

describe('modules/markets/actions/load-user-markets.js', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const mockEnv = {
    'bug-bounty': false,
  }

  const test = t => it(t.description, () => {
    const state = { ...t.state, env: mockEnv }
    const store = mockStore(state)

    t.assertions(store)
  })

  describe('loadUserMarkets', () => {
    const { loadUserMarkets, __RewireAPI__ } = require('modules/markets/actions/load-user-markets')

    const ACTIONS = {
      UPDATE_MARKETS_DATA: 'UPDATE_MARKETS_DATA',
    }

    __RewireAPI__.__Rewire__('augur', {
      markets: {
        getMarketsCreatedByUser: (p, cb) => {
          if (!p.universe || !p.creator) return cb({ error: 'error message' })
          if (p.universe === 'noUserMarketsUniverse') return cb(null)
          cb(null, ['0xabc1', '0xabc2', '0xabc3'])
        },
      },
    })
    __RewireAPI__.__Rewire__('updateMarketsData', marketsData => ({
      type: ACTIONS.UPDATE_MARKETS_DATA,
      data: {
        marketsData,
      },
    }))

    test({
      description: `should dispatch the expected actions when no user markets are in universe`,
      state: {
        universe: { id: 'noUserMarketsUniverse' },
        loginAccount: { address: '0xtester1' },
      },
      assertions: (store) => {
        store.dispatch(loadUserMarkets((err, marketsArray) => {
          assert.isNull(err, `Didn't reutrn null for error as expected`)
          assert.isUndefined(marketsArray, `Expected marketsArray to be undefined`)
        }))

        const actual = store.getActions()

        const expected = []

        assert.deepEqual(actual, expected, `Dispatched Actions when none should have been.`)
      },
    })

    test({
      description: `should handle an error due to missing data`,
      state: {
        universe: {},
        loginAccount: { address: '0xtester1' },
      },
      assertions: (store) => {
        store.dispatch(loadUserMarkets((err, marketsArray) => {
          const expectedError = { error: 'error message' }

          assert.deepEqual(err, expectedError, `Didn't reutrn the expected error object`)
          assert.isUndefined(marketsArray, `Expected marketsArray to be undefined`)
        }))

        const actual = store.getActions()

        const expected = []

        assert.deepEqual(actual, expected, `Dispatched Actions when none should have been.`)
      },
    })

    test({
      description: `should handle markets data`,
      state: {
        universe: { id: '0xb0b' },
        loginAccount: { address: '0xtester1' },
      },
      assertions: (store) => {
        store.dispatch(loadUserMarkets((err, marketsArray) => {
          const expectedMarketsArray = ['0xabc1', '0xabc2', '0xabc3']

          assert.isNull(err, `Error return value wasn't null as expected.`)
          assert.deepEqual(marketsArray, expectedMarketsArray, `Unexpected markets array returned to callback`)
        }))

        const actual = store.getActions()

        const expected = [{
          type: ACTIONS.UPDATE_MARKETS_DATA,
          data: {
            marketsData: {
              '0xabc1': { author: '0xtester1', id: '0xabc1' },
              '0xabc2': { author: '0xtester1', id: '0xabc2' },
              '0xabc3': { author: '0xtester1', id: '0xabc3' },
            },
          },
        }]

        assert.deepEqual(actual, expected, `Dispatched Actions when none should have been.`)
      },
    })
  })
})
