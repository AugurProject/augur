import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/transactions/actions/update-existing-transaction.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let out;
	let test;
	const state = Object.assign({}, testState);
	const store = mockStore(state);
	const mockUpdateTransData = {};
	const mockUpdateAssets = {};
	const mockFunc = () => ({ type: 'UPDATE_TRANSACTION_DATA' });

	mockUpdateTransData.updateTransactionsData = sinon.stub().returns(mockFunc());
	mockUpdateAssets.updateAssets = sinon.stub().returns({
		type: 'UPDATE_ASSETS'
	});

	const action = proxyquire('../../../src/modules/transactions/actions/update-existing-transaction', {
		'../../transactions/actions/update-transactions-data': mockUpdateTransData,
		'../../auth/actions/update-assets': mockUpdateAssets
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	it(`should update an existing transaction`, () => {
		test = {
			id: 'testtransaction12345',
			message: 'test message!',
			status: 'success',
			type: 'register'
		};

		out = [{
			type: 'UPDATE_TRANSACTION_DATA'
		}, {
			type: 'UPDATE_ASSETS'
		}];

		store.dispatch(action.updateExistingTransaction(test.id, test));

		assert(mockUpdateTransData.updateTransactionsData.calledOnce);
		assert(mockUpdateAssets.updateAssets.calledOnce);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected action objects`);
	});

	it(`shouldn't dispatch actions if there is no transaction data to update`, () => {
		test = {
			id: 'test'
		};
		state.transactionsData = {};
		store.dispatch(action.updateExistingTransaction(test.id, test));
		assert(store.getActions(), [], `Dispatched actions when it shouldn't have.`);
	});
});
