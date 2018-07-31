

import proxyquire from 'proxyquire'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { formatEther, formatShares, formatNone } from 'utils/format-number'
import { CLOSE_DIALOG_CLOSING } from 'modules/market/constants/close-dialog-status'

describe(`modules/user-open-orders/selectors/user-open-orders.js`, () => {
  proxyquire.noPreserveCache().noCallThru()
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  const state = {
    loginAccount: {
      address: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
    },
    orderCancellation: {
      order8: CLOSE_DIALOG_CLOSING,
    },
  }
  const store = mockStore(state)
  const { selectUserOpenOrders } = proxyquire('../../../src/modules/user-open-orders/selectors/user-open-orders', {
    '../../../store': store,
  })

  it(`should return no user open orders for not logged-in user`, () => {
    const state = {
      loginAccount: {},
    }
    const store = mockStore(state)
    const { selectUserOpenOrders } = proxyquire('../../../src/modules/user-open-orders/selectors/user-open-orders', {
      '../../../store': store,
    })

    const orderBooks = {
      bobMarket: {
        0: {
          buy: {
            order1: {
              orderId: 'order1',
              price: '10',
              amount: '1',
              owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
              outcome: '1',
            },
          },
          sell: {
            order4: {
              orderId: 'order4',
              price: '40',
              amount: '4',
              owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
              outcome: '1',
            },
          },
        },
      },
    }

    assert.lengthOf(selectUserOpenOrders('1', orderBooks), 0)
  })

  it(`should return no user open orders if there are no orders`, () => {
    assert.lengthOf(selectUserOpenOrders('1', 'bobMarket'), 0)
  })

  it(`should return empty user open orders if there are no matching orders`, () => {
    const orderBooks = {
      bobMarket: {
        0: {
          buy: {
            order1: {
              orderId: 'order1',
              price: '10',
              amount: '1',
              owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
              outcome: '2',
            },
            order2: {
              orderId: 'order2',
              price: '20',
              amount: '2',
              owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
              outcome: '3',
            },
            order3: {
              orderId: 'order3',
              price: '30',
              amount: '3',
              owner: 'some other address',
              outcome: '1',
            },
          },
          sell: {
            order7: {
              orderId: 'order7',
              price: '70',
              amount: '7',
              owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
              outcome: '3',
            },
            order8: {
              orderId: 'order8',
              price: '80',
              amount: '8',
              owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
              outcome: '1',
            },
          },
        },
      },
    }
    assert.lengthOf(selectUserOpenOrders('1', orderBooks), 0)
  })

  it(`should return user open orders for logged-in user who has orders`, () => {
    const orderBooks = {
      1: {
        buy: {
          order13: {
            orderId: 'order13',
            price: '20',
            amount: '2',
            owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
            orderState: 'OPEN',
            outcome: '1',
          },
          order14: {
            orderId: 'order14',
            price: '10',
            amount: '1',
            owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
            orderState: 'OPEN',
            outcome: '1',
          },
          order12: {
            orderId: 'order12',
            price: '40',
            amount: '4',
            owner: 'some other address',
            orderState: 'OPEN',
            outcome: '1',
          },
          order11: {
            orderId: 'order11',
            price: '60',
            amount: '6',
            owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
            orderState: 'OPEN',
            outcome: '1',
          },
        },
        sell: {
          order2: {
            orderId: 'order2',
            price: '70',
            amount: '7',
            owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
            orderState: 'OPEN',
            outcome: '1',
          },
          order1: {
            orderId: 'order1',
            price: '100',
            amount: '10',
            owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
            orderState: 'OPEN',
            outcome: '1',
          },
          order3: {
            orderId: 'order3',
            price: '10',
            amount: '10',
            owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
            orderState: 'OPEN',
            outcome: '1',
          },
          order4: {
            orderId: 'order11',
            market: 'testMarketId',
            price: '110',
            amount: '11',
            owner: 'different owner',
            orderState: 'OPEN',
            outcome: '1',
          },
        },
      },
    }

    const userOpenOrders = selectUserOpenOrders('MARKET_ID', '1', orderBooks)
    assert.lengthOf(userOpenOrders, 6)

    const results =[{
      id: 'order1',
      avgPrice: formatEther('100'),
      type: 'sell',
      matchedShares: formatNone(),
      originalShares: formatNone(),
      unmatchedShares: formatShares('10'),
      marketId: 'MARKET_ID',
      outcomeId: '1',
      cancelOrder: () => { },
    }, {
      id: 'order2',
      avgPrice: formatEther('70'),
      type: 'sell',
      matchedShares: formatNone(),
      originalShares: formatNone(),
      unmatchedShares: formatShares('7'),
      marketId: 'MARKET_ID',
      outcomeId: '1',
      cancelOrder: () => { },
    }, {
      id: 'order3',
      avgPrice: formatEther('10'),
      type: 'sell',
      matchedShares: formatNone(),
      originalShares: formatNone(),
      unmatchedShares: formatShares('10'),
      marketId: 'MARKET_ID',
      outcomeId: '1',
      cancelOrder: () => { },
    }, {
      id: 'order11',
      avgPrice: formatEther('60'),
      type: 'buy',
      matchedShares: formatNone(),
      originalShares: formatNone(),
      unmatchedShares: formatShares('6'),
      marketId: 'MARKET_ID',
      outcomeId: '1',
      cancelOrder: () => { },
    }, {
      id: 'order13',
      avgPrice: formatEther('20'),
      type: 'buy',
      matchedShares: formatNone(),
      originalShares: formatNone(),
      unmatchedShares: formatShares('2'),
      marketId: 'MARKET_ID',
      outcomeId: '1',
      cancelOrder: () => { },
    }, {
      id: 'order14',
      avgPrice: formatEther('10'),
      type: 'buy',
      matchedShares: formatNone(),
      originalShares: formatNone(),
      unmatchedShares: formatShares('1'),
      marketId: 'MARKET_ID',
      outcomeId: '1',
      cancelOrder: () => { },
    }]

    for (let i = 0; i < results.length; i++) {
      const expected = results[i]
      const actual = userOpenOrders[i]

      assert.deepEqual(actual.id, expected.id, `id Didn't return the expected object`)
      assert.deepEqual(actual.type, expected.type, `type Didn't return the expected object`)
      assert.deepEqual(actual.matchedShares, expected.matchedShares, `matchedShares Didn't return the expected object`)
      assert.deepEqual(actual.originalShares, expected.originalShares, `originalShares Didn't return the expected object`)
      assert.deepEqual(actual.unmatchedShares, expected.unmatchedShares, `unmatchedShares Didn't return the expected object`)
      assert.deepEqual(actual.marketId, expected.marketId, `marketId Didn't return the expected object`)
      assert.strictEqual(actual.outcomeId, expected.outcomeId, `outcomeId Didn't return the expected value`)
      assert.isFunction(actual.cancelOrder, `cancelOrder Didn't return a function as expected`)

    }


  })
})
