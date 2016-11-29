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
	const fakeAugurJS = { sendCashFrom: () => {}, sendReputation: () => {}, sendEther: () => {}, abi: { format_address: () => {} } };
	const fakeUpdateTrans = { updateExistingTransaction: () => {} };
	const fakeUpdateAssets = { updateAssets: () => {} };
	const fakeFormatRealEther = { formatRealEther: () => {} };

	sinon.stub(fakeAugurJS, 'sendCashFrom', (toAddress, amount, fromAddress, onSent, onSuccess, onFailed) => {
		onSent();
		onSuccess({ hash: '0xdeadbeef', timestamp: 1, gasFees: 10 });
		onFailed({ message: `This is a failure message...You're a FAILURE!` });
	});

	sinon.stub(fakeAugurJS, 'sendEther', (to, value, from, onSent, onSuccess, onFailed) => {
		if (to.to) {
			to.onSent();
			to.onSuccess({ hash: '0xdeadbeef', timestamp: 1, gasFees: 10 });
			to.onFailed({ message: `This is a failure message...You're a FAILURE!` });
		} else {
			onSent();
			onSuccess({ hash: '0xdeadbeef', timestamp: 1, gasFees: 10 });
			onFailed({ message: `This is a failure message...You're a FAILURE!` });
		}
	});

	sinon.stub(fakeAugurJS, 'sendReputation', (branchID, to, value, onSent, onSuccess, onFailed) => {
		onSent();
		onSuccess({ hash: '0xdeadbeef', timestamp: 1, gasFees: 10 });
		onFailed({ message: `This is a failure message...You're a FAILURE!` });
	});

	sinon.stub(fakeAugurJS.abi, 'format_address', (string) => {
		return string.indexOf('0x') === 0 ? `0x${string}` : string;
	});

	sinon.stub(fakeUpdateTrans, 'updateExistingTransaction', (transID, data) => {
		return { type: 'UPDATE_EXISTING_TRANSACTIONS', data: { ...data}};
	});

	sinon.stub(fakeUpdateAssets, 'updateAssets', () => {
		return { type: 'UPDATE_ASSETS' };
	});

	sinon.stub(fakeFormatRealEther, 'formatRealEther', (gas) => {
		return gas;
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
		// reset call counts for mocked up functions to make sure they are being hit on every test.
		fakeUpdateTrans.updateExistingTransaction.reset();
		fakeUpdateAssets.updateAssets.reset();
		fakeFormatRealEther.formatRealEther.reset();
		fakeAugurJS.abi.format_address.reset();
	});

	const fakeAugur = { augur: fakeAugurJS };

	const action = proxyquire('../../../src/modules/auth/actions/process-transfer-funds', {
		'../../../services/augurjs': fakeAugur,
		'../../transactions/actions/update-existing-transaction': fakeUpdateTrans,
		'../../auth/actions/update-assets': fakeUpdateAssets,
		'../../../utils/format-number': fakeFormatRealEther
	});

	it('should process the transfer of ether (cash) from one account to another', () => {
		store.dispatch(action.processTransferFunds('myTransactionID', 'fromTestAddress123', 5, 'ETH', 'toTestAddress456'));
		const actual = store.getActions();
		const expected = [{
			type: 'UPDATE_EXISTING_TRANSACTIONS',
			data: {
				status: 'submitting a request to transfer 5 ETH to toTestAddress456...'
			}
		}, {
			type: 'UPDATE_EXISTING_TRANSACTIONS',
			data: {
				status: 'transferring 5 ETH to toTestAddress456'
			}
		}, {
			type: 'UPDATE_EXISTING_TRANSACTIONS',
			data: {
				status: 'success',
				hash: '0xdeadbeef',
				gasFees: 10,
				timestamp: 1,
				message: 'Transfer of 5 ETH to toTestAddress456 Complete.'
			}
		}, {
			type: 'UPDATE_ASSETS'
		}, {
			type: 'UPDATE_EXISTING_TRANSACTIONS',
			data: {
				status: 'failed',
				message: `This is a failure message...You're a FAILURE!`
			}
		}];

		assert.deepEqual(actual, expected, `Didn't dispatch the expected actions.`);

		assert(fakeAugurJS.sendCashFrom.calledOnce, `augur.sendCashFrom wasn't called exactly once as expected.`);
		assert((fakeUpdateTrans.updateExistingTransaction.callCount === 4), `updateExistingTransaction wasn't called 4 times as expected.`);
		assert(fakeUpdateAssets.updateAssets.calledOnce, `updateAssets wasn't called once as expected.`);
		assert(fakeFormatRealEther.formatRealEther.calledOnce, `formatRealEther wasn't called once as expected.`);
		assert(fakeAugurJS.abi.format_address.calledOnce, `augur.abi.format_address wasn't called once as expected.`);
	});

	it('should process the transfer of real Ether from one account to another', () => {
		store.dispatch(action.processTransferFunds('myTransactionID', 'fromTestAddress123', 5, 'real ETH', 'toTestAddress456'));
		const actual = store.getActions();
		const expected = [{
			type: 'UPDATE_EXISTING_TRANSACTIONS',
			data: {
				status: 'submitting a request to transfer 5 real ETH to toTestAddress456...'
			}
		}, {
			type: 'UPDATE_EXISTING_TRANSACTIONS',
			data: {
				status: 'transferring 5 real ETH to toTestAddress456'
			}
		}, {
			type: 'UPDATE_EXISTING_TRANSACTIONS',
			data: {
				status: 'success',
				hash: '0xdeadbeef',
				gasFees: 10,
				timestamp: 1,
				message: 'Transfer of 5 real ETH to toTestAddress456 Complete.'
			}
		}, {
			type: 'UPDATE_ASSETS'
		}, {
			type: 'UPDATE_EXISTING_TRANSACTIONS',
			data: {
				status: 'failed',
				message: `This is a failure message...You're a FAILURE!`
			}
		}];

		assert.deepEqual(actual, expected, `Didn't dispatch the expected actions.`);

		assert(fakeAugurJS.sendEther.calledOnce, `augur.sendEther wasn't called exactly once as expected.`);
		assert((fakeUpdateTrans.updateExistingTransaction.callCount === 4), `updateExistingTransaction wasn't called 4 times as expected.`);
		assert(fakeUpdateAssets.updateAssets.calledOnce, `updateAssets wasn't called once as expected.`);
		assert(fakeFormatRealEther.formatRealEther.calledOnce, `formatRealEther wasn't called once as expected.`);
		assert(fakeAugurJS.abi.format_address.calledOnce, `augur.abi.format_address wasn't called once as expected.`);
	});

	it('should process the transfer of REP from one account to another', () => {
		store.dispatch(action.processTransferFunds('myTransactionID', 'fromTestAddress123', 5, 'REP', 'toTestAddress456'));
		const actual = store.getActions();
		const expected = [{
			type: 'UPDATE_EXISTING_TRANSACTIONS',
			data: {
				status: 'submitting a request to transfer 5 REP to toTestAddress456...'
			}
		}, {
			type: 'UPDATE_EXISTING_TRANSACTIONS',
			data: {
				status: 'transferring 5 REP to toTestAddress456'
			}
		}, {
			type: 'UPDATE_EXISTING_TRANSACTIONS',
			data: {
				status: 'success',
				hash: '0xdeadbeef',
				gasFees: 10,
				timestamp: 1,
				message: 'Transfer of 5 REP to toTestAddress456 Complete.'
			}
		}, {
			type: 'UPDATE_ASSETS'
		}, {
			type: 'UPDATE_EXISTING_TRANSACTIONS',
			data: {
				status: 'failed',
				message: `This is a failure message...You're a FAILURE!`
			}
		}];

		assert.deepEqual(actual, expected, `Didn't dispatch the expected actions.`);

		assert(fakeAugurJS.sendReputation.calledOnce, `augur.sendReputation wasn't called exactly once as expected.`);
		assert((fakeUpdateTrans.updateExistingTransaction.callCount === 4), `updateExistingTransaction wasn't called 4 times as expected.`);
		assert(fakeUpdateAssets.updateAssets.calledOnce, `updateAssets wasn't called once as expected.`);
		assert(fakeFormatRealEther.formatRealEther.calledOnce, `formatRealEther wasn't called once as expected.`);
		assert(fakeAugurJS.abi.format_address.calledOnce, `augur.abi.format_address wasn't called once as expected.`);
	});

});
