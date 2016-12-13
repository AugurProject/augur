import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from 'test/testState';

describe(`modules/transactions/actions/add-fund-new-account-transaction.js`, () => {
	proxyquire.noPreserveCache();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	const store = mockStore(testState);
	const fakeProcessFundNewAccount = { processFundNewAccount: () => {} };
	const fakeAddTransactions = { addTransaction: () => {} };

	sinon.stub(fakeProcessFundNewAccount, 'processFundNewAccount', (transID, address) => ({
		type: 'FUND_NEW_ACCOUNT',
		transID,
		address
	}));

	sinon.stub(fakeAddTransactions, 'addTransaction', data => ({
		type: 'ADD_TRANSACTION',
		...data
	}));

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	const action = proxyquire('../../../src/modules/transactions/actions/add-fund-new-account-transaction', {
		'../../transactions/actions/add-transactions': fakeAddTransactions,
		'../../auth/actions/process-fund-new-account': fakeProcessFundNewAccount
	});

	it('should fund a new account', () => {
		store.dispatch(action.addFundNewAccount('testAddress123'));
		store.getActions()[0].action('testTransactionID');

		const expectedOutput = [
			{
				type: 'fund_account',
				address: 'testAddress123',
				action: store.getActions()[0].action
			},
			{
				type: 'FUND_NEW_ACCOUNT',
				transID: 'testTransactionID',
				address: 'testAddress123'
			}
		];

		assert.deepEqual(store.getActions(), expectedOutput, `actions dispatched didn't match up with expected dispatched actions`);

		assert(fakeProcessFundNewAccount.processFundNewAccount.calledOnce, `fundNewAccount wasn't called once as expected`);
		assert(fakeAddTransactions.addTransaction.calledOnce, `addTransaction wasn't called once as expected`);
	});
});
