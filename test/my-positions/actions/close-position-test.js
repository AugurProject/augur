

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import proxyquire from 'proxyquire'
import sinon from 'sinon'
import { createBigNumber } from 'utils/create-big-number'

import { BUY, SELL } from 'modules/transactions/constants/types'

describe('modules/my-positions/actions/close-position.js', () => {
  proxyquire.noPreserveCache().noCallThru()

  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  const MOCK_ACTION_TYPES = {
    CLEAR_CLOSE_POSITION_OUTCOME: 'CLEAR_CLOSE_POSITION_OUTCOME',
    ADD_CLOSE_POSITION_TRADE_GROUP: 'ADD_CLOSE_POSITION_TRADE_GROUP',
  }
  const mockUpdateTradesInProgress = { updateTradesInProgress: () => {} }
  sinon.stub(mockUpdateTradesInProgress, 'updateTradesInProgress').callsFake((marketId, outcomeId, side, numShares, limitPrice, maxCost, cb) => (dispatch, getState) => cb())
  const mockClearClosePositionOutcome = {
    clearClosePositionOutcome: sinon.stub().returns({ type: MOCK_ACTION_TYPES.CLEAR_CLOSE_POSITION_OUTCOME }),
  }
  const mockPlaceTrade = { placeTrade: () => {} }
  const mockAddClosePositionTradeGroup = {
    addClosePositionTradeGroup: sinon.stub().returns({
      type: MOCK_ACTION_TYPES.ADD_CLOSE_POSITION_TRADE_GROUP,
    }),
  }

  const loadBidsAsks = (marketId, cb) => dispatch => cb()

  const mockSelectMarket = {
    selectMarket: sinon.stub().returns({
      id: '0xMARKETID',
      outcomes: [{ id: '1', position: { qtyShares: { value: 10 } } }],
    }),
  }

  const action = proxyquire('../../../src/modules/my-positions/actions/close-position.js', {
    '../../trade/actions/update-trades-in-progress': mockUpdateTradesInProgress,
    '../../trade/actions/place-trade': mockPlaceTrade,
    './add-close-position-trade-group': mockAddClosePositionTradeGroup,
    './clear-close-position-outcome': mockClearClosePositionOutcome,
    '../../bids-asks/actions/load-bids-asks': loadBidsAsks,
    '../../market/selectors/market': mockSelectMarket,
  })

  describe('closePosition', () => {

    afterEach(() => {
      mockPlaceTrade.placeTrade.restore()
    })

    const test = t => it(t.description, () => {
      const store = mockStore(t.state || {})
      sinon.stub(mockPlaceTrade, 'placeTrade').callsFake((marketId, outcomeId, tradesInProgress, doNotCreateOrders, cb) => (dispatch, getState) => {
        if (t.placeTradeFails) {
          cb(true)
        } else {
          cb(null, t.tradeGroupId)
        }
      })
      t.assertions(store)
    })

    test({
      description: `should dispatch the expected actions WITHOUT available orders`,
      state: {
        marketId: '0xMARKETID',
        outcomeId: '1',
        orderBooks: {
          '0xMARKETID': {
            [BUY]: {},
            [SELL]: {},
          },
        },
        loginAccount: {
          address: '0xUSERADDRESS',
        },
      },
      assertions: (store) => {
        const { marketId, outcomeId } = store.getState()
        store.dispatch(action.closePosition(marketId, outcomeId))
        const actual = store.getActions()
        const expected = [
          { type: MOCK_ACTION_TYPES.ADD_CLOSE_POSITION_TRADE_GROUP },
          { type: MOCK_ACTION_TYPES.CLEAR_CLOSE_POSITION_OUTCOME },
          { type: MOCK_ACTION_TYPES.ADD_CLOSE_POSITION_TRADE_GROUP },
        ]
        assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)
      },
    })

    test({
      description: `should dispatch the expected actions WITH available orders AND placeTrade fails`,
      state: {
        marketId: '0xMARKETID',
        outcomeId: '1',
        orderBooks: {
          '0xMARKETID': {
            1: {
              [BUY]: {
                '0xORDERID1': {
                  fullPrecisionAmount: '2',
                  fullPrecisionPrice: '0.3',
                },
                '0xORDERID2': {
                  fullPrecisionAmount: '13',
                  fullPrecisionPrice: '0.31',
                },
                '0xORDERID4': {
                  fullPrecisionAmount: '11',
                  fullPrecisionPrice: '0.8',
                  owner: '0xUSERADDRESS',
                },
              },
              [SELL]: {},
            },
            2: {
              [BUY]: {
                '0xORDERID3': {
                  fullPrecisionAmount: '11',
                  fullPrecisionPrice: '0.7',
                },
              },
              [SELL]: {},
            },
          },
        },
        tradesInProgress: {
          '0xMARKETID': {},
        },
        loginAccount: {
          address: '0xUSERADDRESS',
        },
        marketsData: {
          '0xMARKETID': {
            myPositionOutcomes: [{
              id: '1',
              position: { qtyShares: { value: 10 } },
            }],
          },
        },
      },
      placeTradeFails: true,
      assertions: (store) => {
        const { marketId, outcomeId } = store.getState()
        store.dispatch(action.closePosition(marketId, outcomeId))
        const actual = store.getActions()
        const expected = [
          { type: MOCK_ACTION_TYPES.ADD_CLOSE_POSITION_TRADE_GROUP },
          { type: MOCK_ACTION_TYPES.CLEAR_CLOSE_POSITION_OUTCOME },
          { type: MOCK_ACTION_TYPES.ADD_CLOSE_POSITION_TRADE_GROUP },
        ]
        assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)
      },
    })

    test({
      description: `should dispatch the expected actions WITH available orders AND placeTrade succeeds`,
      state: {
        marketId: '0xMARKETID',
        outcomeId: '1',
        accountPositions: {
          '0xMARKETID': {
            1: '10',
            2: '0',
            3: '0',
          },
        },
        orderBooks: {
          '0xMARKETID': {
            1: {
              [BUY]: {
                '0xORDERID1': {
                  fullPrecisionAmount: '2',
                  fullPrecisionPrice: '0.3',
                },
                '0xORDERID2': {
                  fullPrecisionAmount: '13',
                  fullPrecisionPrice: '0.31',
                },
                '0xORDERID4': {
                  fullPrecisionAmount: '11',
                  fullPrecisionPrice: '0.8',
                  owner: '0xUSERADDRESS',
                },
              },
              [SELL]: {},
            },
            2: {
              [BUY]: {
                '0xORDERID3': {
                  fullPrecisionAmount: '11',
                  fullPrecisionPrice: '0.7',
                },
              },
              [SELL]: {},
            },
          },
        },
        tradesInProgress: {
          '0xMARKETID': {},
        },
        loginAccount: {
          address: '0xUSERADDRESS',
        },
      },
      assertions: (store) => {
        const { marketId, outcomeId } = store.getState()
        store.dispatch(action.closePosition(marketId, outcomeId))
        const actual = store.getActions()
        const expected = [
          { type: MOCK_ACTION_TYPES.ADD_CLOSE_POSITION_TRADE_GROUP },
          { type: MOCK_ACTION_TYPES.CLEAR_CLOSE_POSITION_OUTCOME },
          { type: MOCK_ACTION_TYPES.ADD_CLOSE_POSITION_TRADE_GROUP },
        ]
        assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`)
      },
    })
  })

  describe('getBestFill', () => {
    const test = t => it(t.description, () => {
      const bestFill = action.getBestFill(t.state.orderBook, t.arguments.side, t.arguments.shares, t.arguments.marketId, t.arguments.outcomeId, t.arguments.userAddress)
      t.assertions(bestFill)
    })

    test({
      description: `-1 share position, empty order book`,
      state: {
        orderBook: {},
      },
      arguments: {
        side: SELL,
        shares: createBigNumber(-1).absoluteValue(),
        marketId: '0xMarketID1',
        outcomeId: '1',
        userAddress: '0xUSERADDRESS',
      },
      assertions: (bestFill) => {
        assert.deepEqual(bestFill, {
          amountOfShares: createBigNumber(0),
          price: createBigNumber(0),
        })
      },
    })

    test({
      description: `1 share position, empty order book`,
      state: {
        orderBook: {},
      },
      arguments: {
        side: BUY,
        shares: createBigNumber(1).absoluteValue(),
        marketId: '0xMarketID1',
        outcomeId: '1',
        userAddress: '0xUSERADDRESS',
      },
      assertions: (bestFill) => {
        assert.deepEqual(bestFill, {
          amountOfShares: createBigNumber(0),
          price: createBigNumber(0),
        })
      },
    })

    test({
      description: `10 shares position, sufficent order book depth to fully close`,
      state: {
        orderBook: {
          [BUY]: {
            '0xOrderID1': {
              fullPrecisionAmount: '2',
              fullPrecisionPrice: '0.11',
            },
            '0xOrderID2': {
              fullPrecisionAmount: '8',
              fullPrecisionPrice: '0.2',
            },
            '0xOrderID3': {
              fullPrecisionAmount: '8',
              fullPrecisionPrice: '0.8',
              owner: '0xUSERADDRESS',
            },
          },
        },
      },
      arguments: {
        side: BUY,
        shares: createBigNumber(10).absoluteValue(),
        marketId: '0xMarketID1',
        outcomeId: '1',
        userAddress: '0xUSERADDRESS',
      },
      assertions: (bestFill) => {
        assert.deepEqual(bestFill, {
          amountOfShares: createBigNumber(10),
          price: createBigNumber(0.11),
        })
      },
    })

    test({
      description: `10 shares position, sufficent order book depth for a partial close`,
      state: {
        orderBook: {
          [BUY]: {
            '0xOrderID1': {
              fullPrecisionAmount: '2',
              fullPrecisionPrice: '0.11',
            },
            '0xOrderID2': {
              fullPrecisionAmount: '1',
              fullPrecisionPrice: '0.10',
            },
            '0xOrderID3': {
              fullPrecisionAmount: '8',
              fullPrecisionPrice: '0.8',
              owner: '0xUSERADDRESS',
            },
          },
        },
      },
      arguments: {
        side: BUY,
        shares: createBigNumber(10).absoluteValue(),
        marketId: '0xMarketID1',
        outcomeId: '1',
        userAddress: '0xUSERADDRESS',
      },
      assertions: (bestFill) => {
        assert.deepEqual(bestFill, {
          amountOfShares: createBigNumber(3),
          price: createBigNumber(0.10),
        })
      },
    })

    test({
      description: `-10 shares position, sufficent order book depth to fully close`,
      state: {
        orderBook: {
          [SELL]: {
            '0xOrderID1': {
              fullPrecisionAmount: '2',
              fullPrecisionPrice: '0.11',
            },
            '0xOrderID2': {
              fullPrecisionAmount: '8',
              fullPrecisionPrice: '0.2',
            },
            '0xOrderID3': {
              fullPrecisionAmount: '8',
              fullPrecisionPrice: '0.01',
              owner: '0xUSERADDRESS',
            },
          },
        },
      },
      arguments: {
        side: SELL,
        shares: createBigNumber(-10).absoluteValue(),
        marketId: '0xMarketID1',
        outcomeId: '1',
        userAddress: '0xUSERADDRESS',
      },
      assertions: (bestFill) => {
        assert.deepEqual(bestFill, {
          amountOfShares: createBigNumber(10),
          price: createBigNumber(0.2),
        })
      },
    })

    test({
      description: `-10 shares position, sufficent order book depth for a partial close`,
      state: {
        orderBook: {
          [SELL]: {
            '0xOrderID1': {
              fullPrecisionAmount: '2',
              fullPrecisionPrice: '0.11',
            },
            '0xOrderID2': {
              fullPrecisionAmount: '1',
              fullPrecisionPrice: '0.10',
            },
            '0xOrderID3': {
              fullPrecisionAmount: '8',
              fullPrecisionPrice: '0.01',
              owner: '0xUSERADDRESS',
            },
          },
        },
      },
      arguments: {
        side: SELL,
        shares: createBigNumber(-10).absoluteValue(),
        marketId: '0xMarketID1',
        outcomeId: '1',
        userAddress: '0xUSERADDRESS',
      },
      assertions: (bestFill) => {
        assert.deepEqual(bestFill, {
          amountOfShares: createBigNumber(3),
          price: createBigNumber(0.11),
        })
      },
    })
  })
})
