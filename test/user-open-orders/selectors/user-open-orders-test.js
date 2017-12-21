import { describe, it } from 'mocha'
import { assert } from 'chai'
import proxyquire from 'proxyquire'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { formatEtherTokens, formatShares, formatNone } from 'utils/format-number'
import { CLOSE_DIALOG_CLOSING } from 'modules/market/constants/close-dialog-status'
import speedomatic from 'speedomatic'

describe(`modules/user-open-orders/selectors/user-open-orders.js`, () => {
  proxyquire.noPreserveCache().noCallThru()
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  const state = {
    loginAccount: {
      address: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c'
    },
    orderCancellation: {
      order8: CLOSE_DIALOG_CLOSING
    }
  }
  const store = mockStore(state)
  const { selectUserOpenOrders } = proxyquire('../../../src/modules/user-open-orders/selectors/user-open-orders', {
    '../../../store': store
  })
  const { selectAllUserOpenOrderMarkets } = proxyquire('../../../src/modules/user-open-orders/selectors/user-open-orders', {
    '../../../store': store
  })
  it(`should return no user open orders for not logged-in user`, () => {
    const state = {
      loginAccount: {}
    }
    const store = mockStore(state)
    const { selectUserOpenOrders } = proxyquire('../../../src/modules/user-open-orders/selectors/user-open-orders', {
      '../../../store': store
    })

    state.orderBooks = {
      bobMarket: {
        0: {
          buy: {
            order1: {
              orderID: 'order1',
              price: '10',
              amount: '1',
              owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
              outcome: '1'
            }
          },
          sell: {
            order4: {
              orderID: 'order4',
              price: '40',
              amount: '4',
              owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
              outcome: '1'
            }
          }
        }
      }
    }

    assert.lengthOf(selectUserOpenOrders('1', 'bobMarket'), 0)
  })

  it(`should return no user open orders if there are no orders`, () => {
    assert.lengthOf(selectUserOpenOrders('1', 'bobMarket'), 0)
  })

  it(`should return empty user open orders if there are no matching orders`, () => {
    state.orderBooks = {
      bobMarket: {
        0: {
          buy: {
            order1: {
              orderID: 'order1',
              price: '10',
              amount: '1',
              owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
              outcome: '2'
            },
            order2: {
              orderID: 'order2',
              price: '20',
              amount: '2',
              owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
              outcome: '3'
            },
            order3: {
              orderID: 'order3',
              price: '30',
              amount: '3',
              owner: 'some other address',
              outcome: '1'
            }
          },
          sell: {
            order7: {
              orderID: 'order7',
              price: '70',
              amount: '7',
              owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
              outcome: '3'
            },
            order8: {
              orderID: 'order8',
              price: '80',
              amount: '8',
              owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
              outcome: '1'
            }
          }
        }
      }
    }
    assert.lengthOf(selectUserOpenOrders('1', 'bobMarket'), 0)
  })

  it(`should return user open orders for logged-in user who has orders`, () => {
    state.orderBooks = {
      testMarketId: {
        1: {
          buy: {
            order13: {
              orderID: 'order13',
              market: 'testMarketId',
              price: '20',
              amount: '2',
              owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
              outcome: '1'
            },
            order14: {
              orderID: 'order14',
              market: 'testMarketId',
              price: '10',
              amount: '1',
              owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
              outcome: '1'
            },
            order12: {
              orderID: 'order12',
              market: 'testMarketId',
              price: '40',
              amount: '4',
              owner: 'some other address',
              outcome: '1'
            },
            order11: {
              orderID: 'order11',
              market: 'testMarketId',
              price: '60',
              amount: '6',
              owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
              outcome: '1'
            }
          },
          sell: {
            order2: {
              orderID: 'order2',
              market: 'testMarketId',
              price: '70',
              amount: '7',
              owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
              outcome: '1'
            },
            order1: {
              orderID: 'order1',
              market: 'testMarketId',
              price: '100',
              amount: '10',
              owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
              outcome: '1'
            },
            order3: {
              orderID: 'order3',
              market: 'testMarketId',
              price: '10',
              amount: '10',
              owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
              outcome: '1'
            },
            order4: {
              orderID: 'order11',
              market: 'testMarketId',
              price: '110',
              amount: '11',
              owner: 'different owner',
              outcome: '1'
            }
          }
        }
      }
    }

    const userOpenOrders = selectUserOpenOrders('1', 'testMarketId')
    assert.lengthOf(userOpenOrders, 6)
    assert.deepEqual(userOpenOrders, [{
      id: 'order1',
      avgPrice: formatEtherTokens('100'),
      marketID: speedomatic.formatInt256('testMarketId'),
      type: 'sell',
      matchedShares: formatNone(),
      originalShares: formatNone(),
      unmatchedShares: formatShares('10')
    }, {
      id: 'order2',
      avgPrice: formatEtherTokens('70'),
      marketID: speedomatic.formatInt256('testMarketId'),
      type: 'sell',
      matchedShares: formatNone(),
      originalShares: formatNone(),
      unmatchedShares: formatShares('7')
    }, {
      id: 'order3',
      avgPrice: formatEtherTokens('10'),
      marketID: speedomatic.formatInt256('testMarketId'),
      type: 'sell',
      matchedShares: formatNone(),
      originalShares: formatNone(),
      unmatchedShares: formatShares('10')
    }, {
      id: 'order11',
      avgPrice: formatEtherTokens('60'),
      marketID: speedomatic.formatInt256('testMarketId'),
      type: 'buy',
      matchedShares: formatNone(),
      originalShares: formatNone(),
      unmatchedShares: formatShares('6')
    }, {
      id: 'order13',
      avgPrice: formatEtherTokens('20'),
      marketID: speedomatic.formatInt256('testMarketId'),
      type: 'buy',
      matchedShares: formatNone(),
      originalShares: formatNone(),
      unmatchedShares: formatShares('2')
    }, {
      id: 'order14',
      avgPrice: formatEtherTokens('10'),
      marketID: speedomatic.formatInt256('testMarketId'),
      type: 'buy',
      matchedShares: formatNone(),
      originalShares: formatNone(),
      unmatchedShares: formatShares('1')
    }])
  })

  it(`should return no user open orders markets`, () => {
    state.orderBooks = {}
    assert.lengthOf(selectAllUserOpenOrderMarkets(), [])
  })

  it(`should return one user open orders markets`, () => {
    state.orderBooks = {
      bobMarket: {
        0: {
          buy: {
            order1: {
              orderID: 'order1',
              price: '10',
              amount: '1',
              owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
              outcome: '2'
            }
          }
        }
      }
    }
    const userOpenOrderMarkets = selectAllUserOpenOrderMarkets()
    assert.lengthOf(userOpenOrderMarkets, 1)
    assert.deepEqual(userOpenOrderMarkets, ['bobMarket'])
  })
  it(`should return two user open orders markets`, () => {
    state.orderBooks = {
      bobMarket: {
        0: {
          buy: {
            order1: {
              orderID: 'order1',
              price: '10',
              amount: '1',
              owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
              outcome: '2'
            }
          }
        }
      },
      leeroyMarket: {
        1: {
          sell: {
            order3: {
              orderID: 'order3',
              price: '100',
              amount: '22'
            }
          }
        }
      }
    }
    const userOpenOrderMarkets = selectAllUserOpenOrderMarkets()
    assert.lengthOf(userOpenOrderMarkets, 2)
    assert.deepEqual(userOpenOrderMarkets, ['bobMarket', 'leeroyMarket'])
  })
  it(`should return no user open orders markets, user not logged in`, () => {
    state.loginAccount = {}
    state.orderBooks = {
      bobMarket: {
        0: {
          buy: {
            order1: {
              orderID: 'order1',
              price: '10',
              amount: '1',
              owner: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c',
              outcome: '2'
            }
          }
        }
      },
      leeroyMarket: {
        1: {
          sell: {
            order3: {
              orderID: 'order3',
              price: '100',
              amount: '22'
            }
          }
        }
      }
    }
    const userOpenOrderMarkets = selectAllUserOpenOrderMarkets()
    assert.lengthOf(userOpenOrderMarkets, 0)
    assert.deepEqual(userOpenOrderMarkets, [])
  })
})
