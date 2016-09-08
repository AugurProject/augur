import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/auth/actions/process-transfer-funds.js`, () => {
	proxyquire.noPreserveCache();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	const store = mockStore(testState);
	const fakeAugurJS = { sendCashFrom: () => {} };
	const fakeUpdateTrans = { updateExistingTransaction: () => {} };
	const fakeUpdateAssets = { updateAssets: () => {} };

	sinon.stub(fakeAugurJS, 'sendCashFrom', (toAddress, amount, fromAddress, onSent, onSuccess, onFailed, onConfirmed) => {
		onSent();
		onSuccess({ hash: '0xdeadbeef' });
		onFailed({ message: 'this is a failure message' });
	});

	sinon.stub(fakeUpdateTrans, 'updateExistingTransaction', (transID, data) => {
		return { type: 'UPDATE_EXISTING_TRANSACTIONS', data: { ...data}};
	});

	sinon.stub(fakeUpdateAssets, 'updateAssets', () => {
		return { type: 'UPDATE_ASSETS' };
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	const fakeAugur = { augur: fakeAugurJS };

	const action = proxyquire('../../../src/modules/auth/actions/process-transfer-funds', {
		'../../../services/augurjs': fakeAugur,
		'../../transactions/actions/update-existing-transaction': fakeUpdateTrans,
		'../../auth/actions/update-assets': fakeUpdateAssets
	});

	it('should process the transfer of funds from one account to another', () => {
		store.dispatch(action.processTransferFunds('myTransactionID', 'fromTestAddress123', 5, 'toTestAddress456'));
		const actual = store.getActions();
		const expected = [{
			type: 'UPDATE_EXISTING_TRANSACTIONS',
			data: {
				status: 'submitting a request to transfer 5 ETH to toTestAddress456...'
			}
		}, {
			type: 'UPDATE_EXISTING_TRANSACTIONS',
			data: {
				status: 'processing transferring of 5 ETH to toTestAddress456'
			}
		}, {
			type: 'UPDATE_EXISTING_TRANSACTIONS',
			data: {
				status: 'success',
				hash: '0xdeadbeef',
				message: 'Transfer of 5 ETH to toTestAddress456 Complete.'
			}
		}, {
			type: 'UPDATE_ASSETS'
		}, {
			type: 'UPDATE_EXISTING_TRANSACTIONS',
			data: {
				status: 'failed',
				message: 'this is a failure message'
			}
		}];

		assert.deepEqual(actual, expected, `Didn't dispatch the expected actions.`);

		assert(fakeAugurJS.sendCashFrom.calledOnce, `augur.sendCashFrom wasn't called exactly once as expected.`);
		assert((fakeUpdateTrans.updateExistingTransaction.callCount === 4), `updateExistingTransaction wasn't called 4 times as expected.`);
		assert(fakeUpdateAssets.updateAssets.calledOnce, `updateAssets wasn't called once as expected.`);

	});

});
