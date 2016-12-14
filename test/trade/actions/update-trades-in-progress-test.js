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
		const mockAugurJS = { augur: { ...augur } };
		mockAugurJS.augur.getParticipantSharesPurchased = sinon.stub().yields('0');
		const mockSelectMarket = {};
		mockSelectMarket.selectMarket = sinon.stub().returns(state.marketsData.testBinaryMarketID);

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
						totalCost: '5.01',
						tradeActions: [{
							action: 'BID',
							shares: '10',
							gasEth: '0.01450404',
							feeEth: '0.01',
							feePercent: '0.2',
							costEth: '5.01',
							avgPrice: '0.501',
							noFeePrice: '0.5'
						}],
						tradingFeesEth: '0.01',
						gasFeesRealEth: '0.01450404',
						feePercent: '0.199203187250996016'
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
						totalCost: '5.01',
						tradeActions: [{
							action: 'BID',
							shares: '10',
							gasEth: '0.01450404',
							feeEth: '0.01',
							feePercent: '0.2',
							costEth: '5.01',
							avgPrice: '0.501',
							noFeePrice: '0.5'
						}],
						tradingFeesEth: '0.01',
						gasFeesRealEth: '0.01450404',
						feePercent: '0.199203187250996016'
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
						totalCost: '1.50153',
						tradeActions: [{
							action: 'BID',
							shares: '10',
							gasEth: '0.01450404',
							feeEth: '0.00153',
							feePercent: '0.102',
							costEth: '1.50153',
							avgPrice: '0.150153',
							noFeePrice: '0.15'
						}],
						tradingFeesEth: '0.00153',
						gasFeesRealEth: '0.01450404',
						feePercent: '0.101792343619017205'
					}
				}
			}, `Didn't update the tradeDetails object to the new calcs given new limit`);
		});

		it('should handle clearing out a trade in progress if limitPrice is set to 0 on a trade ready to be placed', () => {
			// marketID, outcomeID, side, numShares, limitPrice, maxCost
			store.dispatch(action.updateTradesInProgress('testBinaryMarketID', '2', BUY, undefined, '0', undefined));
			console.log(store.getActions()[0].data.details);
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
						totalCost: '12.525',
						tradeActions: [{
							action: 'BID',
							shares: '25',
							gasEth: '0.01450404',
							feeEth: '0.025',
							feePercent: '0.2',
							costEth: '12.525',
							avgPrice: '0.501',
							noFeePrice: '0.5'
						}],
						tradingFeesEth: '0.025',
						gasFeesRealEth: '0.01450404',
						feePercent: '0.199203187250996016'
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
						totalCost: '12.525',
						tradeActions: [{
							action: 'BID',
							shares: '25',
							gasEth: '0.01450404',
							feeEth: '0.025',
							feePercent: '0.2',
							costEth: '12.525',
							avgPrice: '0.501',
							noFeePrice: '0.5'
						}],
						tradingFeesEth: '0.025',
						gasFeesRealEth: '0.01450404',
						feePercent: '0.199203187250996016'
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
		const mockAugurJS = { augur: { ...augur } };
		mockAugurJS.augur.getParticipantSharesPurchased = sinon.stub().yields('0');
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
			console.log(store.getActions()[0]);
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
						totalCost: '5.004999999999999995',
						tradeActions: [{
							action: 'BID',
							shares: '10',
							gasEth: '0.01450404',
							feeEth: '0.004999999999999995',
							feePercent: '0.0999999999999999',
							costEth: '5.004999999999999995',
							avgPrice: '0.500499999999999999',
							noFeePrice: '0.5'
						}],
						tradingFeesEth: '0.004999999999999995',
						gasFeesRealEth: '0.01450404',
						feePercent: '0.099800399201596707'
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
						totalCost: '5.004999999999999995',
						tradeActions: [
							{
								action: 'BID',
								shares: '10',
								gasEth: '0.01450404',
								feeEth: '0.004999999999999995',
								feePercent: '0.0999999999999999',
								costEth: '5.004999999999999995',
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
						totalCost: '1.500764999999999998',
						tradeActions: [{
							action: 'BID',
							shares: '10',
							gasEth: '0.01450404',
							feeEth: '0.000764999999999998',
							feePercent: '0.0509999999999999',
							costEth: '1.500764999999999998',
							avgPrice: '0.150076499999999999',
							noFeePrice: '0.15'
						}],
						tradingFeesEth: '0.000764999999999998',
						gasFeesRealEth: '0.01450404',
						feePercent: '0.050948033006333407'
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
						totalCost: '12.512499999999999987',
						tradeActions: [{
							action: 'BID',
							shares: '25',
							gasEth: '0.01450404',
							feeEth: '0.012499999999999987',
							feePercent: '0.0999999999999999',
							costEth: '12.512499999999999987',
							avgPrice: '0.500499999999999999',
							noFeePrice: '0.5'
						}],
						tradingFeesEth: '0.012499999999999987',
						gasFeesRealEth: '0.01450404',
						feePercent: '0.099800399201596703'
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
						totalCost: '12.512499999999999987',
						tradeActions: [{
							action: 'BID',
							shares: '25',
							gasEth: '0.01450404',
							feeEth: '0.012499999999999987',
							feePercent: '0.0999999999999999',
							costEth: '12.512499999999999987',
							avgPrice: '0.500499999999999999',
							noFeePrice: '0.5'
						}],
						tradingFeesEth: '0.012499999999999987',
						gasFeesRealEth: '0.01450404',
						feePercent: '0.099800399201596703'
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
		const mockAugurJS = { augur: { ...augur } };
		mockAugurJS.augur.getParticipantSharesPurchased = sinon.stub().yields('0');
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
						totalFee: '5.36982248520710025',
						totalCost: '555.36982248520710025',
						tradeActions: [
							{
								action: 'BID',
								shares: '10',
								gasEth: '0.01450404',
								feeEth: '5.36982248520710025',
								feePercent: '0.9763313609467455',
								costEth: '555.36982248520710025',
								avgPrice: '55.536982248520710025',
								noFeePrice: '55'
							}
						],
						tradingFeesEth: '5.36982248520710025',
						gasFeesRealEth: '0.01450404',
						feePercent: '0.95763203714451532'
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
						totalFee: '5.36982248520710025',
						totalCost: '-15.36982248520710025',
						tradeActions: [
							{
								action: 'SHORT_ASK',
								shares: '10',
								gasEth: '0.02791268',
								feeEth: '5.36982248520710025',
								feePercent: '0.9763313609467455',
								costEth: '-15.36982248520710025',
								avgPrice: '1.536982248520710025',
								noFeePrice: '55'
							}
						],
						tradingFeesEth: '5.36982248520710025',
						gasFeesRealEth: '0.02791268',
						feePercent: '25.891583452211126167'
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
						totalCost: '555.36982248520710025',
						tradeActions: [
							{
								action: 'BID',
								shares: '10',
								gasEth: '0.01450404',
								feeEth: '5.36982248520710025',
								feePercent: '0.9763313609467455',
								costEth: '555.36982248520710025',
								avgPrice: '55.536982248520710025',
								noFeePrice: '55'
							}
						],
						tradingFeesEth: '5.36982248520710025',
						gasFeesRealEth: '0.01450404',
						feePercent: '0.95763203714451532'
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
						totalFee: '6.9585798816568041',
						totalCost: '706.9585798816568041',
						tradeActions: [{
							action: 'BID',
							shares: '10',
							gasEth: '0.01450404',
							feeEth: '6.9585798816568041',
							feePercent: '0.9940828402366863',
							costEth: '706.9585798816568041',
							avgPrice: '70.69585798816568041',
							noFeePrice: '70'
						}],
						tradingFeesEth: '6.9585798816568041',
						gasFeesRealEth: '0.01450404',
						feePercent: '0.974704107681596571'
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
						totalFee: '0',
						totalCost: '0',
						tradeActions: [
							{
								action: 'BID',
								shares: '10',
								gasEth: '0.01450404',
								feeEth: '0',
								feePercent: '0',
								costEth: '0',
								avgPrice: '0',
								noFeePrice: '0'
							}
						],
						tradingFeesEth: '0',
						gasFeesRealEth: '0.01450404',
						feePercent: 'NaN'
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
						totalFee: '13.424556213017750625',
						totalCost: '1388.424556213017750625',
						tradeActions: [{
							action: 'BID',
							shares: '25',
							gasEth: '0.01450404',
							feeEth: '13.424556213017750625',
							feePercent: '0.9763313609467455',
							costEth: '1388.424556213017750625',
							avgPrice: '55.536982248520710025',
							noFeePrice: '55'
						}],
						tradingFeesEth: '13.424556213017750625',
						gasFeesRealEth: '0.01450404',
						feePercent: '0.95763203714451532'
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
						totalFee: '13.424556213017750625',
						totalCost: '1388.424556213017750625',
						tradeActions: [{
							action: 'BID',
							shares: '25',
							gasEth: '0.01450404',
							feeEth: '13.424556213017750625',
							feePercent: '0.9763313609467455',
							costEth: '1388.424556213017750625',
							avgPrice: '55.536982248520710025',
							noFeePrice: '55'
						}],
						tradingFeesEth: '13.424556213017750625',
						gasFeesRealEth: '0.01450404',
						feePercent: '0.95763203714451532'
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
						totalFee: '0.07988165680473375',
						totalCost: '-49.92011834319526625',
						tradeActions: [{
							action: 'BID',
							shares: '10',
							gasEth: '0.01450404',
							feeEth: '0.07988165680473375',
							feePercent: '-0.1597633136094675',
							costEth: '-49.92011834319526625',
							avgPrice: '-4.992011834319526625',
							noFeePrice: '-5'
						}],
						tradingFeesEth: '0.07988165680473375',
						gasFeesRealEth: '0.01450404',
						feePercent: '-0.160275436305354431'
					}
				}
			}, `Didn't update the tradeDetails object to the new calcs given new limit`);
		});
	});
});
