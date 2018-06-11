

import mocks from 'test/mockStore'

// import { BUY, SELL } from 'modules/transactions/constants/types';

import { formatEther, formatPercent } from 'utils/format-number'

describe('modules/trade/helpers/generate-trade.js', () => {
  const { state } = mocks
  const { generateTrade } = require('modules/trade/helpers/generate-trade')
  const trade = generateTrade(state.marketsData.testMarketId, state.outcomesData.testMarketId['1'], state.tradesInProgress.testMarketId['1'], state.orderBooks.testMarketId)

  it('should generate trade object', () => {
    assert.deepEqual(trade, {
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
        value: 0,
      },
      potentialEthProfit: formatEther(2500),
      potentialEthLoss: formatEther(2500),
      potentialProfitPercent: formatPercent(100),
      potentialLossPercent: formatPercent(100),
      side: 'buy',
      shareCost: formatEther(0),
      sharesFilled: 5000,
      totalCost: formatEther(2500),
      totalFee: {
        denomination: '',
        formatted: '',
        formattedValue: 0,
        full: '',
        minimized: '',
        rounded: '',
        roundedValue: 0,
        value: 0,
      },
      totalFeePercent: {
        denomination: '',
        formatted: '',
        formattedValue: 0,
        full: '',
        minimized: '',
        rounded: '',
        roundedValue: 0,
        value: 0,
      },
      tradeSummary: {
        totalGas: {
          denomination: ' ETH',
          formatted: '0',
          formattedValue: 0,
          full: '0 ETH',
          fullPrecision: '0',
          minimized: '0',
          rounded: '0.0000',
          roundedValue: 0,
          value: 0,
        },
        tradeOrders: [],
      },
      tradeTypeOptions: [
        {
          label: 'buy',
          value: 'buy',
        },
        {
          label: 'sell',
          value: 'sell',
        },
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
