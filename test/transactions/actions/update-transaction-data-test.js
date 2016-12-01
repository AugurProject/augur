import { describe, it } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/transactions/actions/update-transactions-data.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let out;
	const state = Object.assign({}, testState);
	const store = mockStore(state);
	const fakeAction = {
		type: 'PROCESS_TRANSACTIONS',
		data: 'test'
	};
	const mock = {};

	mock.processTransactions = sinon.stub().returns(fakeAction);

	const action = proxyquire('../../../src/modules/transactions/actions/update-transactions-data', {
		'../../transactions/actions/process-transactions': mock
	});

	it(`should fire update and process transaction actions`, () => {
		out = [{
			type: 'UPDATE_TRANSACTIONS_DATA',
			transactionsData: {
				test: 'testTransactionData'
			}
		}, {
			type: 'PROCESS_TRANSACTIONS',
			data: 'test'
		}];

		store.dispatch(action.updateTransactionsData({
			test: 'testTransactionData'
		}));

		assert(mock.processTransactions.calledOnce, `processTransaction's wasn't called once.`);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the correct actions`);
	});

});
