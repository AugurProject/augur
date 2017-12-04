import { describe, it } from 'mocha'
import { assert } from 'chai'
import mocks from 'test/mockStore'

// import { BUY, SELL } from 'modules/transactions/constants/types';

import { formatEtherTokens, formatPercent } from 'utils/format-number'

describe('modules/trade/helpers/generate-trade.js', () => {
  const { state } = mocks
  const { generateTrade } = require('modules/trade/helpers/generate-trade')
  const trade = generateTrade(state.marketsData.testMarketID, state.outcomesData.testMarketID['1'], state.tradesInProgress.testMarketID, state.orderBooks.testMarketID)

  it('should generate trade object', () => {
    assert.deepEqual(trade, {
      gasFeesRealEth: {
        denomination: '',
        formatted: '',
        formattedValue: 0,
        full: '',
        minimized: '',
        rounded: '',
        roundedValue: 0,
        value: 0
      },
      limitPrice: '0.50',
      numShares: 5000,
      maxNumShares: {
        denomination: ' shares',
        formatted: '0',
        formattedValue: 0,
        full: '0 shares',
        minimized: '0',
        rounded: '0',
        roundedValue: 0,
        value: 0
      },
      potentialEthProfit: formatEtherTokens(7500),
      potentialEthLoss: formatEtherTokens(2500),
      potentialProfitPercent: formatPercent(300),
      potentialLossPercent: formatPercent(100),
      side: 'buy',
      totalCost: formatEtherTokens(2500),
      totalFee: {
        denomination: '',
        formatted: '',
        formattedValue: 0,
        full: '',
        minimized: '',
        rounded: '',
        roundedValue: 0,
        value: 0
      },
      tradeSummary: {
        totalGas: {
          denomination: ' ETH',
          formatted: '0',
          formattedValue: 0,
          full: '0 ETH',
          minimized: '0',
          rounded: '0.0000',
          roundedValue: 0,
          value: 0
        },
        tradeOrders: []
      },
      tradeTypeOptions: [
        {
          label: 'buy',
          value: 'buy'
        },
        {
          label: 'sell',
          value: 'sell'
        }
      ],
      totalSharesUpToOrder: trade.totalSharesUpToOrder,
      updateTradeOrder: trade.updateTradeOrder, // self reference for function
    })
    assert.isFunction(trade.updateTradeOrder)
  })

  // FIXME
  // it('should return the expected share total for a deeply selected bid', () => {
  //   assert.strictEqual(trade.totalSharesUpToOrder(1, BUY), 20, `total returned from 'totalSharesUpToOrder' for deep bid order was not the expected value`);
  // });

  // FIXME
  // it('should return the expected share total for a deeply selected ask', () => {
  //   assert.strictEqual(trade.totalSharesUpToOrder(1, SELL), 40, `total returned from 'totalSharesUpToOrder' for deep ask order was not the expected value`);
  // });
})
