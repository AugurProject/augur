

import sinon from 'sinon'
import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
import { createBigNumber } from 'utils/create-big-number'

import { selectAggregateOrderBook, selectTopBid, selectTopAsk, __RewireAPI__ as selectOrderBookRewireAPI } from 'modules/bids-asks/helpers/select-order-book'

import { formatShares, formatEther } from 'utils/format-number'

import { CLOSE_DIALOG_CLOSING } from 'modules/market/constants/close-dialog-status'

describe('modules/bids-asks/helpers/select-order-book.js', () => {
  const mockStore = configureMockStore([thunk])
  const test = t => it(t.description, (done) => {
    const store = mockStore(t.state || {})
    selectOrderBookRewireAPI.__Rewire__('store', store)
    t.assertions(done, store)
  })

  afterEach(() => {
    selectOrderBookRewireAPI.__ResetDependency__('store')
  })

  describe('selectAggregateOrderBook', () => {
    test({
      description: `should return the expected object when 'marketOrderBook' is null`,
      assertions: (done) => {
        const actual = selectAggregateOrderBook('1', null, {})

        const expected = {
          bids: [],
          asks: [],
        }

        assert.deepEqual(actual, expected, `didn't return the expected object`)

        done()
      },
    })

    test({
      description: `should return the expected object when 'marketOrderBook' is null`,
      assertions: (done) => {
        const selectAggregatePricePoints = sinon.stub().returns(['test'])
        selectOrderBookRewireAPI.__Rewire__('selectAggregatePricePoints', selectAggregatePricePoints)

        const actual = selectAggregateOrderBook('1', { buy: [], sell: [] }, {})

        const expected = {
          bids: ['test'],
          asks: ['test'],
        }

        assert.deepEqual(actual, expected, `didn't return the expected object`)

        selectOrderBookRewireAPI.__ResetDependency__('selectAggregatePricePoints')

        done()
      },
    })
  })

  describe('selectTopBid', () => {
    const marketOrderBook = {
      bids: [
        {
          isOfCurrentUser: true,
          price: '0.4',
        },
        {
          price: '0.3',
        },
        {
          price: '0.2',
        },
        {
          price: '0.1',
        },
      ],
    }

    test({
      description: `should return null when not bids exist and including current user`,
      assertions: (done) => {
        const actual = selectTopBid({ bids: [] })

        const expected = null

        assert.strictEqual(actual, expected, `didn't return the expected top bid`)

        done()
      },
    })

    test({
      description: `should return null when not bids exist and excluding current user`,
      assertions: (done) => {
        const actual = selectTopBid({ bids: [] }, true)

        const expected = null

        assert.strictEqual(actual, expected, `didn't return the expected top bid`)

        done()
      },
    })

    test({
      description: `should return the topBid, including current user`,
      assertions: (done) => {
        const actual = selectTopBid(marketOrderBook)

        const expected = {
          isOfCurrentUser: true,
          price: '0.4',
        }

        assert.deepEqual(actual, expected, `didn't return the expected top bid`)

        done()
      },
    })

    test({
      description: `should return the topBid, excluding current user`,
      assertions: (done) => {
        const actual = selectTopBid(marketOrderBook, true)

        const expected = {
          price: '0.3',
        }

        assert.deepEqual(actual, expected, `didn't return the expected top bid`)

        done()
      },
    })
  })

  describe('selectTopAsk', () => {
    const marketOrderBook = {
      asks: [
        {
          isOfCurrentUser: true,
          price: '0.5',
        },
        {
          price: '0.6',
        },
        {
          price: '0.7',
        },
        {
          price: '0.8',
        },
      ],
    }

    test({
      description: `should return null when not asks exist and including current user`,
      assertions: (done) => {
        const actual = selectTopAsk({ asks: [] })

        const expected = null

        assert.strictEqual(actual, expected, `didn't return the expected top bid`)

        done()
      },
    })

    test({
      description: `should return null when not asks exist and excluding current user`,
      assertions: (done) => {
        const actual = selectTopAsk({ asks: [] }, true)

        const expected = null

        assert.strictEqual(actual, expected, `didn't return the expected top bid`)

        done()
      },
    })

    test({
      description: `should return the topAsk, including current user`,
      assertions: (done) => {
        const actual = selectTopAsk(marketOrderBook)

        const expected = {
          isOfCurrentUser: true,
          price: '0.5',
        }

        assert.deepEqual(actual, expected, `didn't return the expected top bid`)

        done()
      },
    })

    test({
      description: `should return the topAsk, excluding current user`,
      assertions: (done) => {
        const actual = selectTopAsk(marketOrderBook, true)

        const expected = {
          price: '0.6',
        }

        assert.deepEqual(actual, expected, `didn't return the expected top bid`)

        done()
      },
    })
  })

  describe('selectAggregatePricePoints', () => {
    test({
      description: `should return an empty array when the orders array is null`,
      assertions: (done) => {
        const selectAggregatePricePoints = selectOrderBookRewireAPI.__get__('selectAggregatePricePoints')
        const actual = selectAggregatePricePoints('1', null, {})

        const expected = []

        assert.deepEqual(actual, expected, `didn't return the expected array`)

        done()
      },
    })

    test({
      description: `should return an empty array when the orders array is null`,
      assertions: (done) => {
        const selectAggregatePricePoints = selectOrderBookRewireAPI.__get__('selectAggregatePricePoints')
        const actual = selectAggregatePricePoints('1', undefined, {})

        const expected = []

        assert.deepEqual(actual, expected, `didn't return the expected array`)

        done()
      },
    })

    test({
      description: `should return an empty array when the orders array is null`,
      state: {
        loginAccount: {
          address: '0xtest',
        },
      },
      assertions: (done, store) => {
        const selectAggregatePricePoints = selectOrderBookRewireAPI.__get__('selectAggregatePricePoints')

        const orders = {
          1: {
            buy: {
              '0xorder1': {
                fullPrecisionPrice: '0.1',
                fullPrecisionAmount: '1',
                sharesEscrowed: '1',
                tokensEscrowed: '0',
              },
              '0xorder2': {
                fullPrecisionPrice: '0.1',
                fullPrecisionAmount: '1',
                sharesEscrowed: '0',
                tokensEscrowed: '0.1',
              },
              '0xorder3': {
                fullPrecisionPrice: '0.2',
                fullPrecisionAmount: '1',
                sharesEscrowed: '0',
                tokensEscrowed: '0.2',
              },
              '0xorder4': {
                fullPrecisionPrice: '0.2',
                fullPrecisionAmount: '1',
                sharesEscrowed: '0',
                tokensEscrowed: '0.2',
              },
              '0xorder5': {
                owner: '0xtest',
                fullPrecisionPrice: '0.2',
                fullPrecisionAmount: '1',
                sharesEscrowed: '1',
                tokensEscrowed: '0',
              },
              '0xorder6': {
                fullPrecisionPrice: '0.3',
                fullPrecisionAmount: '1',
                sharesEscrowed: '1',
                tokensEscrowed: '0',
              },
            },
          },
        }

        const actual = selectAggregatePricePoints('1', 'buy', orders, { '0xorder5': CLOSE_DIALOG_CLOSING })

        const expected = [
          {
            isOfCurrentUser: false,
            shares: formatShares('2'),
            price: formatEther('0.1'),
            sharesEscrowed: formatShares('1'),
            tokensEscrowed: formatEther('0.1'),
          },
          {
            isOfCurrentUser: true,
            shares: formatShares('3'),
            price: formatEther('0.2'),
            sharesEscrowed: formatShares('1'),
            tokensEscrowed: formatEther('0.4'),
          },
          {
            isOfCurrentUser: false,
            shares: formatShares('1'),
            price: formatEther('0.3'),
            sharesEscrowed: formatShares('1'),
            tokensEscrowed: formatEther('0'),
          },
        ]

        assert.deepEqual(actual, expected, `didn't return the expected array`)

        done()
      },
    })
  })

  describe('reduceSharesCountByPrice', () => {
    test({
      description: `should return the expected object when previous is empty`,
      assertions: (done) => {
        const reduceSharesCountByPrice = selectOrderBookRewireAPI.__get__('reduceSharesCountByPrice')
        const actual = reduceSharesCountByPrice({}, {
          isOfCurrentUser: false,
          outcome: '1',
          fullPrecisionPrice: '0.1',
          fullPrecisionAmount: '1',
          sharesEscrowed: '1',
          tokensEscrowed: '0',
        })

        const expected = {
          0.1: {
            isOfCurrentUser: false,
            shares: createBigNumber('1'),
            sharesEscrowed: createBigNumber('1'),
            tokensEscrowed: createBigNumber('0'),
          },
        }

        assert.deepEqual(actual, expected, `didn't return the expected object`)

        done()
      },
    })

    test({
      description: `should return the expected object when a pervious order is passed in`,
      assertions: (done) => {
        const reduceSharesCountByPrice = selectOrderBookRewireAPI.__get__('reduceSharesCountByPrice')
        const actual = reduceSharesCountByPrice({
          0.1: {
            isOfCurrentUser: false,
            shares: createBigNumber('1'),
            sharesEscrowed: createBigNumber('0'),
            tokensEscrowed: createBigNumber('0.1'),
          },
        }, {
          isOfCurrentUser: true,
          outcome: '1',
          fullPrecisionPrice: '0.1',
          fullPrecisionAmount: '1',
          sharesEscrowed: '1',
          tokensEscrowed: '0',
        })

        const expected = {
          0.1: {
            isOfCurrentUser: true,
            shares: createBigNumber('2'),
            sharesEscrowed: createBigNumber('1'),
            tokensEscrowed: createBigNumber('0.1'),
          },
        }

        assert.deepEqual(actual, expected, `didn't return the expected object`)

        done()
      },
    })

    test({
      description: `should return the expected object when a pervious order at a different price passed in`,
      assertions: (done) => {
        const reduceSharesCountByPrice = selectOrderBookRewireAPI.__get__('reduceSharesCountByPrice')
        const actual = reduceSharesCountByPrice({
          0.1: {
            isOfCurrentUser: false,
            shares: createBigNumber('1'),
            sharesEscrowed: createBigNumber('1'),
            tokensEscrowed: createBigNumber('0'),
          },
        }, {
          isOfCurrentUser: false,
          outcome: '1',
          fullPrecisionPrice: '0.2',
          fullPrecisionAmount: '1',
          sharesEscrowed: '0',
          tokensEscrowed: '0.2',
        })

        const expected = {
          0.1: {
            isOfCurrentUser: false,
            shares: createBigNumber('1'),
            sharesEscrowed: createBigNumber('1'),
            tokensEscrowed: createBigNumber('0'),
          },
          0.2: {
            isOfCurrentUser: false,
            shares: createBigNumber('1'),
            sharesEscrowed: createBigNumber('0'),
            tokensEscrowed: createBigNumber('0.2'),
          },
        }

        assert.deepEqual(actual, expected, `didn't return the expected object`)

        done()
      },
    })

    test({
      description: `should return the previous aggregated orders if new order is malformed`,
      assertions: (done) => {
        console.debug = () => {}

        const reduceSharesCountByPrice = selectOrderBookRewireAPI.__get__('reduceSharesCountByPrice')
        const actual = reduceSharesCountByPrice({
          0.1: {
            isOfCurrentUser: false,
            shares: createBigNumber('1'),
          },
        }, {
          isOfCurrentUser: false,
          outcome: '1',
          fullPrecisionAmount: '1',
        })

        const expected = {
          0.1: {
            isOfCurrentUser: false,
            shares: createBigNumber('1'),
          },
        }

        assert.deepEqual(actual, expected, `didn't return the expected object`)

        done()
      },
    })
  })

  describe('sortPricePointsByPriceAsc', () => {
    test({
      description: `should return the expected value`,
      assertions: (done) => {
        const sortPricePointsByPriceAsc = selectOrderBookRewireAPI.__get__('sortPricePointsByPriceAsc')

        const actual = sortPricePointsByPriceAsc({
          price: formatShares('1'),
        }, {
          price: formatShares('2'),
        })

        const expected = -1

        assert.strictEqual(actual, expected, `didn't return the expected number`)

        done()
      },
    })
  })

  describe('sortPricePointsByPriceDesc', () => {
    test({
      description: `should return the expected value`,
      assertions: (done) => {
        const sortPricePointsByPriceDesc= selectOrderBookRewireAPI.__get__('sortPricePointsByPriceDesc')

        const actual = sortPricePointsByPriceDesc({
          price: formatShares('1'),
        }, {
          price: formatShares('2'),
        })

        const expected = 1

        assert.strictEqual(actual, expected, `didn't return the expected number`)

        done()
      },
    })
  })
})
