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
    }/*,
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
    }/*,
    {
     numShares: 10,
     limitPrice: 0.5,
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
      numShares: 1,
      limitPrice: 0.5,
      side: BUY,
      minValue: '1',
      maxValue: '2',
      type: 'binary',
      actual: {
        potentialEthLoss: '0.5',
        potentialEthProfit: '0.5',
        potentialProfitPercent: '100',
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
      limitPrice: '0.1335577',
      side: BUY,
      minValue: '1',
      maxValue: '2',
      type: 'binary',
      actual: {
        potentialEthLoss: '58115.4962318',
        potentialEthProfit: 3258022.56,
        potentialProfitPercent: 648.740057667959241586,
        potentialLossPercent: 100
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
        potentialEthLoss: 50,
        potentialEthProfit: 50,
        potentialProfitPercent: 100,
        potentialLossPercent: 100
      }
    },
    {
      numShares: 10,
      limitPrice: 0.50,
      side: BUY,
      type: 'binary',
      minValue: '1',
      maxValue: '2',
      actual: {
        potentialEthLoss: 5,
        potentialEthProfit: 5,
        potentialProfitPercent: 100,
        potentialLossPercent: 100
      }
    }/*,
    {
      numShares: 10,
      limitPrice: 100.6,
      side: BUY,
      minValue: '-500',
      maxValue: '500',
      type: 'scalar',
      actual: {
        potentialEthLoss: 10,
        potentialEthProfit: 20,
        potentialProfitPercent: 203,
        potentialLossPercent: 100
      }
    },
    {
      numShares: 1234,
      limitPrice: 1.6,
      side: BUY,
      minValue: '-50',
      maxValue: '1000',
      type: 'scalar',
      actual: {
        potentialEthLoss: 10,
        potentialEthProfit: 20,
        potentialProfitPercent: 203,
        potentialLossPercent: 100
      }
    },
    {
      numShares: 54321,
      limitPrice: 0.31,
      side: BUY,
      type: 'binary',
      maxValue: '',
      minValue: '',
      actual: {
        potentialEthLoss: 16839.51,
        potentialEthProfit: 37182.72,
        potentialProfitPercent: 316,
        potentialLossPercent: 100
      }
    },
    {
      numShares: 24.65,
      limitPrice: 0.83,
      side: BUY,
      type: 'binary',
      actual: {
        potentialEthLoss: 20.46,
        potentialEthProfit: 4.19,
        potentialProfitPercent: 17,
        potentialLossPercent: 100
      }
    },
    {
      numShares: 97,
      limitPrice: 0.12,
      side: BUY,
      type: 'scalar',
      maxValue: '',
      minValue: '',
      actual: {
        potentialEthLoss: 11.64,
        potentialEthProfit: 85.36,
        potentialProfitPercent: 1150,
        potentialLossPercent: 100
      }
    },
    {
      numShares: 10,
      limitPrice: 0.5,
      side: SELL,
      type: 'scalar',
      maxValue: '',
      minValue: '',
      actual: {
        potentialEthLoss: 5,
        potentialEthProfit: 5,
        potentialProfitPercent: 100,
        potentialLossPercent: 100
      }
    },
    {
      numShares: 10,
      limitPrice: 0.50,
      side: BUY,
      type: 'binary',
      minValue: '1',
      maxValue: '2',
      actual: {
        potentialEthLoss: 5,
        potentialEthProfit: 5,
        potentialProfitPercent: 100,
        potentialLossPercent: 100
      }
    },
    {
      numShares: 101.50,
      limitPrice: 0.10,
      side: SELL,
      type: '',
      maxValue: '',
      minValue: '',
      actual: {
        potentialEthLoss: 91.35,
        potentialEthProfit: 10.15,
        potentialProfitPercent: 100,
        potentialLossPercent: 900
      }
    },
    {
      numShares: 1.50,
      limitPrice: 0.10,
      side: SELL,
      type: '',
      maxValue: '',
      minValue: '',
      actual: {
        potentialEthLoss: 13.5,
        potentialEthProfit: 0.15,
        potentialProfitPercent: 100,
        potentialLossPercent: 900
      }
    },
    {
      numShares: 12,
      limitPrice: 0.8,
      side: SELL,
      type: '',
      maxValue: '',
      minValue: '',
      actual: {
        potentialEthLoss: 2.4,
        potentialEthProfit: 12,
        potentialProfitPercent: 100,
        potentialLossPercent: 25
      }
    },
    {
      numShares: 101.50,
      limitPrice: 0.17,
      side: SELL,
      type: '',
      maxValue: '',
      minValue: '',
      actual: {
        potentialEthLoss: 597.05,
        potentialEthProfit: 17.255,
        potentialProfitPercent: 100,
        potentialLossPercent: 488.23
      }
    }*/
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
