import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from 'test/testState';

describe(`modules/transactions/actions/add-transactions.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let out;
	const state = Object.assign({}, testState);
	const store = mockStore(state);
	const mockUpdateTrans = {};
	mockUpdateTrans.updateTransactionsData = sinon.stub().returns({
		type: 'UPDATE_TRANSACTIONS_DATA'
	});

	const action = proxyquire('../../../src/modules/transactions/actions/add-transactions.js', {
		'../../transactions/actions/update-transactions-data': mockUpdateTrans
	});

	beforeEach(() => {
		store.clearActions();
		global.window = {};
		global.window.performance = {
			now: () => Date.now()
		};
	});

	afterEach(() => {
		global.window = {};
		store.clearActions();
	});

	it(`should add transactions`, () => {
		out = [{
			type: 'UPDATE_TRANSACTIONS_DATA'
		}];
		const transactionsArray = [{
			test1: {
				status: 'pending'
			}
		}, {
			test2: {
				status: 'pending'
			}
		}];
		store.dispatch(action.addTransactions(transactionsArray));
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected action`);
		assert(mockUpdateTrans.updateTransactionsData.calledOnce, `Didn't call updateTransactionsData one time as expected`);
	});

	it(`should add a transaction`, () => {
		mockUpdateTrans.updateTransactionsData.reset();
		out = [{
			type: 'UPDATE_TRANSACTIONS_DATA'
		}];
		const transaction = {
			test1: {
				status: 'pending'
			}
		};
		store.dispatch(action.addTransaction(transaction));

		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected action`);
		assert(mockUpdateTrans.updateTransactionsData.calledOnce, `Didn't call updateTransactionsData one time as expected`);
	});

	it(`should make a transactions ID`, () => {
		/*
		This test might be a bad one because it assumes that there will be no
		time between setting the expected output and running the
		makeTransactionID. if there is this may report as failing
		when it's not.
		*/
		global.window.performance.now = () => 10;
		out = Math.round(Date.now() + (10 * 100));
		assert(action.makeTransactionID(), out, `Didn't create the expected transactionID`);
	});

});
