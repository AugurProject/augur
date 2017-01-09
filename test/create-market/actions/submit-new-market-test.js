import { describe, it, before, beforeEach, afterEach } from 'mocha';
import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from 'test/testState';
import {
	BINARY,
	CATEGORICAL,
	SCALAR
} from 'modules/markets/constants/market-types';
import {
	SUCCESS,
	FAILED
} from 'modules/transactions/constants/statuses';
import { CATEGORICAL_OUTCOMES_SEPARATOR, CATEGORICAL_OUTCOME_SEPARATOR } from 'modules/markets/constants/market-outcomes';

describe(`modules/create-market/actions/submit-new-market.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	let out;
	let clock;
	let marketData = {};
	let expectedMarketData = {};
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	const transID = 'testtransaction12345';
	const endDate = { value: new Date() };
	const failedMarketData = {
		type: BINARY,
		minValue: 1,
		maxValue: 2,
		numOutcomes: 2,
		endDate,
		expirySource: true,
		failTest: FAILED
	};
	const state = Object.assign({}, testState);
	const store = mockStore(state);
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
		store.dispatch(action.submitNewMarket({ id: 'market', endDate }));
		out = [{
			type: 'CLEAR_MAKE_IN_PROGRESS'
		}];
		assert(stubbedLink.selectTransactionsLink.calledOnce, 'selectTransactionsLink was not called once');
		assert.deepEqual(store.getActions(), out, `Didn't correctly create a new market`);
		global.window = {};
		store.clearActions();
	});

	describe('submitNewMarket states', () => {

		const endDate = { value: new Date() };

		beforeEach(() => {
			store.clearActions();
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
			store.dispatch(action.submitNewMarket(failedMarketData));
			out = [];
			assert.deepEqual(store.getActions(), out, `submitNewMarket did not fail correctly`);
		});

		it('should be able to create a binary market WITH an order book', () => {
			marketData = {
				endDate,
				type: BINARY,
				isCreatingOrderBook: true
			};
			store.dispatch(action.submitNewMarket(marketData));
			clock.tick(10000);
			out = [{
				type: 'CLEAR_MAKE_IN_PROGRESS'
			}, {
				type: 'submitGenerateOrderBook'
			}];
			expectedMarketData = {
				endDate,
				type: BINARY,
				isCreatingOrderBook: true,
				minValue: 1,
				maxValue: 2,
				numOutcomes: 2
			};
			assert.deepEqual(store.getActions(), out, `a binary market was not correctly created`);
			assert.deepEqual(marketData, expectedMarketData, 'market data was not correctly mutated');
		});

		it('should be able to create a binary market WITHOUT an order book', () => {
			marketData = { endDate, type: BINARY };
			store.dispatch(action.submitNewMarket(marketData));
			clock.tick(10000);
			out = [{
				type: 'CLEAR_MAKE_IN_PROGRESS'
			}];
			expectedMarketData = {
				endDate,
				type: BINARY,
				minValue: 1,
				maxValue: 2,
				numOutcomes: 2
			};
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
			store.dispatch(action.submitNewMarket(marketData));
			clock.tick(10000);
			out = [{
				type: 'CLEAR_MAKE_IN_PROGRESS'
			}, {
				type: 'submitGenerateOrderBook'
			}];
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

			store.dispatch(action.submitNewMarket(marketData));
			clock.tick(10000);
			out = [{
				type: 'CLEAR_MAKE_IN_PROGRESS'
			}];
			expectedMarketData = {
				endDate,
				type: SCALAR,
				scalarSmallNum: 10,
				scalarBigNum: 100,
				minValue: 10,
				maxValue: 100,
				numOutcomes: 2
			};
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
			store.dispatch(action.submitNewMarket(marketData));
			clock.tick(10000);
			out = [{
				type: 'CLEAR_MAKE_IN_PROGRESS'
			}, {
				type: 'submitGenerateOrderBook'
			}];
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
			store.dispatch(action.submitNewMarket(marketData));
			clock.tick(10000);
			out = [{
				type: 'CLEAR_MAKE_IN_PROGRESS'
			}];
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
			assert.deepEqual(store.getActions(), out, `a categorical market was not correctly created`);
			assert.deepEqual(marketData, expectedMarketData, 'market data was not correctly mutated');
		});
	});
});
