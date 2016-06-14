import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe.skip(`modules/trade/actions/place-trade.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, action, out;
	let state = Object.assign({}, testState);
	store = mockStore(state);
	let mockAugurJS = {};
	let mockAddTrans = {};
	let mockUpdTrans = {
		updateExistingTransaction: () => {}
	};
	let mockUpdTrade = {};
	let mockLoadAcc = {};
	let mockMarket = {};
	let mockLinks = {
		selectTransactionsLink: () => {}
	};
	mockAugurJS.tradeShares = sinon.stub().yields(null, {
		status: 'testing'
	});
	mockAddTrans.addTransaction = sinon.stub().returns({
		type: 'ADD_TRANSACTIONS',
		transactionsOrders: 6
	});
	sinon.stub(mockUpdTrans, 'updateExistingTransaction', (...args) => {
		return {type: 'UPDATE_EXISTING_TRANSACTION', ...args
		};
	});
	mockUpdTrade.clearTradeInProgress = sinon.stub().returns({
		type: 'CLEAR_TRADE_IN_PROGRESS'
	});
	mockLoadAcc.loadAccountTrades = sinon.stub().returns({
		type: 'LOAD_ACCOUNT_TRADES'
	});
	mockMarket.selectMarket = sinon.stub().returns({
		tradeSummary: {
			tradeOrders: [1, 2, 3]
		}
	});
	sinon.stub(mockLinks, 'selectTransactionsLink', (dispatch) => {
		return {
			onClick: () => dispatch({
				type: 'SELECT_TRANSACTIONS_LINK'
			})
		};
	});

	action = proxyquire('../../../src/modules/trade/actions/place-trade.js', {
		'../../../services/augurjs': mockAugurJS,
		'../../transactions/actions/add-transactions': mockAddTrans,
		'../../transactions/actions/update-existing-transaction': mockUpdTrans,
		'../../trade/actions/update-trades-in-progress': mockUpdTrade,
		'../../positions/actions/load-account-trades': mockLoadAcc,
		'../../market/selectors/market': mockMarket,
		'../../link/selectors/links': mockLinks
	});

	beforeEach(() => {
		store.clearActions();
		mockAugurJS.tradeShares.reset();
		mockAddTrans.addTransaction.reset();
		mockUpdTrans.updateExistingTransaction.reset();
		mockUpdTrade.clearTradeInProgress.reset();
		mockLoadAcc.loadAccountTrades.reset();
		mockMarket.selectMarket.reset();
		mockLinks.selectTransactionsLink.reset();
	});

	afterEach(() => {
		store.clearActions();
	});

	it(`should place trades correctly`, () => {
		let marketID = 'test1';
		out = [{
			type: 'ADD_TRANSACTIONS',
			transactionsOrders: 6
		}, {
			type: 'CLEAR_TRADE_IN_PROGRESS'
		}, {
			type: 'SELECT_TRANSACTIONS_LINK'
		}];

		store.dispatch(action.placeTrade(marketID));

		assert(mockAddTrans.addTransaction.calledOnce, `Didn't call addTransaction once as expected`);
		assert(mockUpdTrade.clearTradeInProgress.calledOnce, `Didn't called clearTradeInProgress() once as expected`);
		assert(mockMarket.selectMarket.calledOnce, `Didn't call selectMarket once as expected`);
		assert(mockLinks.selectTransactionsLink.calledOnce, `Didn't call selectTransactionsLink once as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected action objects`);
	});

	it(`should trade shares correctly`, () => {
		out = [{
			'0': {
				testTrans1: {
					status: 'sending...'
				}
			},
			type: 'UPDATE_EXISTING_TRANSACTION'
		}, {
			type: 'LOAD_ACCOUNT_TRADES'
		}, {
			'0': 'testTrans1',
			'1': {
				status: 'testing'
			},
			type: 'UPDATE_EXISTING_TRANSACTION'
		}];

		store.dispatch(action.tradeShares('testTrans1', 'test1', 'testOutcome1', 3, 20, 20));

		assert(mockUpdTrans.updateExistingTransaction.calledTwice, `updateExistingTransaction wasn't called 2 times as expeted`);
		assert(mockLoadAcc.loadAccountTrades.calledOnce, `loadAccountTrades wasn't called one time as expected`);
		assert(mockAugurJS.tradeShares.calledOnce, `AugurJS.tradeShares() wasn't called once as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't produce the expected dispatched actions`);
	});
});
