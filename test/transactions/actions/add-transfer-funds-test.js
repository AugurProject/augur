import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/transactions/actions/add-transfer-funds-transaction.js`, () => {
	proxyquire.noPreserveCache();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	const store = mockStore(testState);
	const fakeProcessTransferFunds = { processTransferFunds: () => {} };
	const fakeAddTransactions = { addTransaction: () => {} };

	sinon.stub(fakeProcessTransferFunds, 'processTransferFunds', (transID, fromAddress, amount, currency, toAddress) => ({
		type: 'PROCESS_TRANSFER_FUNDS',
		transID,
		fromAddress,
		amount,
		currency,
		toAddress
	}));

	sinon.stub(fakeAddTransactions, 'addTransaction', (data) => ({
		type: 'ADD_TRANSACTION',
		...data
	}));

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	const action = proxyquire('../../../src/modules/transactions/actions/add-transfer-funds-transaction', {
		'../../transactions/actions/add-transactions': fakeAddTransactions,
		'../../auth/actions/process-transfer-funds': fakeProcessTransferFunds
	});

	it('should add a transfer funds transaction', () => {
		store.dispatch(action.addTransferFunds(5, 'eth', 'testAddress123'));
		store.getActions()[0].action('testTransactionID');
		const expectedOutput = [
			{
				type: 'transfer_funds',
				fromAddress: '0x0000000000000000000000000000000000000001',
				amount: 5,
				currency: 'eth',
				toAddress: 'testAddress123',
				action: store.getActions()[0].action
			},
			{
				type: 'PROCESS_TRANSFER_FUNDS',
				transID: 'testTransactionID',
				fromAddress: '0x0000000000000000000000000000000000000001',
				amount: 5,
				currency: 'eth',
				toAddress: 'testAddress123'
			}
		];

		assert.deepEqual(store.getActions(), expectedOutput, `actions dispatched didn't match up with expected dispatched actions`);

		assert(fakeProcessTransferFunds.processTransferFunds.calledOnce, `processTransferFunds wasn't called once as expected`);
		assert(fakeAddTransactions.addTransaction.calledOnce, `addTransaction wasn't called once as expected`);
	});
});
