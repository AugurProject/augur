

import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import proxyquire from 'proxyquire'

describe(`modules/user-open-orders/selectors/select-account-order-markets.js`, () => {
  proxyquire.noPreserveCache().noCallThru()
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  const test = (t) => {
    it(t.description, () => {
      const store = mockStore(t.state || {})
      t.assertions(store)
    })
  }

  describe(`userOpenMarkets`, () => {
    const { selectAllUserOpenOrderMarkets } = require('modules/user-open-orders/selectors/select-account-order-markets')
    test({
      description: `should return one user open orders markets`,
      state: {
        loginAccount: { address: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c' },
        orderBooks: {
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
              },
            },
          },
        },
      },
      assertions: (store) => {
        const userOpenOrderMarkets = selectAllUserOpenOrderMarkets(store.getState())
        assert.lengthOf(userOpenOrderMarkets, 1)
        assert.deepEqual(userOpenOrderMarkets, ['bobMarket'])
      },
    })
  })

  it(`should return no user open orders markets`, () => {
    const { selectAllUserOpenOrderMarkets } = require('modules/user-open-orders/selectors/select-account-order-markets')
    test({
      description: `should return no open order markets`,
      state: {
        loginAccount: { address: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c' },
      },
      assertions: (store) => {
        const userOpenOrderMarkets = selectAllUserOpenOrderMarkets(store.getState())
        assert.lengthOf(userOpenOrderMarkets, 0)
      },
    })
    assert.lengthOf(selectAllUserOpenOrderMarkets, [])
  })

  it(`should return one user open orders markets`, () => {
    const { selectAllUserOpenOrderMarkets } = require('modules/user-open-orders/selectors/select-account-order-markets')
    test({
      description: `should return two user open orders markets`,
      state: {
        loginAccount: { address: '0x7c0d52faab596c08f484e3478aebc6205f3f5d8c' },
        orderBooks: {
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
              },
            },
          },
          leeroyMarket: {
            1: {
              sell: {
                order3: {
                  orderId: 'order3',
                  price: '100',
                  amount: '22',
                },
              },
            },
          },
        },
      },
      assertions: (store) => {
        const userOpenOrderMarkets = selectAllUserOpenOrderMarkets()
        assert.lengthOf(userOpenOrderMarkets, 1)
        assert.deepEqual(userOpenOrderMarkets, ['bobMarket'])
      },
    })
  })

  it(`should return no user open orders markets because not logged in`, () => {
    const { selectAllUserOpenOrderMarkets } = require('modules/user-open-orders/selectors/select-account-order-markets')
    test({
      description: `should return no user open orders markets because not logged in`,
      state: {
        loginAccount: { address: '' },
        orderBooks: {
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
              },
            },
          },
          leeroyMarket: {
            1: {
              sell: {
                order3: {
                  orderId: 'order3',
                  price: '100',
                  amount: '22',
                },
              },
            },
          },
        },
      },
      assertions: (store) => {
        const userOpenOrderMarkets = selectAllUserOpenOrderMarkets()
        assert.lengthOf(userOpenOrderMarkets, 0)
      },
    })
  })
})
