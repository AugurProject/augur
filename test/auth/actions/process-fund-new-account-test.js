import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from 'test/testState';

describe(`modules/auth/actions/process-fund-new-account.js`, () => {
	proxyquire.noPreserveCache();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	const store = mockStore(testState);
	const fakeAugurJS = {
		fundNewAccount: () => {},
		Register: { register: () => {} }
	};
	const fakeUpdateTrans = { updateExistingTransaction: () => {} };
	const fakeUpdateAssets = { updateAssets: () => {} };

	sinon.stub(fakeAugurJS.Register, 'register', (o) => {
		o.onSent();
		o.onSuccess({ hash: '0xbeef' });
		o.onFailed({ message: 'this is a failure message' });
	});

	sinon.stub(fakeAugurJS, 'fundNewAccount', (env, address, branch, onSent, onSuccess, onFailed) => {
		onSent();
		onSuccess({ hash: '0xdeadbeef' });
		onFailed({ message: 'this is a failure message' });
	});

	sinon.stub(fakeUpdateTrans, 'updateExistingTransaction', (transID, data) => ({ type: 'UPDATE_EXISTING_TRANSACTIONS', transID: { ...data } }));

	sinon.stub(fakeUpdateAssets, 'updateAssets', () => ({ type: 'UPDATE_ASSETS' }));

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	const action = proxyquire('../../../src/modules/auth/actions/process-fund-new-account', {
		'../../../services/augurjs': fakeAugurJS,
		'../../transactions/actions/update-existing-transaction': fakeUpdateTrans,
		'../../auth/actions/update-assets': fakeUpdateAssets
	});

	it('should fund a new account', () => {
		store.dispatch(action.processFundNewAccount('myTransactionID', 'testAddress123'));

		assert(fakeAugurJS.fundNewAccount.calledOnce, `augurJS.fundNewAccount wasn't called once as expected.`);
		assert((fakeUpdateTrans.updateExistingTransaction.callCount === 4), `updateExistingTransaction wasn't called four times as expected`);
		assert(fakeUpdateAssets.updateAssets.calledOnce, `updateAssets wasn't called once as expected`);
	});

});
