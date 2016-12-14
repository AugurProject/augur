import { describe, it, beforeEach, afterEach } from 'mocha';
import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from 'test/testState';

describe(`modules/transactions/actions/add-create-market-transaction.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let out;
	const state = Object.assign({}, testState);
	const store = mockStore(state);
	const mockSubmit = {
		createMarket: () => {}
	};
	const mockAdd = {
		addTransaction: () => {}
	};

	sinon.stub(mockSubmit, 'createMarket', (id, data) => ({
		type: 'CREATE_MARKET',
		id,
		data
	}));

	sinon.stub(mockAdd, `addTransaction`, arg => ({
		type: 'ADD_TRANSACTION',
		data: arg
	}));

	const action = proxyquire('../../../src/modules/transactions/actions/add-create-market-transaction.js', {
		'../../create-market/actions/submit-new-market': mockSubmit,
		'../../transactions/actions/add-transactions': mockAdd
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	it(`should add and create a new create market transaction`, () => {
		const marketData = {
			id: 'testMarket1'
		};
		store.dispatch(action.addCreateMarketTransaction(marketData, 1, 5));
		out = [{
			type: 'ADD_TRANSACTION',
			data: {
				type: 'create_market',
				gas: 1,
				ether: 5,
				data: {
					id: 'testMarket1'
				},
				action: store.getActions()[0].data.action
			}
		}, {
			type: 'CREATE_MARKET',
			id: undefined,
			data: {
				id: 'testMarket1'
			}
		}];

		store.getActions()[0].data.action();

		assert(mockSubmit.createMarket.calledOnce, `createMarket wasn't called exactly once as expected`);
		assert(mockAdd.addTransaction.calledOnce, `addTransaction wasn't called once as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected action objects`);
	});
});
