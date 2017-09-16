import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from 'test/testState';
import { augur } from 'services/augurjs';
import { BUY, SELL, updateTradesInProgressActionShapeAssertion, tradeTestState } from 'test/trade/constants';

describe('modules/trade/actions/update-trades-in-progress.js', () => {
  describe('should update a trade in progress for a binary market', () => {
    proxyquire.noPreserveCache();
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);
    const state = Object.assign({}, testState, tradeTestState);
    const store = mockStore(state);
    const mockAugurJS = {
      augur: {
        trading: {
          simulateTrade: augur.trading.simulation.simulateTrade
        }
      }
    };
    const mockSelectMarket = {};
    const mockLoadAccountPositions = {

    };
    mockSelectMarket.selectMarket = sinon.stub().returns(state.marketsData.testBinaryMarketID);

    const action = proxyquire('../../../src/modules/trade/actions/update-trades-in-progress', {
      '../../../store': store,
      '../../../services/augurjs': mockAugurJS,
      '../../market/selectors/market': mockSelectMarket
    });

    beforeEach(() => {
      store.clearActions();
      augur.rpc.gasPrice = 20000000000;
    });

    afterEach(() => {
      store.clearActions();
    });

    it('should pass shape tests for buying 10 shares of YES at the default limitPrice', () => {
      store.dispatch(action.updateTradesInProgress('testBinaryMarketID', '2', BUY, '10.0', undefined, undefined));
      updateTradesInProgressActionShapeAssertion(store.getActions()[0]);
    });

    it('should pass calculation tests for buying 10 shares of YES at the default limitPrice', () => {
      store.dispatch(action.updateTradesInProgress('testBinaryMarketID', '2', BUY, '10.0', undefined, undefined));
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testBinaryMarketID',
          outcomeID: '2',
          details: {
            side: BUY,
            numShares: '10',
            limitPrice: '0.5',
            totalFee: '0.01',
            totalCost: '-5.01',
            tradeActions: [{
              action: 'BID',
              shares: '10',
              gasEth: '0.01450404',
              feeEth: '0.01',
              feePercent: '0.2',
              costEth: '-5.01',
              avgPrice: '0.501',
              noFeePrice: '0.5'
            }],
            tradingFeesEth: '0.01',
            gasFeesRealEth: '0.01450404',
            feePercent: '0.2'
          }
        }
      }, `The tradeDetails dispatched didn't correctly calculate the trade as expected.`);
    });

    it('should pass shape tests for Selling 10 shares of YES at the default limitPrice', () => {
      store.dispatch(action.updateTradesInProgress('testBinaryMarketID', '2', SELL, '10.0', undefined, undefined));
      updateTradesInProgressActionShapeAssertion(store.getActions()[0]);
    });

    it('should pass calculation tests for selling 10 shares of YES at the default limitPrice', () => {
      store.dispatch(action.updateTradesInProgress('testBinaryMarketID', '2', SELL, '10.0', undefined, undefined));
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testBinaryMarketID',
          outcomeID: '2',
          details: {
            side: SELL,
            numShares: '10',
            limitPrice: '0.5',
            totalFee: '0.01',
            totalCost: '-10.01',
            tradeActions: [{
              action: 'SHORT_ASK',
              shares: '10',
              gasEth: '0.02791268',
              feeEth: '0.01',
              feePercent: '0.2',
              costEth: '-10.01',
              avgPrice: '1.001',
              noFeePrice: '0.5'
            }],
            tradingFeesEth: '0.01',
            gasFeesRealEth: '0.02791268',
            feePercent: '0.099800399201596806'
          }
        }
      }, `The tradeDetails dispatched didn't correctly calculate the trade as expected.`);
    });

    it('should reset the tradeDetails object if 0 shares are passed in as a buy', () => {
      store.dispatch(action.updateTradesInProgress('testBinaryMarketID', '2', BUY, '0', undefined, undefined));
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testBinaryMarketID',
          outcomeID: '2',
          details: {
            side: BUY,
            numShares: undefined,
            limitPrice: '0.5',
            totalFee: 0,
            totalCost: 0
          }
        }
      }, `Didn't clear the tradeDetails object`);
    });

    it('should handle the tradeDetails object if no shares are passed in as a buy but a limitPrice is set.', () => {
      store.dispatch(action.updateTradesInProgress('testBinaryMarketID', '2', BUY, undefined, '0.5', undefined));
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testBinaryMarketID',
          outcomeID: '2',
          details: {
            side: BUY,
            numShares: undefined,
            limitPrice: '0.5',
            totalFee: 0,
            totalCost: 0
          }
        }
      }, `Didn't return the correct tradeDetails object based on input`);
    });

    it('should handle the tradeDetails object if no shares are passed in as a buy but a limitPrice is changed when a tradesInProgress is defined for an outcome.', () => {
			// set the current Trade in Progress for BUY to a 10 share .5 limit buy order
      store.getState().tradesInProgress = {
        testBinaryMarketID: {
          2: {
            side: BUY,
            numShares: '10',
            limitPrice: '0.5',
            totalFee: '0.01',
            totalCost: '-5.01',
            tradeActions: [{
              action: 'BID',
              shares: '10',
              gasEth: '0.01450404',
              feeEth: '0.01',
              feePercent: '0.2',
              costEth: '-5.01',
              avgPrice: '0.501',
              noFeePrice: '0.5'
            }],
            tradingFeesEth: '0.01',
            gasFeesRealEth: '0.01450404',
            feePercent: '0.2'
          }
        }
      };
      store.dispatch(action.updateTradesInProgress('testBinaryMarketID', '2', BUY, undefined, '0.15', undefined));
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testBinaryMarketID',
          outcomeID: '2',
          details: {
            side: BUY,
            numShares: '10',
            limitPrice: '0.15',
            totalFee: '0.00153',
            totalCost: '-1.50153',
            tradeActions: [{
              action: 'BID',
              shares: '10',
              gasEth: '0.01450404',
              feeEth: '0.00153',
              feePercent: '0.102',
              costEth: '-1.50153',
              avgPrice: '0.150153',
              noFeePrice: '0.15'
            }],
            tradingFeesEth: '0.00153',
            gasFeesRealEth: '0.01450404',
            feePercent: '0.102'
          }
        }
      }, `Didn't update the tradeDetails object to the new calcs given new limit`);
    });

    it('should handle clearing out a trade in progress if limitPrice is set to 0 on a trade ready to be placed', () => {
			// marketID, outcomeID, side, numShares, limitPrice, maxCost
      store.dispatch(action.updateTradesInProgress('testBinaryMarketID', '2', BUY, undefined, '0', undefined));
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testBinaryMarketID',
          outcomeID: '2',
          details: {
            side: 'buy',
            numShares: '10',
            limitPrice: '0',
            totalFee: '0',
            totalCost: '0',
            tradeActions: [{
              action: 'BID',
              avgPrice: '0',
              costEth: '0',
              feeEth: '0',
              feePercent: '0',
              gasEth: '0.01450404',
              noFeePrice: '0',
              shares: '10'
            }],
            tradingFeesEth: '0',
            gasFeesRealEth: '0.01450404',
            feePercent: 'NaN'
          }
        }
      }, "Didn't produce the expected tradeDetails object");
    });

    it('should handle the tradeDetails object if limitPrice is unchanged but share number changes', () => {
      store.dispatch(action.updateTradesInProgress('testBinaryMarketID', '2', BUY, '25', undefined, undefined));
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testBinaryMarketID',
          outcomeID: '2',
          details: {
            side: 'buy',
            numShares: '25',
            limitPrice: '0.5',
            totalFee: '0.025',
            totalCost: '-12.525',
            tradeActions: [{
              action: 'BID',
              shares: '25',
              gasEth: '0.01450404',
              feeEth: '0.025',
              feePercent: '0.2',
              costEth: '-12.525',
              avgPrice: '0.501',
              noFeePrice: '0.5'
            }],
            tradingFeesEth: '0.025',
            gasFeesRealEth: '0.01450404',
            feePercent: '0.2'
          }
        }
      }, "Didn't produce the expected tradeDetails object");
    });

    it('should handle the tradeDetails object if limitPrice is unchanged but share number changes to negative (should default to the positive version of the numShares: -25 becomes 25.)', () => {
      store.dispatch(action.updateTradesInProgress('testBinaryMarketID', '2', BUY, '-25', undefined, undefined));
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testBinaryMarketID',
          outcomeID: '2',
          details: {
            side: 'buy',
            numShares: '25',
            limitPrice: '0.5',
            totalFee: '0.025',
            totalCost: '-12.525',
            tradeActions: [{
              action: 'BID',
              shares: '25',
              gasEth: '0.01450404',
              feeEth: '0.025',
              feePercent: '0.2',
              costEth: '-12.525',
              avgPrice: '0.501',
              noFeePrice: '0.5'
            }],
            tradingFeesEth: '0.025',
            gasFeesRealEth: '0.01450404',
            feePercent: '0.2'
          }
        }
      }, "Didn't produce the expected tradeDetails object");
    });
  });

  describe('should update a trade in progress for a categorical market', () => {
    proxyquire.noPreserveCache();
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);
    const state = Object.assign({}, testState, tradeTestState);
    const store = mockStore(state);
    const mockAugurJS = {
      augur: {
        trading: {
          simulateTrade: augur.trading.simulation.simulateTrade
        },
        api: {
          MarketFetcher: {
            getPositionInMarket: (p, callback) => {
              callback(null, ['0x0', '0x0']);
            }
          }
        },
        rpc: { gasPrice: 20000000000 }
      }
    };
    const mockSelectMarket = {};
    mockSelectMarket.selectMarket = sinon.stub().returns(state.marketsData.testCategoricalMarketID);

    const action = proxyquire('../../../src/modules/trade/actions/update-trades-in-progress', {
      '../../../store': store,
      '../../../services/augurjs': mockAugurJS,
      '../../market/selectors/market': mockSelectMarket
    });

    beforeEach(() => {
      store.clearActions();
    });

    afterEach(() => {
      store.clearActions();
    });

    it('should pass shape tests for buying 10 shares of Outcome 1 at the default limitPrice', () => {
      store.dispatch(action.updateTradesInProgress('testCategoricalMarketID', '1', BUY, '10.0', undefined, undefined));
      updateTradesInProgressActionShapeAssertion(store.getActions()[0]);
    });

    it('should pass calculation tests for buying 10 shares of Outcome 1 at the default limitPrice', () => {
      store.dispatch(action.updateTradesInProgress('testCategoricalMarketID', '1', BUY, '10.0', undefined, undefined));
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testCategoricalMarketID',
          outcomeID: '1',
          details: {
            side: BUY,
            numShares: '10',
            limitPrice: '0.5',
            totalFee: '0.004999999999999995',
            totalCost: '-5.004999999999999995',
            tradeActions: [{
              action: 'BID',
              shares: '10',
              gasEth: '0.01450404',
              feeEth: '0.004999999999999995',
              feePercent: '0.0999999999999999',
              costEth: '-5.004999999999999995',
              avgPrice: '0.500499999999999999',
              noFeePrice: '0.5'
            }],
            tradingFeesEth: '0.004999999999999995',
            gasFeesRealEth: '0.01450404',
            feePercent: '0.0999999999999999'
          }
        }
      }, `The tradeDetails dispatched didn't correctly calculate the trade as expected.`);
    });

    it('should pass shape tests for Selling 10 shares of Outcome1 at the default limitPrice', () => {
      store.dispatch(action.updateTradesInProgress('testCategoricalMarketID', '1', SELL, '10.0', undefined, undefined));
      updateTradesInProgressActionShapeAssertion(store.getActions()[0]);
    });

    it('should pass calculation tests for selling 10 shares of Outcome1 at the default limitPrice', () => {
      store.dispatch(action.updateTradesInProgress('testCategoricalMarketID', '1', SELL, '10.0', undefined, undefined));
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testCategoricalMarketID',
          outcomeID: '1',
          details: {
            side: SELL,
            numShares: '10',
            limitPrice: '0.5',
            totalFee: '0.004999999999999995',
            totalCost: '-10.004999999999999995',
            tradeActions: [{
              action: 'SHORT_ASK',
              shares: '10',
              gasEth: '0.02791268',
              feeEth: '0.004999999999999995',
              feePercent: '0.0999999999999999',
              costEth: '-10.004999999999999995',
              avgPrice: '1.000499999999999999',
              noFeePrice: '0.5'
            }],
            tradingFeesEth: '0.004999999999999995',
            gasFeesRealEth: '0.02791268',
            feePercent: '0.0499500499500499'
          }
        }
      }, `The tradeDetails dispatched didn't correctly calculate the trade as expected.`);
    });

    it('should reset the tradeDetails object if 0 shares are passed in as a buy', () => {
      store.dispatch(action.updateTradesInProgress('testCategoricalMarketID', '1', BUY, '0', undefined, undefined));
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testCategoricalMarketID',
          outcomeID: '1',
          details: {
            side: BUY,
            numShares: undefined,
            limitPrice: '0.5',
            totalFee: 0,
            totalCost: 0
          }
        }
      }, `Didn't clear the tradeDetails object`);
    });

    it('should handle the tradeDetails object if no shares are passed in as a buy but a limitPrice is set.', () => {
      store.dispatch(action.updateTradesInProgress('testCategoricalMarketID', '1', BUY, undefined, '0.5', undefined));
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testCategoricalMarketID',
          outcomeID: '1',
          details: {
            side: BUY,
            numShares: undefined,
            limitPrice: '0.5',
            totalFee: 0,
            totalCost: 0
          }
        }
      }, `Didn't return the correct tradeDetails object based on input`);
    });

    it('should handle the tradeDetails object if no shares are passed in as a buy but a limitPrice is changed when a tradesInProgress is defined for an outcome.', () => {
			// set the current Trade in Progress for BUY to a 10 share .5 limit buy order
      store.getState().tradesInProgress = {
        testCategoricalMarketID: {
          1: {
            side: BUY,
            numShares: '10',
            limitPrice: '0.5',
            totalFee: '0.004999999999999995',
            totalCost: '-5.004999999999999995',
            tradeActions: [
              {
                action: 'BID',
                shares: '10',
                gasEth: '0.01450404',
                feeEth: '0.004999999999999995',
                feePercent: '0.0999999999999999',
                costEth: '-5.004999999999999995',
                avgPrice: '0.500499999999999999',
                noFeePrice: '0.5'
              }
            ],
            tradingFeesEth: '0.004999999999999995',
            gasFeesRealEth: '0.01450404',
            feePercent: '0.099800399201596707'
          }
        }
      };
      store.dispatch(action.updateTradesInProgress('testCategoricalMarketID', '1', BUY, undefined, '0.15', undefined));
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testCategoricalMarketID',
          outcomeID: '1',
          details: {
            side: BUY,
            numShares: '10',
            limitPrice: '0.15',
            totalFee: '0.000764999999999998',
            totalCost: '-1.500764999999999998',
            tradeActions: [{
              action: 'BID',
              shares: '10',
              gasEth: '0.01450404',
              feeEth: '0.000764999999999998',
              feePercent: '0.0509999999999999',
              costEth: '-1.500764999999999998',
              avgPrice: '0.150076499999999999',
              noFeePrice: '0.15'
            }],
            tradingFeesEth: '0.000764999999999998',
            gasFeesRealEth: '0.01450404',
            feePercent: '0.050999999999999867'
          }
        }
      }, `Didn't update the tradeDetails object to the new calcs given new limit`);
    });

    it('should handle clearing out a trade in progress if limitPrice is set to 0 on a trade ready to be placed', () => {
      store.dispatch(action.updateTradesInProgress('testCategoricalMarketID', '1', BUY, undefined, '0', undefined));
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testCategoricalMarketID',
          outcomeID: '1',
          details: {
            side: 'buy',
            numShares: '10',
            limitPrice: '0',
            totalFee: '0',
            totalCost: '0',
            tradeActions: [{
              action: 'BID',
              avgPrice: '0',
              costEth: '0',
              feeEth: '0',
              feePercent: '0',
              gasEth: '0.01450404',
              noFeePrice: '0',
              shares: '10'
            }],
            tradingFeesEth: '0',
            gasFeesRealEth: '0.01450404',
            feePercent: 'NaN'
          }
        }
      }, "Didn't produce the expected tradeDetails object");
    });

    it('should handle the tradeDetails object if limitPrice is unchanged but share number changes', () => {
      store.dispatch(action.updateTradesInProgress('testCategoricalMarketID', '1', BUY, '25', undefined, undefined));
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testCategoricalMarketID',
          outcomeID: '1',
          details: {
            side: 'buy',
            numShares: '25',
            limitPrice: '0.5',
            totalFee: '0.012499999999999987',
            totalCost: '-12.512499999999999987',
            tradeActions: [{
              action: 'BID',
              shares: '25',
              gasEth: '0.01450404',
              feeEth: '0.012499999999999987',
              feePercent: '0.0999999999999999',
              costEth: '-12.512499999999999987',
              avgPrice: '0.500499999999999999',
              noFeePrice: '0.5'
            }],
            tradingFeesEth: '0.012499999999999987',
            gasFeesRealEth: '0.01450404',
            feePercent: '0.099999999999999896'
          }
        }
      }, "Didn't produce the expected tradeDetails object");
    });

    it('should handle the tradeDetails object if limitPrice is unchanged but share number changes to negative (should default to the positive version of the numShares: -25 becomes 25.)', () => {
      store.dispatch(action.updateTradesInProgress('testCategoricalMarketID', '1', BUY, '-25', undefined, undefined));
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testCategoricalMarketID',
          outcomeID: '1',
          details: {
            side: 'buy',
            numShares: '25',
            limitPrice: '0.5',
            totalFee: '0.012499999999999987',
            totalCost: '-12.512499999999999987',
            tradeActions: [{
              action: 'BID',
              shares: '25',
              gasEth: '0.01450404',
              feeEth: '0.012499999999999987',
              feePercent: '0.0999999999999999',
              costEth: '-12.512499999999999987',
              avgPrice: '0.500499999999999999',
              noFeePrice: '0.5'
            }],
            tradingFeesEth: '0.012499999999999987',
            gasFeesRealEth: '0.01450404',
            feePercent: '0.099999999999999896'
          }
        }
      }, "Didn't produce the expected tradeDetails object");
    });
  });

  describe('should update a trade in progress for a scalar market', () => {
    proxyquire.noPreserveCache();
    const middlewares = [thunk];
    const mockStore = configureMockStore(middlewares);
    const state = Object.assign({}, testState, tradeTestState);
    const store = mockStore(state);
    const mockAugurJS = {
      augur: {
        trading: {
          simulateTrade: augur.trading.simulation.simulateTrade
        },
        api: {
          MarketFetcher: {
            getPositionInMarket: (p, callback) => {
              callback(null, ['0x0', '0x0']);
            }
          }
        },
        rpc: { gasPrice: 20000000000 }
      }
    };
    const mockSelectMarket = {};
    mockSelectMarket.selectMarket = sinon.stub().returns(state.marketsData.testScalarMarketID);

    const action = proxyquire('../../../src/modules/trade/actions/update-trades-in-progress', {
      '../../../store': store,
      '../../../services/augurjs': mockAugurJS,
      '../../market/selectors/market': mockSelectMarket
    });

    beforeEach(() => {
      store.clearActions();
    });

    afterEach(() => {
      store.clearActions();
    });

    it('should pass shape tests for buying 10 shares of outcome1 at the default limitPrice', () => {
      store.dispatch(action.updateTradesInProgress('testScalarMarketID', '1', BUY, '10.0', undefined, undefined));
      updateTradesInProgressActionShapeAssertion(store.getActions()[0]);
    });

    it('should pass calculation tests for buying 10 shares of outcome1 at the default limitPrice', () => {
      store.dispatch(action.updateTradesInProgress('testScalarMarketID', '1', BUY, '10.0', undefined, undefined));
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testScalarMarketID',
          outcomeID: '1',
          details: {
            side: BUY,
            numShares: '10',
            limitPrice: '55',
            totalFee: '6.5',
            totalCost: '-656.5',
            tradeActions: [
              {
                action: 'BID',
                shares: '10',
                gasEth: '0.01450404',
                feeEth: '6.5',
                feePercent: '1',
                costEth: '-656.5',
                avgPrice: '65.65',
                noFeePrice: '65'
              }
            ],
            tradingFeesEth: '6.5',
            gasFeesRealEth: '0.01450404',
            feePercent: '1'
          }
        }
      }, `The tradeDetails dispatched didn't correctly calculate the trade as expected.`);
    });

    it('should pass shape tests for Selling 10 shares of outcome1 at the default limitPrice', () => {
      store.dispatch(action.updateTradesInProgress('testScalarMarketID', '1', SELL, '10.0', undefined, undefined));
      updateTradesInProgressActionShapeAssertion(store.getActions()[0]);
    });

    it('should pass calculation tests for selling 10 shares of outcome1 at the default limitPrice', () => {
      store.dispatch(action.updateTradesInProgress('testScalarMarketID', '1', SELL, '10.0', undefined, undefined));
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testScalarMarketID',
          outcomeID: '1',
          details: {
            side: SELL,
            numShares: '10',
            limitPrice: '55',
            totalFee: '6.5',
            totalCost: '-16.5',
            tradeActions: [
              {
                action: 'SHORT_ASK',
                shares: '10',
                gasEth: '0.02791268',
                feeEth: '6.5',
                feePercent: '1',
                costEth: '-16.5',
                avgPrice: '1.65',
                noFeePrice: '65'
              }
            ],
            tradingFeesEth: '6.5',
            gasFeesRealEth: '0.02791268',
            feePercent: '28.260869565217391304'
          }
        }
      }, `The tradeDetails dispatched didn't correctly calculate the trade as expected.`);
    });

    it('should reset the tradeDetails object if 0 shares are passed in as a buy', () => {
      store.dispatch(action.updateTradesInProgress('testScalarMarketID', '1', BUY, '0', undefined, undefined));
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testScalarMarketID',
          outcomeID: '1',
          details: {
            side: BUY,
            numShares: undefined,
            limitPrice: '55',
            totalFee: 0,
            totalCost: 0
          }
        }
      }, `Didn't clear the tradeDetails object`);
    });

    it('should handle the tradeDetails object if no shares are passed in as a buy but a limitPrice is set.', () => {
      store.dispatch(action.updateTradesInProgress('testScalarMarketID', '1', BUY, undefined, '65', undefined));
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testScalarMarketID',
          outcomeID: '1',
          details: {
            side: BUY,
            numShares: undefined,
            limitPrice: '65',
            totalFee: 0,
            totalCost: 0
          }
        }
      }, `Didn't clear the tradeDetails object`);
    });

    it('should handle the tradeDetails object if no shares are passed in as a buy but a limitPrice is changed when a tradesInProgress is defined for an outcome.', () => {
			// set the current Trade in Progress for BUY to a 10 share .5 limit buy order
      store.getState().tradesInProgress = {
        testScalarMarketID: {
          1: {
            side: BUY,
            numShares: '10',
            limitPrice: '55',
            totalFee: '5.36982248520710025',
            totalCost: '-555.36982248520710025',
            tradeActions: [
              {
                action: 'BID',
                shares: '10',
                gasEth: '0.01450404',
                feeEth: '5.36982248520710025',
                feePercent: '0.9763313609467455',
                costEth: '-555.36982248520710025',
                avgPrice: '55.536982248520710025',
                noFeePrice: '55'
              }
            ],
            tradingFeesEth: '5.36982248520710025',
            gasFeesRealEth: '0.01450404',
            feePercent: '0.9763313609467455'
          }
        }
      };
      store.dispatch(action.updateTradesInProgress('testScalarMarketID', '1', BUY, undefined, '70', undefined));
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testScalarMarketID',
          outcomeID: '1',
          details: {
            side: BUY,
            numShares: '10',
            limitPrice: '70',
            totalFee: '7.57396449704142',
            totalCost: '-807.57396449704142',
            tradeActions: [{
              action: 'BID',
              shares: '10',
              gasEth: '0.01450404',
              feeEth: '7.57396449704142',
              feePercent: '0.9467455621301775',
              costEth: '-807.57396449704142',
              avgPrice: '80.757396449704142',
              noFeePrice: '80'
            }],
            tradingFeesEth: '7.57396449704142',
            gasFeesRealEth: '0.01450404',
            feePercent: '0.9467455621301775'
          }
        }
      }, `Didn't update the tradeDetails object to the new calcs given new limit`);
    });

    it('should handle a trade in progress if limitPrice is set to 0 on a scalar market where 0 should be valid', () => {
      store.dispatch(action.updateTradesInProgress('testScalarMarketID', '1', BUY, undefined, '0', undefined));
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testScalarMarketID',
          outcomeID: '1',
          details: {
            side: BUY,
            numShares: '10',
            limitPrice: '0',
            totalFee: '0.2840236686390532',
            totalCost: '-100.2840236686390532',
            tradeActions: [
              {
                action: 'BID',
                shares: '10',
                gasEth: '0.01450404',
                feeEth: '0.2840236686390532',
                feePercent: '0.2840236686390532',
                costEth: '-100.2840236686390532',
                avgPrice: '10.02840236686390532',
                noFeePrice: '10'
              }
            ],
            tradingFeesEth: '0.2840236686390532',
            gasFeesRealEth: '0.01450404',
            feePercent: '0.2840236686390532'
          }
        }
      }, `The tradeDetails dispatched didn't correctly calculate the trade as expected.`);
    });

    it('should handle the tradeDetails object if limitPrice is unchanged but share number changes', () => {
      store.dispatch(action.updateTradesInProgress('testScalarMarketID', '1', BUY, '25', undefined, undefined));
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testScalarMarketID',
          outcomeID: '1',
          details: {
            side: BUY,
            numShares: '25',
            limitPrice: '55',
            totalFee: '16.25',
            totalCost: '-1641.25',
            tradeActions: [{
              action: 'BID',
              shares: '25',
              gasEth: '0.01450404',
              feeEth: '16.25',
              feePercent: '1',
              costEth: '-1641.25',
              avgPrice: '65.65',
              noFeePrice: '65'
            }],
            tradingFeesEth: '16.25',
            gasFeesRealEth: '0.01450404',
            feePercent: '1'
          }
        }
      }, `Didn't update the tradeDetails object to the new calcs given new limit`);
    });

    it('should handle the tradeDetails object if limitPrice is unchanged but share number changes to negative (should default to the positive version of the numShares: -25 becomes 25.)', () => {
      store.dispatch(action.updateTradesInProgress('testScalarMarketID', '1', BUY, '-25', undefined, undefined));
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testScalarMarketID',
          outcomeID: '1',
          details: {
            side: BUY,
            numShares: '25',
            limitPrice: '55',
            totalFee: '16.25',
            totalCost: '-1641.25',
            tradeActions: [{
              action: 'BID',
              shares: '25',
              gasEth: '0.01450404',
              feeEth: '16.25',
              feePercent: '1',
              costEth: '-1641.25',
              avgPrice: '65.65',
              noFeePrice: '65'
            }],
            tradingFeesEth: '16.25',
            gasFeesRealEth: '0.01450404',
            feePercent: '1'
          }
        }
      }, `Didn't update the tradeDetails object to the new calcs given new limit`);
    });

    it('should handle the tradeDetails object if limitPrice is negative but valid for this scalar market', () => {
      store.dispatch(action.updateTradesInProgress('testScalarMarketID', '1', BUY, undefined, '-5', undefined));
      assert.deepEqual(store.getActions()[0], {
        type: 'UPDATE_TRADE_IN_PROGRESS',
        data: {
          marketID: 'testScalarMarketID',
          outcomeID: '1',
          details: {
            side: BUY,
            numShares: '10',
            limitPrice: '-5',
            totalFee: '0.0739644970414201',
            totalCost: '-50.0739644970414201',
            tradeActions: [{
              action: 'BID',
              shares: '10',
              gasEth: '0.01450404',
              feeEth: '0.0739644970414201',
              feePercent: '0.1479289940828402',
              costEth: '-50.0739644970414201',
              avgPrice: '5.00739644970414201',
              noFeePrice: '5'
            }],
            tradingFeesEth: '0.0739644970414201',
            gasFeesRealEth: '0.01450404',
            feePercent: '0.1479289940828402'
          }
        }
      }, `Didn't update the tradeDetails object to the new calcs given new limit`);
    });
  });
});
