

import { formatShares, formatEther } from 'utils/format-number'

describe(`modules/bids-asks/helpers/select-order-book.js`, () => {
  const { selectAggregateOrderBook } = require('../../../src/modules/bids-asks/helpers/select-order-book')

  it(`should return empty order book for no orders`, () => {
    const orderBook = selectAggregateOrderBook('1', null, {})

    assert.isArray(orderBook.bids)
    assert.isArray(orderBook.asks)
    assert.lengthOf(orderBook.bids, 0)
    assert.lengthOf(orderBook.asks, 0)
  })

  it(`should return aggregate sorted orders for specified outcome`, () => {
    const orderBook = selectAggregateOrderBook('1', {
      1: {
        buy: {
          order2: {
            fullPrecisionAmount: '4',
            fullPrecisionPrice: '0.2',
            outcome: '1',
            sharesEscrowed: '4',
            tokensEscrowed: '0',
          },
          order3: {
            fullPrecisionAmount: '6',
            fullPrecisionPrice: '0.2',
            outcome: '1',
            sharesEscrowed: '0',
            tokensEscrowed: '1.2',
          },
          order4: {
            fullPrecisionAmount: '2',
            fullPrecisionPrice: '0.1',
            outcome: '1',
            sharesEscrowed: '0',
            tokensEscrowed: '0.2',
          },
          order6: {
            fullPrecisionAmount: '10',
            fullPrecisionPrice: '0.4',
            outcome: '1',
            sharesEscrowed: '10',
            tokensEscrowed: '0',
          },
          order8: {
            fullPrecisionAmount: '14',
            fullPrecisionPrice: '0.1',
            outcome: '1',
            sharesEscrowed: '0',
            tokensEscrowed: '1.4',
          },
        },
        sell: {
          order10: {
            fullPrecisionAmount: '6',
            fullPrecisionPrice: '0.7',
            outcome: '1',
            sharesEscrowed: '0',
            tokensEscrowed: '1.8',
          },
          order20: {
            fullPrecisionAmount: '4',
            fullPrecisionPrice: '0.7',
            outcome: '1',
            sharesEscrowed: '4',
            tokensEscrowed: '0',
          },
          order30: {
            fullPrecisionAmount: '2',
            fullPrecisionPrice: '0.8',
            outcome: '1',
            sharesEscrowed: '0',
            tokensEscrowed: '0.4',
          },
          order60: {
            fullPrecisionAmount: '10',
            fullPrecisionPrice: '0.6',
            outcome: '1',
            sharesEscrowed: '0',
            tokensEscrowed: '4',
          },
          order80: {
            fullPrecisionAmount: '13',
            fullPrecisionPrice: '0.6',
            outcome: '1',
            sharesEscrowed: '13',
            tokensEscrowed: '0',
          },
          order90: {
            fullPrecisionAmount: '14',
            fullPrecisionPrice: '0.5',
            outcome: '1',
            sharesEscrowed: '14',
            tokensEscrowed: '0',
          },
        },
      },
    }, {})

    assert.lengthOf(orderBook.bids, 3)
    assert.lengthOf(orderBook.asks, 4)

    assert.deepEqual(orderBook.bids[0], {
      price: formatEther(0.4),
      shares: formatShares(10),
      isOfCurrentUser: false,
      sharesEscrowed: formatShares(10),
      tokensEscrowed: formatEther(0),
    }, 'first bid')
    assert.deepEqual(orderBook.bids[1], {
      price: formatEther(0.2),
      shares: formatShares(10),
      isOfCurrentUser: false,
      sharesEscrowed: formatShares('4'),
      tokensEscrowed: formatEther('1.2'),
    }, 'second bid')
    assert.deepEqual(orderBook.bids[2], {
      price: formatEther(0.1),
      shares: formatShares(16),
      isOfCurrentUser: false,
      sharesEscrowed: formatShares(0),
      tokensEscrowed: formatEther('1.6'),
    }, 'third bid')

    assert.deepEqual(orderBook.asks[0], {
      price: formatEther(0.5),
      shares: formatShares(14),
      isOfCurrentUser: false,
      sharesEscrowed: formatShares('14'),
      tokensEscrowed: formatEther('0'),
    }, 'first ask')
    assert.deepEqual(orderBook.asks[1], {
      price: formatEther(0.6),
      shares: formatShares(23),
      isOfCurrentUser: false,
      sharesEscrowed: formatShares('13'),
      tokensEscrowed: formatEther('4'),
    }, 'second ask')
    assert.deepEqual(orderBook.asks[2], {
      price: formatEther(0.7),
      shares: formatShares(10),
      isOfCurrentUser: false,
      sharesEscrowed: formatShares('4'),
      tokensEscrowed: formatEther('1.8'),
    }, 'third ask')
    assert.deepEqual(orderBook.asks[3], {
      price: formatEther(0.8),
      shares: formatShares(2),
      isOfCurrentUser: false,
      sharesEscrowed: formatShares(0),
      tokensEscrowed: formatEther('0.4'),
    }, 'fourth ask')
  })
})
