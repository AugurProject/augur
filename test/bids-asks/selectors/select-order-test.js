

import { BUY } from 'modules/transactions/constants/types'

describe('modules/bids-asks/selectors/select-order.js', () => {
  const selectOrder = require('../../../src/modules/bids-asks/selectors/select-order').default
  it(`shouldn't return order if it's not there`, () => {
    assert.isNull(selectOrder('orderId', 'marketId', 2, BUY, {}))
  })
  it(`should return order if it's there`, () => {
    const order = selectOrder('0x1', 'MARKET_1', 2, BUY, {
      MARKET_1: {
        2: {
          buy: {
            '0x1': {
              amount: '1.1111',
              fullPrecisionAmount: '1.1111111',
              price: '0.7778',
              fullPrecisionPrice: '0.7777777',
              owner: '0x0000000000000000000000000000000000000b0b',
              tokensEscrowed: '0.8641974',
              sharesEscrowed: '0',
              betterOrderId: '0x000000000000000000000000000000000000000000000000000000000000000a',
              worseOrderId: '0x000000000000000000000000000000000000000000000000000000000000000b',
              gasPrice: '20000000000',
            },
          },
        },
      },
    })
    assert.deepEqual(order, {
      amount: '1.1111',
      fullPrecisionAmount: '1.1111111',
      price: '0.7778',
      fullPrecisionPrice: '0.7777777',
      owner: '0x0000000000000000000000000000000000000b0b',
      tokensEscrowed: '0.8641974',
      sharesEscrowed: '0',
      betterOrderId: '0x000000000000000000000000000000000000000000000000000000000000000a',
      worseOrderId: '0x000000000000000000000000000000000000000000000000000000000000000b',
      gasPrice: '20000000000',
    })
  })
})
