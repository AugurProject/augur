import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe('modules/transactions/actions/add-reveal-report-transaction.js', () => {
	proxyquire.noPreserveCache().noCallThru();
	const mockStore = configureMockStore([thunk]);
	const store = mockStore(Object.assign({}, testState));
	const p = {
		eventID: 'testEventID',
		marketID: 'testMarketID',
		reportedOutcomeID: '2',
		salt: '0x1337',
		isUnethical: false,
		isScalar: false,
		isIndeterminate: false
	};
	const mockAddTransactions = { addTransaction: () => {} };
	const mockUpdateExistingTransaction = { updateExistingTransaction: () => {} };
	const mockUpdateAssets = { updateAssets: () => {} };
	const mockAugurJS = {
		augur: {
			getDescription: () => {},
			getMarket: () => {},
			submitReport: () => {},
			getTxGasEth: () => {},
			rpc: { gasPrice: 10 },
			tx: { MakeReports: { submitReport: {} } }
		}
	};
	sinon.stub(mockAddTransactions, 'addTransaction', (data) => {
		return { type: 'ADD_TRANSACTION', data };
	});
	sinon.stub(mockUpdateExistingTransaction, 'updateExistingTransaction', (transactionID, data) => {
		return { type: 'UPDATE_EXISTING_TRANSACTION', transactionID, ...data };
	});
	sinon.stub(mockUpdateAssets, 'updateAssets', () => {
		return { type: 'UPDATE_ASSETS' };
	});
	sinon.stub(mockAugurJS.augur, 'getDescription', (eventID, callback) => {
		callback('some test description');
	});
	sinon.stub(mockAugurJS.augur, 'getMarket', (eventID, index, callback) => {
		callback('testMarketID');
	});
	sinon.stub(mockAugurJS.augur, 'getTxGasEth', (tx, gasPrice) => {
		return 1;
	});
	sinon.stub(mockAugurJS.augur, 'submitReport', (o) => {
		o.onSent({
			status: 'submitted',
			message: 'revealing report outcome: testOutcome 2'
		});
		o.onSuccess({
			status: 'success',
			hash: '0xdeadbeef',
			timestamp: 100,
			message: 'revealed report outcome: testOutcome 2',
			gasFees: 1
		});
	});
	const action = proxyquire('../../../src/modules/transactions/actions/add-reveal-report-transaction.js', {
		'../../transactions/actions/add-transactions': mockAddTransactions,
		'../../transactions/actions/update-existing-transaction': mockUpdateExistingTransaction,
		'../../auth/actions/update-assets': mockUpdateAssets,
		'../../../services/augurjs': mockAugurJS
	});
	beforeEach(() => {
		store.clearActions();
	});
	afterEach(() => {
		store.clearActions();
	});
	it('addRevealReportTransaction', () => {
		const expected = [{
			type: 'ADD_TRANSACTION',
			data: {
				type: 'reveal_report',
				data: {
					event: 'testEventID',
					description: 'some test description',
					outcome: {
						id: '2',
						name: 'testOutcome 2',
						outstandingShares: '156',
						price: 50
					},
					reportedOutcomeID: '2',
					isUnethical: false,
					isScalar: false,
					isIndeterminate: false
				},
				gasFees: {
					denomination: ' real ETH (estimated)',
					formatted: '1.0000',
					formattedValue: 1,
					full: '1.0000 real ETH (estimated)',
					minimized: '1',
					rounded: '1.0000',
					roundedValue: 1,
					value: 1
				}
			}
		}];
		store.dispatch(action.addRevealReportTransaction(p.eventID, p.marketID, p.reportedOutcomeID, p.salt, p.isUnethical, p.isScalar, p.isIndeterminate));
		const actual = store.getActions();
		assert.isFunction(actual[0].data.action);
		delete actual[0].data.action;
		assert.deepEqual(actual, expected, `Didn't dispatch the expected actions`);
	});
	it('processRevealReport', () => {
		p.outcomeName = 'testOutcome 2';
		const expected = [{
			type: 'UPDATE_EXISTING_TRANSACTION',
			transactionID: 1,
			status: 'submitted',
			message: 'revealing reported outcome: testOutcome 2'
		}, {
			type: 'UPDATE_EXISTING_TRANSACTION',
			transactionID: 1,
			status: 'success',
			hash: '0xdeadbeef',
			timestamp: 100,
			message: 'revealed reported outcome: testOutcome 2',
			gasFees: {
				denomination: ' real ETH',
				formatted: '1.0000',
				formattedValue: 1,
				full: '1.0000 real ETH',
				minimized: '1',
				rounded: '1.0000',
				roundedValue: 1,
				value: 1
			}
		}, {
			type: 'UPDATE_ASSETS'
		}];
		store.dispatch(action.processRevealReport(1, p.eventID, p.reportedOutcomeID, p.salt, p.isUnethical, p.isScalar, p.isIndeterminate, p.outcomeName));
		assert.deepEqual(store.getActions(), expected, `Didn't dispatch the expected actions`);
		assert(mockAugurJS.augur.submitReport.calledOnce, `Didn't call submitReport once as expected`);
	});
});
