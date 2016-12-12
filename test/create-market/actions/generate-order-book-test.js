import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert } from 'chai';
import BigNumber from 'bignumber.js';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

import { GENERATE_ORDER_BOOK } from '../../../src/modules/transactions/constants/types';

import {
    SUCCESS,
    FAILED,
    GENERATING_ORDER_BOOK,
    COMPLETE_SET_BOUGHT,
    ORDER_BOOK_ORDER_COMPLETE,
    ORDER_BOOK_OUTCOME_COMPLETE
} from '../../../src/modules/transactions/constants/statuses';

describe('modules/create-market/actions/generate-order-book.js', () => {

	proxyquire.noPreserveCache().noCallThru();

	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	const state = Object.assign({}, testState);

	const store = mockStore(state);

	const marketData = {
		id: 'test-market-id',
		liquidity: 50,
		initialFairPrices: [
			'0.5',
			'0.5'
		],
		startingQuantity: 10,
		bestStartingQuantity: 20,
		isSimulation: false
	};

	const orderBookTransactions = {
		addGenerateOrderBookTransaction: () => {}
	};

	const stubbedTransactions = sinon.stub(Object.assign({}, orderBookTransactions));
	stubbedTransactions.addGenerateOrderBookTransaction.withArgs(marketData).returns({
		type: GENERATE_ORDER_BOOK,
		data: marketData,
		action: 'create order book action'
	});

	const stubbedUpdateTransaction = {
		updateExistingTransaction: () => {}
	};

	sinon.stub(stubbedUpdateTransaction, 'updateExistingTransaction', (transactionID, status) => ({
		type: 'UPDATE_EXISTING_TRANSACTIONS',
		transactionID,
		status
	}));

	const stubbedAugurJS = {
		generateOrderBook: () => {},
		abi: { bignum: () => {} }
	};
	sinon.stub(stubbedAugurJS, 'generateOrderBook');
	sinon.stub(stubbedAugurJS.abi, 'bignum', n => new BigNumber(n, 10));

	const action = proxyquire(
    '../../../src/modules/create-market/actions/generate-order-book',
		{
			'../../../services/augurjs': stubbedAugurJS,
			'../../transactions/actions/add-generate-order-book-transaction': stubbedTransactions,
			'../../transactions/actions/update-existing-transaction': stubbedUpdateTransaction
		}
	);

	let clock;
	beforeEach(() => {
		clock = sinon.useFakeTimers();
		store.clearActions();

		global.window = {};
		global.window.performance = {
			now: () => Date.now()
		};
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

	afterEach(() => {
		clock.restore();
		global.window = {};
		store.clearActions();
	});

	it('should be able to submit a request to generate an order book', () => {
		store.dispatch(action.submitGenerateOrderBook(marketData));

		const out = [{
			type: GENERATE_ORDER_BOOK,
			data: marketData,
			action: 'create order book action'
		}];

		assert(stubbedTransactions.addGenerateOrderBookTransaction.calledOnce, `addGenerateOrderOrderBookTransaction wasn't called once as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't correctly submit an order book`);
	});

	it('should be able to generate an order book', () => {
		store.dispatch(action.createOrderBook('trans123', marketData));

		assert(stubbedAugurJS.generateOrderBook.calledOnce, `generateOrderBook wasn't called once as expected`);
		assert.deepEqual(store.getActions(), [{
			type: 'UPDATE_EXISTING_TRANSACTIONS',
			transactionID: 'trans123',
			status: {
				status: GENERATING_ORDER_BOOK
			}
		},
		{
			type: 'UPDATE_SELL_COMPLETE_SETS_LOCK',
			isLocked: true,
			marketID: marketData.id
		}], `Didn't correctly create order book`);
	});

	describe('generateOrderBook callbacks', () => {
		beforeEach(() => {
			store.clearActions();
		});

		it('should handle onFailed', () => {
			store.dispatch(
				action.handleGenerateOrderBookResponse(
					{
						message: 'failed'
					},
					null,
					'trans123'
				)
			);

			assert.deepEqual(store.getActions(), [{
				type: 'UPDATE_EXISTING_TRANSACTIONS',
				transactionID: 'trans123',
				status: {
					status: FAILED,
					message: 'failed'
				}
			}], `Didn't correctly handle onFailed callback`);
		});

		it('should handle onSuccess', () => {
			store.dispatch(
				action.handleGenerateOrderBookResponse(
					null,
					{
						status: SUCCESS
					},
					'trans123'
				)
			);

			assert.deepEqual(store.getActions(), [{
				type: 'UPDATE_EXISTING_TRANSACTIONS',
				transactionID: 'trans123',
				status: {
					status: SUCCESS,
					gasFees: {
						denomination: ' real ETH',
						formatted: '0',
						formattedValue: 0,
						full: '0 real ETH',
						minimized: '0',
						rounded: '0.0000',
						roundedValue: 0,
						value: 0
					},
					message: null
				}
			}], `Didn't correctly handle onSuccess callback`);
		});

		it('should handle onBuyCompleteSets', () => {
			store.dispatch(
				action.handleGenerateOrderBookResponse(
					null,
					{
						status: COMPLETE_SET_BOUGHT,
						payload: {
							hash: '0xdeadbeef',
							gasFees: 2,
							timestamp: 1
						}
					},
					'trans123'
				)
		);

			assert.deepEqual(store.getActions(), [{
				type: 'UPDATE_EXISTING_TRANSACTIONS',
				transactionID: 'trans123',
				status: {
					status: COMPLETE_SET_BOUGHT,
					message: null,
					gasFees: {
						denomination: ' real ETH',
						formatted: '2.0000',
						formattedValue: 2,
						full: '2.0000 real ETH',
						minimized: '2',
						rounded: '2.0000',
						roundedValue: 2,
						value: 2
					},
					hash: '0xdeadbeef',
					timestamp: 1
				}
			}], `Didn't correctly handle onCompleteSets callback`);
		});

		it('should handle onSetupOutcome', () => {
			store.dispatch(
				action.handleGenerateOrderBookResponse(
					null,
					{
						status: ORDER_BOOK_OUTCOME_COMPLETE,
						payload: {
							outcome: 1
						}
					},
					'trans123',
					{
						outcomes: [
							{
								name: 'outcome 1'
							}
						]
					}
				)
			);

			assert.deepEqual(store.getActions(), [{
				type: 'UPDATE_EXISTING_TRANSACTIONS',
				transactionID: 'trans123',
				status: {
					status: ORDER_BOOK_OUTCOME_COMPLETE,
					gasFees: {
						denomination: ' real ETH',
						formatted: '2.0000',
						formattedValue: 2,
						full: '2.0000 real ETH',
						minimized: '2',
						rounded: '2.0000',
						roundedValue: 2,
						value: 2
					},
					message: `Order book creation for outcome 'outcome 1' completed.`
				}
			}], `Didn't correctly handle onSetupOutcome callback`);
		});

		it('should handle onSetupOrder', () => {
			store.dispatch(
				action.handleGenerateOrderBookResponse(
					null,
					{
						status: ORDER_BOOK_ORDER_COMPLETE,
						payload: {
							buyPrice: 1,
							amount: 1,
							outcome: 1
						}
					},
					'trans123',
					{
						outcomes: [
							{
								name: 'outcome 1'
							}
						]
					}
				)
			);

			assert.deepEqual(store.getActions(), [{
				type: 'UPDATE_EXISTING_TRANSACTIONS',
				transactionID: 'trans123',
				status: {
					status: ORDER_BOOK_ORDER_COMPLETE,
					hash: undefined,
					timestamp: undefined,
					gasFees: {
						denomination: ' real ETH',
						formatted: '2.0000',
						formattedValue: 2,
						full: '2.0000 real ETH',
						minimized: '2',
						rounded: '2.0000',
						roundedValue: 2,
						value: 2
					},
					message: `Bid for 1 share of outcome 'outcome 1' at 1 ETH created.`
				}
			}], `Didn't correctly handle onSetupOutcome callback`);
		});
	});
});
