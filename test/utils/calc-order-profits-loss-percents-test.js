import { describe, it } from 'mocha';
import { assert } from 'chai';

import { BUY, SELL } from 'modules/trade/constants/types';

import calcProfits from 'utils/calc-order-profit-loss-percents';


describe('utils/calc-order-profit-loss-percents.js', () => {
  const orders = [
    {
      numShares: 10,
      limitPrice: '0.5',
      side: BUY,
      minValue: '1',
      maxValue: '2',
      type: 'binary',
      actual: {
        potentialEthLoss: '5',
        potentialEthProfit: '5',
        potentialProfitPercent: 100,
        potentialLossPercent: 100
      }
    },
    {
      numShares: '100',
      limitPrice: '0.75',
      side: BUY,
      minValue: '1',
      maxValue: '2',
      type: 'binary',
      actual: {
        potentialEthLoss: '75',
        potentialEthProfit: '25',
        potentialProfitPercent: '33.333333333333333333',
        potentialLossPercent: '100'
      }
    },
    {
      numShares: '100',
      limitPrice: '0.25',
      side: SELL,
      minValue: '1',
      maxValue: '2',
      type: 'binary',
      actual: {
        potentialEthLoss: '75',
        potentialEthProfit: '25',
        potentialProfitPercent: '33.333333333333333333',
        potentialLossPercent: '300'
      }
    },
    {
      numShares: '10',
      limitPrice: '0.20',
      side: SELL,
      minValue: '1',
      maxValue: '2',
      type: 'binary',
      actual: {
        potentialEthLoss: '8',
        potentialEthProfit: '2',
        potentialProfitPercent: '25',
        potentialLossPercent: '400'
      }
    },
    {
      numShares: '10',
      limitPrice: '50',
      side: SELL,
      minValue: '0',
      maxValue: '100',
      type: 'scalar',
      actual: {
        potentialEthLoss: '500',
        potentialEthProfit: '500',
        potentialProfitPercent: '100',
        potentialLossPercent: '100'
      }
    },
    {
      numShares: '1',
      limitPrice: '5',
      side: BUY,
      minValue: '0',
      maxValue: '10',
      type: 'scalar',
      actual: {
        potentialEthLoss: '5',
        potentialEthProfit: '5',
        potentialProfitPercent: '100',
        potentialLossPercent: '100'
      }
    },
    {
      numShares: '122',
      limitPrice: '510',
      side: BUY,
      minValue: '0',
      maxValue: '1000',
      type: 'scalar',
      actual: {
        potentialEthLoss: '62220',
        potentialEthProfit: '59780',
        potentialProfitPercent: '96.078431372549019608',
        potentialLossPercent: '100'
      }
    },
    {
      //  return empty object if price over 1 for non-scalar markets
      numShares: '122',
      limitPrice: '1.1',
      side: BUY,
      minValue: '0',
      maxValue: '10',
      type: 'binary',
      actual: {}
    },
    {
      numShares: '23',
      limitPrice: '.83',
      side: BUY,
      minValue: '1',
      maxValue: '2',
      type: 'categorical',
      actual: {
        potentialEthLoss: '19.09',
        potentialEthProfit: '3.91',
        potentialProfitPercent: '20.481927710843373494',
        potentialLossPercent: '100'
      }
    },
    {
      numShares: 20,
      limitPrice: 0.4,
      side: BUY,
      minValue: '1',
      maxValue: '2',
      type: 'binary',
      actual: {
        potentialEthLoss: '8',
        potentialEthProfit: '12',
        potentialProfitPercent: '150',
        potentialLossPercent: '100'
      }
    },
    {
      numShares: 210,
      limitPrice: 0.5,
      side: SELL,
      minValue: '1',
      maxValue: '2',
      type: 'binary',
      actual: {
        potentialEthLoss: '105',
        potentialEthProfit: '105',
        potentialProfitPercent: '100',
        potentialLossPercent: '100'
      }
    },
    {
      numShares: 43.51234,
      limitPrice: 0.35577,
      side: SELL,
      minValue: '1',
      maxValue: '2',
      type: 'binary',
      actual: {
        potentialEthLoss: '28.0319547982',
        potentialEthProfit: '15.4803852018',
        potentialProfitPercent: 100,
        potentialLossPercent: 100
      }
    },
    {
      numShares: '435134',
      limitPrice: '0.1335',
      side: BUY,
      minValue: '1',
      maxValue: '2',
      type: 'binary',
      actual: {
        potentialEthLoss: '58090.389',
        potentialEthProfit: '377043.611',
        potentialProfitPercent: '649.063670411985018727',
        potentialLossPercent: '100'
      }
    },
    {
      numShares: '100',
      limitPrice: '50',
      side: BUY,
      minValue: '0',
      maxValue: '100',
      type: 'scalar',
      actual: {
        potentialEthLoss: '5000',
        potentialEthProfit: '5000',
        potentialProfitPercent: 100,
        potentialLossPercent: 100
      }
    }
  ];

  orders.forEach((order) => {
    it(`should return the profit and loss in ether and the percentage return and loss`, () => {
      const result = calcProfits(order.numShares, order.limitPrice, order.side, order.minValue, order.maxValue, order.type);
      assert.equal(
        result.potentialEthProfit,
        order.actual.potentialEthProfit,
        'incorrect potentialEthProfit'
      );
      assert.equal(
        result.potentialEthLoss,
        order.actual.potentialEthLoss,
        'incorrect potentialEthLoss'
      );
      assert.equal(
        result.potentialProfitPercent,
        order.actual.potentialProfitPercent,
        'incorrect potentialProfitPercent'
      );
      assert.equal(
        result.potentialLossPercent,
        order.actual.potentialLossPercent,
        'incorrect potentialLossPercent'
      );
    });
  });

});
