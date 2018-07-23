import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

describe('modules/events/actions/log-handlers.js', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  const test = t => it(t.description, () => {
    const store = mockStore(t.state || {})

    t.assertions(store)
  })

  describe('handleCompleteSetsSoldLog', () => {
    const { handleTokensMintedLog, handleCompleteSetsSoldLog, __RewireAPI__ } = require('modules/events/actions/log-handlers.js')

    const ACTIONS = {
      LOAD_ACCOUNT_TRADES: 'LOAD_ACCOUNT_TRADES',
      UPDATE_LOGGED_TRANSACTIONS: 'UPDATE_LOGGED_TRANSACTIONS',
      LOAD_REPORTING_WINDOW: 'LOAD_REPORTING_WINDOW',
    }

    beforeEach(() => {
      __RewireAPI__.__Rewire__('updateLoggedTransactions', log => ({
        type: ACTIONS.UPDATE_LOGGED_TRANSACTIONS,
        data: {
          log,
        },
      }))
      __RewireAPI__.__Rewire__('loadAccountTrades', options => ({
        type: ACTIONS.LOAD_ACCOUNT_TRADES,
        data: {
          marketId: options.marketId,
        },
      }))
      __RewireAPI__.__Rewire__('loadReportingWindowBounds', log => ({
        type: ACTIONS.LOAD_REPORTING_WINDOW,
      }))
    })

    afterEach(() => {
      __RewireAPI__.__ResetDependency__('loadAccountTrades')
      __RewireAPI__.__ResetDependency__('updateLoggedTransactions')
      __RewireAPI__.__ResetDependency__('loadReportingWindowBounds')
    })


    test({
      description: `Should fire off update and load account trades if the sell complete set log includes the account address`,
      state: {
        loginAccount: {
          address: '0xb0b',
        },
      },
      assertions: (store) => {
        const log = {
          marketId: '0xdeadbeef',
          account: '0xb0b',
        }
        store.dispatch(handleCompleteSetsSoldLog(log))

        const actual = store.getActions()

        const expected = [{
          type: ACTIONS.UPDATE_LOGGED_TRANSACTIONS,
          data: {
            log,
          },
        }, {
          type: ACTIONS.LOAD_ACCOUNT_TRADES,
          data: {
            marketId: '0xdeadbeef',
          },
        }]

        assert.deepEqual(actual, expected, `Dispatched unexpected actions.`)
      },
    })

    test({
      description: `Shouldn't fire off update and load account trades if the sell complete set log doesn't include the account address`,
      state: {
        loginAccount: {
          address: '0xb0b',
        },
      },
      assertions: (store) => {
        const log = {
          marketId: '0xdeadbeef',
          account: '0xa11ce',
        }
        store.dispatch(handleCompleteSetsSoldLog(log))

        const actual = store.getActions()

        const expected = []

        assert.deepEqual(actual, expected, `Dispatched unexpected actions.`)
      },
    })

    test({
      description: `should process token mint log`,
      state: {
        loginAccount: {
          address: '0xb0b',
        },
      },
      assertions: (store) => {
        const log = {
          marketId: '0xdeadbeef',
          target: '0xb0b',
        }
        store.dispatch(handleTokensMintedLog(log))
        const actual = store.getActions()
        const expected = [{ type: ACTIONS.LOAD_REPORTING_WINDOW }]
        assert.deepEqual(actual, expected, `Dispatched unexpected actions.`)
      },
    })
  })
})
