import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe.skip(`modules/transactions/actions/add-trade-transaction.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, action, out;
	let state = Object.assign({}, testState);
	store = mockStore(state);
	let mockTrade = {};
	let mockTrans = {};

	mockTrade.tradeShares = sinon.stub().returns({
		type: 'TRADE_SHARES'
	});
	mockTrans.addTransaction = sinon.stub().returns({
		type: 'TEST'
	});

	action = proxyquire('../../../src/modules/transactions/actions/add-trade-transaction.js', {
		'../../trade/actions/place-trade': mockTrade,
		'../../transactions/actions/add-transactions': mockTrans
	});

	beforeEach(() => {
		store.clearActions()
	});

	afterEach(() => {
		store.clearActions()
	});

	it(`should add a trade transaction`, () => {
		let market = {
			id: 'test1',
			description: 'test description'
		};
		let outcome = {
			id: 'testOutcome1',
			name: 'testOutcome1'
		};
		out = [{
			type: 'TEST'
		}];
		store.dispatch(action.addTradeTransaction(false, market, outcome, 10, 5.0, 2.0, 1));
		assert(mockTrans.addTransaction.calledOnce, `Didn't call addTransaction only once as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected action given the mock`);
	});

	it(`should make a trade transaction`, () => {
		let market = {
			id: 'test1',
			description: 'test description'
		};
		let outcome = {
			id: 'testOutcome1',
			name: 'testOutcome1'
		};

		store.dispatch(action.makeTradeTransaction(false, market, outcome, 10, 5.0, 2.0, 1, store.dispatch));
		out = [{
			type: 'buy_shares',
			shares: 10,
			ether: 7,
			gas: 1,
			data: {
				marketID: 'test1',
				outcomeID: 'testOutcome1',
				marketDescription: 'test description',
				outcomeName: 'testOutcome1',
				avgPrice: {
					value: 0.5,
					formattedValue: 0.5,
					formatted: '+0.50',
					roundedValue: 0.5,
					rounded: '+0.5',
					minimized: '+0.5',
					denomination: 'Eth',
					full: '+0.50Eth'
				},
				totalFee: {
					value: 2,
					formattedValue: 2,
					formatted: '+2.00',
					roundedValue: 2,
					rounded: '+2.0',
					minimized: '+2',
					denomination: 'Eth',
					full: '+2.00Eth'
				}
			},
			action: store.getActions()[0].action
		}, {
			type: 'TRADE_SHARES'
		}];
		// confirm that our mock was properly attached to the action function.
		store.getActions()[0].action();

		assert(mockTrade.tradeShares.calledOnce, `tradeShares wasn't called one time only as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't produce the expected action`);
	});
});
