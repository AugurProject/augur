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

describe(`modules/create-market/actions/submit-new-market.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);

	let store,
		action,
		out,
		clock,
		transID = 'trans123',
		branchID = 1010101,
		failedMarketData = {
			type: BINARY,
			minValue: 1,
			maxValue: 2,
			numOutcomes: 2,
			failTest: FAILED
		},
		marketData = {},
		expectedMarketData = {},
		testData = {
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
		},
		state = Object.assign({}, testState);
	
	store = mockStore(state);

	let stubbedNewMarketTransactions = {
		addCreateMarketTransaction: () => {}
	};
	sinon.stub(stubbedNewMarketTransactions, 'addCreateMarketTransaction', (newMarket) => testData);

	let stubbedUpdateExistingTransaction = {
		updateExistingTransaction: () => {}
	};
	sinon.stub(stubbedUpdateExistingTransaction, 'updateExistingTransaction', (transactionID, status) => {
		return {
			type: 'UPDATE_EXISTING_TRANSACTIONS',
			transactionID,
			status
		};
	});

	let stubbedAugurJS = {
		createMarket: () => {}
	};
	stubbedAugurJS.createMarket = sinon.stub();
	stubbedAugurJS.createMarket.withArgs(branchID, failedMarketData).callsArg(2).yields(
		{
			status: FAILED,
			message: 'error!'
		}
	);
	stubbedAugurJS.createMarket.callsArg(2).yields(
		null,
		{
			marketID: 'test123',
			status: SUCCESS
		}
	);
    
	let stubbedLoadMarket = {
		loadMarket: () => {}
	};
	stubbedLoadMarket.loadMarket = sinon.stub().returns({
		type: 'loadMarket'
	});
    
	let stubbedGenerateOrderBook = {
		submitGenerateOrderBook: () => {}
	};
	sinon.stub(stubbedGenerateOrderBook, 'submitGenerateOrderBook', (data) => {
		return {
			type: 'submitGenerateOrderBook'
		};
	});
    
	action = proxyquire(
		'../../../src/modules/create-market/actions/submit-new-market',
		{
			'../../transactions/actions/add-create-market-transaction': stubbedNewMarketTransactions,
			'../../transactions/actions/update-existing-transaction': stubbedUpdateExistingTransaction,
			'../../../services/augurjs': stubbedAugurJS,
			'../../market/actions/load-market': stubbedLoadMarket,
			'../../create-market/actions/generate-order-book': stubbedGenerateOrderBook
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
			type: 'SHOW_LINK',
			parsedURL: {
				pathArray: ['/transactions'],
				searchParams: {},
				url: '/transactions'
			}
		}, {
			type: 'UPDATE_TRANSACTIONS_DATA',
			'test123': {
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
        
		assert(stubbedNewMarketTransactions.addCreateMarketTransaction.calledOnce, `addCreateMarketTransaction wasn't called once as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't correctly create a new market`);

		global.window = {};
		store.clearActions();
	});

	describe('createMarket states', () => {
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
			store.dispatch(action.createMarket( transID, failedMarketData ));

			out = [
				{
					type: 'UPDATE_EXISTING_TRANSACTIONS',
					transactionID: transID,
					status: { status: 'sending...' }
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

		it('should be able to create a binary market', () => {
			marketData = {
				type: BINARY
			};

			store.dispatch(action.createMarket( transID, marketData ));

			clock.tick(10000);

			out = [
				{
					type: 'UPDATE_EXISTING_TRANSACTIONS',
					transactionID: transID,
					status: { status: 'sending...' }
				},
				{
					type: 'UPDATE_EXISTING_TRANSACTIONS',
					transactionID: transID,
					status: { status: SUCCESS }
				},
				{
					type: 'CLEAR_MAKE_IN_PROGRESS'
				},
				{
					type: 'submitGenerateOrderBook'
				},
				{
					type: 'loadMarket'
				}
			];

			expectedMarketData = {
				type: BINARY,
				minValue: 1,
				maxValue: 2,
				numOutcomes: 2
			};
			
			assert(stubbedUpdateExistingTransaction.updateExistingTransaction.calledTwice, `updateExistingTransaction was not called exactly twice`);
			assert.deepEqual(store.getActions(), out, `a binary market was not correctly created`);
			assert.deepEqual(marketData, expectedMarketData, 'market data was not correctly mutated');
		});

		it('should be able to create a scalar market', () => {
			marketData = {
				type: SCALAR,
				scalarSmallNum: 10,
				scalarBigNum: 100
			};

			store.dispatch(action.createMarket( transID, marketData ));

			clock.tick(10000);

			out = [
				{
					type: 'UPDATE_EXISTING_TRANSACTIONS',
					transactionID: transID,
					status: { status: 'sending...' }
				},
				{
					type: 'UPDATE_EXISTING_TRANSACTIONS',
					transactionID: transID,
					status: { status: SUCCESS }
				},
				{
					type: 'CLEAR_MAKE_IN_PROGRESS'
				},
				{
					type: 'submitGenerateOrderBook'
				},
				{
					type: 'loadMarket'
				}
			];
			
			expectedMarketData = {
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

		it('should be able to create a categorical market', () => {
			marketData = {
				type: CATEGORICAL,
				outcomes: [
					'outcome1',
					'outcome2',
					'outcome3'
				]
			};

			store.dispatch(action.createMarket( transID, marketData ));

			clock.tick(10000);

			out = [
				{
					type: 'UPDATE_EXISTING_TRANSACTIONS',
					transactionID: transID,
					status: { status: 'sending...' }
				},
				{
					type: 'UPDATE_EXISTING_TRANSACTIONS',
					transactionID: transID,
					status: { status: SUCCESS }
				},
				{
					type: 'CLEAR_MAKE_IN_PROGRESS'
				},
				{ 
					type: 'submitGenerateOrderBook' 
				},
				{
					type: 'loadMarket'
				}
			];

			expectedMarketData = {
				type: CATEGORICAL,
				outcomes: [
					'outcome1',
					'outcome2',
					'outcome3'
				],
				minValue: 1,
				maxValue: 2,
				numOutcomes: 3
			};

			assert(stubbedUpdateExistingTransaction.updateExistingTransaction.calledTwice, `updateExistingTransaction was not called exactly twice`);
			assert.deepEqual(store.getActions(), out, `a categorical market was not correctly created`);
			assert.deepEqual(marketData, expectedMarketData, 'market data was not correctly mutated');
		});
	});
});
