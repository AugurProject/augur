import { describe, it, before, beforeEach, afterEach } from 'mocha';
import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';
import {
	BINARY,
	CATEGORICAL,
	SCALAR
} from '../../../src/modules/markets/constants/market-types';
import {
	SUCCESS,
	FAILED
} from '../../../src/modules/transactions/constants/statuses';
import { CATEGORICAL_OUTCOMES_SEPARATOR, CATEGORICAL_OUTCOME_SEPARATOR } from '../../../src/modules/markets/constants/market-outcomes';

describe(`modules/create-market/actions/submit-new-market.js`, () => {
	proxyquire.noPreserveCache().noCallThru();

	let out;
	let clock;
	let marketData = {};
	let expectedMarketData = {};

	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);

	const testData = {
		type: 'UPDATE_TRANSACTIONS_DATA',
		test123: {
			type: 'create_market',
			gas: 0,
			ether: 0,
			data: {
				market: 'some marketdata'
			},
			action: 'do some action',
			status: 'pending'
		}
	};
	const transID = 'testtransaction12345';
	const failedMarketData = {
		type: BINARY,
		minValue: 1,
		maxValue: 2,
		numOutcomes: 2,
		endDate: { value: new Date() },
		expirySource: true,
		failTest: FAILED
	};
	const state = Object.assign({}, testState);

	const store = mockStore(state);

	const stubbedNewMarketTransactions = {
		addCreateMarketTransaction: () => {}
	};
	sinon.stub(stubbedNewMarketTransactions, 'addCreateMarketTransaction', newMarket => testData);

	const stubbedUpdateExistingTransaction = {
		updateExistingTransaction: () => {}
	};
	sinon.stub(stubbedUpdateExistingTransaction, 'updateExistingTransaction', (transactionID, status) => ({
		type: 'UPDATE_EXISTING_TRANSACTIONS',
		transactionID,
		status
	}));

	const stubbedAugurJS = {
		augur: { createSingleEventMarket: () => {} }
	};
	sinon.stub(stubbedAugurJS.augur, 'createSingleEventMarket', (o) => {
		if (o.resolution) {
			o.onFailed({ status: FAILED, message: 'error!' });
		} else {
			o.onSuccess({ status: SUCCESS, marketID: 'test123', callReturn: '0x123' });
		}
	});

	const stubbedGenerateOrderBook = {
		submitGenerateOrderBook: () => {}
	};
	sinon.stub(stubbedGenerateOrderBook, 'submitGenerateOrderBook', data => ({
		type: 'submitGenerateOrderBook'
	}));

	const stubbedLink = {
		selectTransactionsLink: () => {}
	};
	sinon.stub(stubbedLink, 'selectTransactionsLink', () => ({
		onClick: () => ({
			type: 'clickedLink'
		})
	}));

	const action = proxyquire(
		'../../../src/modules/create-market/actions/submit-new-market',
		{
			'../../transactions/actions/add-create-market-transaction': stubbedNewMarketTransactions,
			'../../transactions/actions/update-existing-transaction': stubbedUpdateExistingTransaction,
			'../../../services/augurjs': stubbedAugurJS,
			'../../create-market/actions/generate-order-book': stubbedGenerateOrderBook,
			'../../link/selectors/links': stubbedLink
		}
	);

	before(() => {
		store.clearActions();

		// Mock the window object
		global.window = {};
		global.window.location = {
			pathname: '/test',
			search: 'example'
		};
		global.window.history = {
			state: [],
			pushState: (a, b, c) => window.history.state.push(c)
		};
		global.window.scrollTo = (x, y) => true;
	});

	it(`should be able to submit a new market`, () => {
		store.dispatch(action.submitNewMarket({
			market: {
				id: 'market'
			}
		}));

		out = [{
			type: 'UPDATE_TRANSACTIONS_DATA',
			test123: {
				type: 'create_market',
				gas: 0,
				ether: 0,
				data: {
					market: 'some marketdata'
				},
				action: 'do some action',
				status: 'pending'
			}
		}];

		assert(stubbedLink.selectTransactionsLink.calledOnce, 'selectTransactionsLink was not called once');
		assert(stubbedNewMarketTransactions.addCreateMarketTransaction.calledOnce, `addCreateMarketTransaction wasn't called once as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't correctly create a new market`);

		global.window = {};
		store.clearActions();
	});

	describe('createMarket states', () => {

		const endDate = { value: new Date() };

		beforeEach(() => {
			store.clearActions();
			stubbedUpdateExistingTransaction.updateExistingTransaction.reset();
			marketData = {};
			out = [];
			expectedMarketData = {};

			global.window.performance = {
				now: () => Date.now()
			};

			clock = sinon.useFakeTimers();
		});

		afterEach(() => {
			clock.restore();
		});

		it('should fail correctly', () => {
			console.log('failedMarketData:', failedMarketData);
			store.dispatch(action.createMarket(transID, failedMarketData));

			out = [
				{
					type: 'UPDATE_EXISTING_TRANSACTIONS',
					transactionID: transID,
					status: {
						status: 'sending...',
						eventBond: undefined,
						gasFees: undefined,
						marketCreationFee: undefined
					}
				},
				{
					type: 'UPDATE_EXISTING_TRANSACTIONS',
					transactionID: transID,
					status: { status: 'failed', message: 'error!' }
				}
			];

			assert(stubbedUpdateExistingTransaction.updateExistingTransaction.calledTwice, `updateExistingTransaction was not called exactly twice`);
			assert.deepEqual(store.getActions(), out, `createMarket did not fail correctly`);
		});

		it('should be able to create a binary market WITH an order book', () => {
			marketData = {
				endDate,
				type: BINARY,
				isCreatingOrderBook: true
			};

			store.dispatch(action.createMarket(transID, marketData));

			clock.tick(10000);

			out = [
				{
					type: 'UPDATE_EXISTING_TRANSACTIONS',
					transactionID: transID,
					status: {
						status: 'sending...',
						eventBond: undefined,
						gasFees: undefined,
						marketCreationFee: undefined
					}
				},
				{
					type: 'UPDATE_EXISTING_TRANSACTIONS',
					transactionID: transID,
					status: {
						status: SUCCESS,
						hash: undefined,
						timestamp: undefined,
						data: {
							id: '0x123'
						},
						gasFees: {
							denomination: ' real ETH',
							formatted: '0',
							formattedValue: 0,
							full: '0 real ETH',
							minimized: '0',
							rounded: '0',
							roundedValue: 0,
							value: 0
						}
					}
				},
				{
					type: 'CLEAR_MAKE_IN_PROGRESS'
				},
				{
					type: 'submitGenerateOrderBook'
				}
			];

			expectedMarketData = {
				endDate,
				type: BINARY,
				isCreatingOrderBook: true,
				minValue: 1,
				maxValue: 2,
				numOutcomes: 2
			};

			assert(stubbedUpdateExistingTransaction.updateExistingTransaction.calledTwice, `updateExistingTransaction was not called exactly twice`);
			assert.deepEqual(store.getActions(), out, `a binary market was not correctly created`);
			assert.deepEqual(marketData, expectedMarketData, 'market data was not correctly mutated');
		});

		it('should be able to create a binary market WITHOUT an order book', () => {
			marketData = {
				endDate,
				type: BINARY
			};

			store.dispatch(action.createMarket(transID, marketData));

			clock.tick(10000);

			out = [
				{
					type: 'UPDATE_EXISTING_TRANSACTIONS',
					transactionID: transID,
					status: {
						status: 'sending...',
						eventBond: undefined,
						gasFees: undefined,
						marketCreationFee: undefined
					}
				},
				{
					type: 'UPDATE_EXISTING_TRANSACTIONS',
					transactionID: transID,
					status: {
						status: SUCCESS,
						hash: undefined,
						timestamp: undefined,
						data: {
							id: '0x123'
						},
						gasFees: {
							denomination: ' real ETH',
							formatted: '0',
							formattedValue: 0,
							full: '0 real ETH',
							minimized: '0',
							rounded: '0',
							roundedValue: 0,
							value: 0
						}
					}
				},
				{
					type: 'CLEAR_MAKE_IN_PROGRESS'
				}
			];

			expectedMarketData = {
				endDate,
				type: BINARY,
				minValue: 1,
				maxValue: 2,
				numOutcomes: 2
			};

			assert(stubbedUpdateExistingTransaction.updateExistingTransaction.calledTwice, `updateExistingTransaction was not called exactly twice`);
			assert.deepEqual(store.getActions(), out, `a binary market was not correctly created`);
			assert.deepEqual(marketData, expectedMarketData, 'market data was not correctly mutated');
		});

		it('should be able to create a scalar market WITH an order book', () => {
			marketData = {
				endDate,
				type: SCALAR,
				isCreatingOrderBook: true,
				scalarSmallNum: 10,
				scalarBigNum: 100
			};

			store.dispatch(action.createMarket(transID, marketData));

			clock.tick(10000);

			out = [
				{
					type: 'UPDATE_EXISTING_TRANSACTIONS',
					transactionID: transID,
					status: {
						status: 'sending...',
						eventBond: undefined,
						gasFees: undefined,
						marketCreationFee: undefined
					}
				},
				{
					type: 'UPDATE_EXISTING_TRANSACTIONS',
					transactionID: transID,
					status: {
						status: SUCCESS,
						hash: undefined,
						timestamp: undefined,
						data: {
							id: '0x123'
						},
						gasFees: {
							denomination: ' real ETH',
							formatted: '0',
							formattedValue: 0,
							full: '0 real ETH',
							minimized: '0',
							rounded: '0',
							roundedValue: 0,
							value: 0
						}
					}
				},
				{
					type: 'CLEAR_MAKE_IN_PROGRESS'
				},
				{
					type: 'submitGenerateOrderBook'
				}
			];

			expectedMarketData = {
				endDate,
				type: SCALAR,
				isCreatingOrderBook: true,
				scalarSmallNum: 10,
				scalarBigNum: 100,
				minValue: 10,
				maxValue: 100,
				numOutcomes: 2
			};

			assert(stubbedUpdateExistingTransaction.updateExistingTransaction.calledTwice, `updateExistingTransaction was not called exactly twice`);
			assert.deepEqual(store.getActions(), out, `a scalar market was not correctly created`);
			assert.deepEqual(marketData, expectedMarketData, 'market data was not correctly mutated');
		});

		it('should be able to create a scalar market WITHOUT an order book', () => {
			marketData = {
				endDate,
				type: SCALAR,
				scalarSmallNum: 10,
				scalarBigNum: 100
			};

			store.dispatch(action.createMarket(transID, marketData));

			clock.tick(10000);

			out = [
				{
					type: 'UPDATE_EXISTING_TRANSACTIONS',
					transactionID: transID,
					status: {
						status: 'sending...',
						eventBond: undefined,
						gasFees: undefined,
						marketCreationFee: undefined
					}
				},
				{
					type: 'UPDATE_EXISTING_TRANSACTIONS',
					transactionID: transID,
					status: {
						status: SUCCESS,
						hash: undefined,
						timestamp: undefined,
						data: {
							id: '0x123'
						},
						gasFees: {
							denomination: ' real ETH',
							formatted: '0',
							formattedValue: 0,
							full: '0 real ETH',
							minimized: '0',
							rounded: '0',
							roundedValue: 0,
							value: 0
						}
					}
				},
				{
					type: 'CLEAR_MAKE_IN_PROGRESS'
				}
			];

			expectedMarketData = {
				endDate,
				type: SCALAR,
				scalarSmallNum: 10,
				scalarBigNum: 100,
				minValue: 10,
				maxValue: 100,
				numOutcomes: 2
			};

			assert(stubbedUpdateExistingTransaction.updateExistingTransaction.calledTwice, `updateExistingTransaction was not called exactly twice`);
			assert.deepEqual(store.getActions(), out, `a scalar market was not correctly created`);
			assert.deepEqual(marketData, expectedMarketData, 'market data was not correctly mutated');
		});

		it('should be able to create a categorical market WITH an order book', () => {
			marketData = {
				endDate,
				description: 'test',
				type: CATEGORICAL,
				isCreatingOrderBook: true,
				outcomes: [
					{ id: 0, name: 'outcome1' },
					{ id: 1, name: 'outcome2' },
					{ id: 2, name: 'outcome3' }
				]
			};

			store.dispatch(action.createMarket(transID, marketData));

			clock.tick(10000);

			out = [
				{
					type: 'UPDATE_EXISTING_TRANSACTIONS',
					transactionID: transID,
					status: {
						status: 'sending...',
						eventBond: undefined,
						gasFees: undefined,
						marketCreationFee: undefined
					}
				},
				{
					type: 'UPDATE_EXISTING_TRANSACTIONS',
					transactionID: transID,
					status: {
						status: SUCCESS,
						hash: undefined,
						timestamp: undefined,
						data: {
							id: '0x123'
						},
						gasFees: {
							denomination: ' real ETH',
							formatted: '0',
							formattedValue: 0,
							full: '0 real ETH',
							minimized: '0',
							rounded: '0',
							roundedValue: 0,
							value: 0
						}
					}
				},
				{
					type: 'CLEAR_MAKE_IN_PROGRESS'
				},
				{
					type: 'submitGenerateOrderBook'
				}
			];

			expectedMarketData = {
				endDate,
				description: 'test',
				formattedDescription: `test${CATEGORICAL_OUTCOMES_SEPARATOR}${marketData.outcomes[0].name}${CATEGORICAL_OUTCOME_SEPARATOR}${marketData.outcomes[1].name}${CATEGORICAL_OUTCOME_SEPARATOR}${marketData.outcomes[2].name}`,
				type: CATEGORICAL,
				isCreatingOrderBook: true,
				outcomes: [
					{ id: 0, name: 'outcome1' },
					{ id: 1, name: 'outcome2' },
					{ id: 2, name: 'outcome3' }
				],
				minValue: 1,
				maxValue: 3,
				numOutcomes: 3
			};

			assert(stubbedUpdateExistingTransaction.updateExistingTransaction.calledTwice, `updateExistingTransaction was not called exactly twice`);
			assert.deepEqual(store.getActions(), out, `a categorical market was not correctly created`);
			assert.deepEqual(marketData, expectedMarketData, 'market data was not correctly mutated');
		});

		it('should be able to create a categorical market WITH an order book', () => {
			marketData = {
				endDate,
				description: 'test',
				type: CATEGORICAL,
				outcomes: [
					{ id: 0, name: 'outcome1' },
					{ id: 1, name: 'outcome2' },
					{ id: 2, name: 'outcome3' }
				]
			};

			store.dispatch(action.createMarket(transID, marketData));

			clock.tick(10000);

			out = [
				{
					type: 'UPDATE_EXISTING_TRANSACTIONS',
					transactionID: transID,
					status: {
						status: 'sending...',
						eventBond: undefined,
						gasFees: undefined,
						marketCreationFee: undefined
					}
				},
				{
					type: 'UPDATE_EXISTING_TRANSACTIONS',
					transactionID: transID,
					status: {
						status: SUCCESS,
						hash: undefined,
						timestamp: undefined,
						data: {
							id: '0x123'
						},
						gasFees: {
							denomination: ' real ETH',
							formatted: '0',
							formattedValue: 0,
							full: '0 real ETH',
							minimized: '0',
							rounded: '0',
							roundedValue: 0,
							value: 0
						}
					}
				},
				{
					type: 'CLEAR_MAKE_IN_PROGRESS'
				}
			];

			expectedMarketData = {
				endDate,
				description: 'test',
				formattedDescription: `test${CATEGORICAL_OUTCOMES_SEPARATOR}${marketData.outcomes[0].name}${CATEGORICAL_OUTCOME_SEPARATOR}${marketData.outcomes[1].name}${CATEGORICAL_OUTCOME_SEPARATOR}${marketData.outcomes[2].name}`,
				type: CATEGORICAL,
				outcomes: [
					{ id: 0, name: 'outcome1' },
					{ id: 1, name: 'outcome2' },
					{ id: 2, name: 'outcome3' }
				],
				minValue: 1,
				maxValue: 3,
				numOutcomes: 3
			};

			assert(stubbedUpdateExistingTransaction.updateExistingTransaction.calledTwice, `updateExistingTransaction was not called exactly twice`);
			assert.deepEqual(store.getActions(), out, `a categorical market was not correctly created`);
			assert.deepEqual(marketData, expectedMarketData, 'market data was not correctly mutated');
		});
	});
});
