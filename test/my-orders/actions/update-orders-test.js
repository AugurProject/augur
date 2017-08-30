import { describe, it } from 'mocha'
import { assert } from 'chai'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'

import { CANCEL_ORDER } from 'modules/transactions/constants/types'

describe('modules/my-orders/actions/update-orders.js', () => {
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  const MOCK_ACTION_TYPES = {
    ADD_ORDER: 'ADD_ORDER',
    REMOVE_ORDER: 'REMOVE_ORDER',
    LOAD_MARKETS_INFO: 'LOAD_MARKETS_INFO'
  }

  const mockUpdateMarketOrderBook = {
    addOrder: sinon.stub().returns({
      type: MOCK_ACTION_TYPES.ADD_ORDER
    }),
    removeOrder: sinon.stub().returns({
      type: MOCK_ACTION_TYPES.REMOVE_ORDER
    })
  }
  const mockLoadMarketsInfo = {
    loadMarketsInfo: () => {}
  }
  sinon.stub(mockLoadMarketsInfo, 'loadMarketsInfo', (market, cb) => {
    cb()

    return {
      type: MOCK_ACTION_TYPES.LOAD_MARKETS_INFO
    }
  })

  const action = proxyquire('../../../src/modules/my-orders/actions/update-orders', {
    '../../bids-asks/actions/update-market-order-book': mockUpdateMarketOrderBook,
    '../../markets/actions/load-markets-info': mockLoadMarketsInfo
  })

  describe('updateOrders', () => {
    const test = (t) => {
      it(t.description, () => {
        const store = mockStore(t.state || {})
        t.assertions(store)
      })
    }

    test({
      description: `should dispatch the expected actions WITH market info loaded AND IS addition AND IS NOT cancelled`,
      state: {
        marketsData: {
          '0xMARKETID': {}
        },
        transactionsData: {}
      },
      assertions: (store) => {
        store.dispatch(action.updateOrders(
          {
            '0xMARKETID': {
              1: [
                {
                  tradeid: '0xTRADEID1'
                }
              ]
            }
          },
          true
        ))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.ADD_ORDER
          }
        ]

        assert.deepEqual(actual, expected, `Didn't return the expected actions`)
      }
    })

    test({
      description: `should dispatch the expected actions WITH market info loaded AND IS addition AND IS cancelled`,
      state: {
        marketsData: {
          '0xMARKETID': {}
        },
        transactionsData: {
          '0xTRANSACTIONID1': {
            tradeID: '0xTRADEID1',
            type: CANCEL_ORDER
          }
        }
      },
      assertions: (store) => {
        store.dispatch(action.updateOrders(
          {
            '0xMARKETID': {
              1: [
                {
                  tradeid: '0xTRADEID1',
                }
              ]
            }
          },
          true
        ))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.REMOVE_ORDER
          }
        ]

        assert.deepEqual(actual, expected, `Didn't return the expected actions`)
      }
    })

    test({
      description: `should dispatch the expected actions WITH market info loaded AND IS NOT addition AND IS NOT cancelled`,
      state: {
        marketsData: {
          '0xMARKETID': {}
        },
        transactionsData: {}
      },
      assertions: (store) => {
        store.dispatch(action.updateOrders(
          {
            '0xMARKETID': {
              1: [
                {
                  tradeid: '0xTRADEID1'
                }
              ]
            }
          },
          false
        ))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.REMOVE_ORDER
          }
        ]

        assert.deepEqual(actual, expected, `Didn't return the expected actions`)
      }
    })

    test({
      description: `should dispatch the expected actions WITH market info loaded AND IS NOT addition AND IS cancelled`,
      state: {
        marketsData: {
          '0xMARKETID': {}
        },
        transactionsData: {
          '0xTRANSACTIONID1': {
            tradeID: '0xTRADEID1',
            type: CANCEL_ORDER
          }
        }
      },
      assertions: (store) => {
        store.dispatch(action.updateOrders(
          {
            '0xMARKETID': {
              1: [
                {
                  tradeid: '0xTRADEID1',
                }
              ]
            }
          },
          true
        ))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.REMOVE_ORDER
          }
        ]

        assert.deepEqual(actual, expected, `Didn't return the expected actions`)
      }
    })

    test({
      description: `should dispatch the expected actions WITH market info NOT loaded AND IS addition AND IS NOT cancelled`,
      state: {
        marketsData: {},
        transactionsData: {}
      },
      assertions: (store) => {
        store.dispatch(action.updateOrders(
          {
            '0xMARKETID': {
              1: [
                {
                  tradeid: '0xTRADEID1'
                }
              ]
            }
          },
          true
        ))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.ADD_ORDER
          },
          {
            type: MOCK_ACTION_TYPES.LOAD_MARKETS_INFO
          }
        ]

        assert.deepEqual(actual, expected, `Didn't return the expected actions`)
      }
    })

    test({
      description: `should dispatch the expected actions WITH market info NOT loaded AND IS addition AND IS cancelled`,
      state: {
        marketsData: {},
        transactionsData: {
          '0xTRANSACTIONID1': {
            tradeID: '0xTRADEID1',
            type: CANCEL_ORDER
          }
        }
      },
      assertions: (store) => {
        store.dispatch(action.updateOrders(
          {
            '0xMARKETID': {
              1: [
                {
                  tradeid: '0xTRADEID1'
                }
              ]
            }
          },
          true
        ))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.REMOVE_ORDER
          },
          {
            type: MOCK_ACTION_TYPES.LOAD_MARKETS_INFO
          }
        ]

        assert.deepEqual(actual, expected, `Didn't return the expected actions`)
      }
    })

    test({
      description: `should dispatch the expected actions WITH market info NOT loaded AND IS NOT addition AND IS NOT cancelled`,
      state: {
        marketsData: {},
        transactionsData: {}
      },
      assertions: (store) => {
        store.dispatch(action.updateOrders(
          {
            '0xMARKETID': {
              1: [
                {
                  tradeid: '0xTRADEID1'
                }
              ]
            }
          },
          false
        ))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.REMOVE_ORDER
          },
          {
            type: MOCK_ACTION_TYPES.LOAD_MARKETS_INFO
          }
        ]

        assert.deepEqual(actual, expected, `Didn't return the expected actions`)
      }
    })

    test({
      description: `should dispatch the expected actions WITH market info NOT loaded AND IS NOT addition AND IS cancelled`,
      state: {
        marketsData: {},
        transactionsData: {
          '0xTRANSACTIONID1': {
            tradeID: '0xTRADEID1',
            type: CANCEL_ORDER
          }
        }
      },
      assertions: (store) => {
        store.dispatch(action.updateOrders(
          {
            '0xMARKETID': {
              1: [
                {
                  tradeid: '0xTRADEID1'
                }
              ]
            }
          },
          false
        ))

        const actual = store.getActions()

        const expected = [
          {
            type: MOCK_ACTION_TYPES.REMOVE_ORDER
          },
          {
            type: MOCK_ACTION_TYPES.LOAD_MARKETS_INFO
          }
        ]

        assert.deepEqual(actual, expected, `Didn't return the expected actions`)
      }
    })
  })
})
