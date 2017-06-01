import { describe, it } from 'mocha';
import { assert } from 'chai';
import mocks from 'test/mockStore';

import { BID, ASK } from 'modules/transactions/constants/types';

describe('modules/market/selectors/helpers/generate-trade.js', () => {
  const { state } = mocks;
  const { generateTrade } = require('modules/trade/helpers/generate-trade');
  const trade = generateTrade(state.marketsData.testMarketID, state.outcomesData.testMarketID['1'], state.tradesInProgress.testMarketID, state.loginAccount, state.orderBooks.testMarketID);

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
      maxNumShares: {
        denomination: ' shares',
        formatted: '0',
        formattedValue: 0,
        full: '0 shares',
        minimized: '0',
        rounded: '0.00',
        roundedValue: 0,
        value: 0
      },
      numShares: 5000,
      potentialEthLoss: {
        denomination: ' ETH',
        formatted: '2,500.0000',
        formattedValue: 2500,
        full: '2,500.0000 ETH',
        minimized: '2,500',
        rounded: '2,500.0000',
        roundedValue: 2500,
        value: 2500
      },
      potentialEthProfit: {
        denomination: ' ETH',
        formatted: '2,500.0000',
        formattedValue: 2500,
        full: '2,500.0000 ETH',
        minimized: '2,500',
        rounded: '2,500.0000',
        roundedValue: 2500,
        value: 2500
      },
      potentialLossPercent: {
        denomination: '%',
        formatted: '100.0',
        formattedValue: 100,
        full: '100.0%',
        minimized: '100',
        rounded: '100',
        roundedValue: 100,
        value: 100
      },
      potentialProfitPercent: {
        denomination: '%',
        formatted: '100.0',
        formattedValue: 100,
        full: '100.0%',
        minimized: '100',
        rounded: '100',
        roundedValue: 100,
        value: 100
      },
      side: 'buy',
      totalCost: {
        denomination: ' ETH',
        formatted: '2,500.0000',
        formattedValue: 2500,
        full: '2,500.0000 ETH',
        minimized: '2,500',
        rounded: '2,500.0000',
        roundedValue: 2500,
        value: 2500
      },
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
          denomination: ' real ETH',
          formatted: '0',
          formattedValue: 0,
          full: '0 real ETH',
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
    }
    );
    assert.isFunction(trade.updateTradeOrder);
  });

  it('should return the expected share total for a deeply selected bid', () => {
    assert.strictEqual(trade.totalSharesUpToOrder(1, BID), 20, `total returned from 'totalSharesUpToOrder' for deep bid order was not the expected value`);
  });

  it('should return the expected share total for a deeply selected ask', () => {
    assert.strictEqual(trade.totalSharesUpToOrder(1, ASK), 40, `total returned from 'totalSharesUpToOrder' for deep ask order was not the expected value`);

  });
});
