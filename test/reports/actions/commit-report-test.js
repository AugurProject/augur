import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/reports/actions/commit-report.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, action, out;
	let state = Object.assign({}, testState, {
		marketsData: {
			test1: {
				eventID: 'test1EventID'
			}
		},
		reports: {
			[testState.branch.id]: {
				test1EventID: {
					id: 'test1EventID'
				}
			}
		}
	});
	store = mockStore(state);
	let mockAugurJS = { augur: { submitReportHash: () => {}, getMarket: () => {} } };
	let mockAddCommitReportTransaction = {};
	let mockUpdateExistingTransaction = {
		updateExistingTransaction: () => {}
	};
	let mockUpdateReports = { updateReports: () => {} };
	let mockMarket = {};
	let mockLinks = {
		selectMarketsLink: () => {},
		selectMarketLink: () => {}
	};
	let mockHex = {};
	sinon.stub(mockUpdateReports, 'updateReports', (obj) => {
		return {
			type: 'UPDATE_REPORTS',
			...obj
		}
	});
	mockAddCommitReportTransaction.addCommitReportTransaction = sinon.stub().returns({
		type: 'ADD_REPORT_TRANSACTION'
	});
	mockMarket.selectMarketFromEventID = sinon.stub().returns('0xdeadbeef');
	mockMarket.selectMarketFromEventID.onCall(1).returns(false);
	sinon.stub(mockLinks, 'selectMarketLink', (nextPendingReportMarket,
		dispatch) => {
		return {
			onClick: () => {
				dispatch({
					type: 'SELECT_MARKET_LINK',
					nextPendingReportMarket
				})
			}
		};
	});
	sinon.stub(mockLinks, 'selectMarketsLink', (dispatch) => {
		return {
			onClick: () => {
				dispatch({
					type: 'SELECT_MARKETS_LINK'
				})
			}
		};
	});
	sinon.stub(mockUpdateExistingTransaction, 'updateExistingTransaction', (transID, status) => {
		return {
			type: 'UPDATE_EXISTING_TRANSACTIONS',
			transactionID: transID,
			status
		};
	});
	mockAugurJS.augur.fixReport = sinon.stub().returns('0xde0b6b3a7640000');
	mockAugurJS.augur.makeHash = sinon.stub().returns('0xdeadbeef')
	sinon.stub(mockAugurJS.augur, 'submitReportHash', (o) => {
		o.onSuccess({ callReturn: 1 });
	});
	sinon.stub(mockAugurJS.augur, 'getMarket', (eventID, index, callback) => {
		callback('0xdeadbeef');
	});
	mockHex.bytesToHex = sinon.stub().returns('salt12345');

	action = proxyquire('../../../src/modules/reports/actions/commit-report.js', {
		'../../../services/augurjs': mockAugurJS,
		'../../transactions/actions/add-commit-report-transaction': mockAddCommitReportTransaction,
		'../../transactions/actions/update-existing-transaction': mockUpdateExistingTransaction,
		'../../reports/actions/update-reports': mockUpdateReports,
		'../../market/selectors/market': mockMarket,
		'../../link/selectors/links': mockLinks,
		'../../../utils/bytes-to-hex': mockHex
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
		mockUpdateReports.updateReports.reset();
		mockAddCommitReportTransaction.addCommitReportTransaction.reset();
		mockMarket.selectMarketFromEventID.reset();
		mockAugurJS.augur.submitReportHash.reset();
		mockLinks.selectMarketLink.reset();
		mockLinks.selectMarketsLink.reset();
		mockUpdateExistingTransaction.updateExistingTransaction.reset();
		mockHex.bytesToHex.reset();
	});

	it(`should initiate a report commit`, () => {
		let market = { id: 'test1' };
		out = [{
			type: 'ADD_REPORT_TRANSACTION'
		}];

		store.dispatch(action.commitReport(market, 'testOutcomeID', false));

		assert(mockAddCommitReportTransaction.addCommitReportTransaction.calledOnce, `addCommitReportTransaction wasn't called once as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected actions`);

		store.clearActions();

		store.dispatch(action.commitReport(market, 'testOutcomeID', false));

		out = [{
			type: 'ADD_REPORT_TRANSACTION'
		}];

		assert(mockAddCommitReportTransaction.addCommitReportTransaction.calledTwice, `addCommitReportTransaction wasn't called twice as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected actions.`);
	});

	it(`should broadcast the report commit to the blockchain`, () => {
		let market = {
			id: 'test1',
			type: 'scalar',
			eventID: 'testEventID1'
		};
		global.event = {};
		out = [{
			type: 'UPDATE_EXISTING_TRANSACTIONS',
			transactionID: 'transID1',
			status: { status: 'sending...' }
		}, {
			[testState.branch.id]: {
				testEventID1: {
					reportPeriod: '19',
					reportedOutcomeID: 'testOutcomeID',
					isIndeterminate: false,
					isCategorical: false,
					isScalar: true,
					isRevealed: false,
					isUnethical: false,
					salt: 'salt12345',
					reportHash: '0xdeadbeef'
				}
			},
			type: 'UPDATE_REPORTS'
		}, {
			type: 'UPDATE_EXISTING_TRANSACTIONS',
			transactionID: 'transID1',
			status: {
				status: 'success',
				message: 'committed to report outcome testOutcomeID',
				hash: undefined,
				timestamp: undefined,
				gasFees: {
					denomination: ' real ETH',
					formatted: '0',
					formattedValue: 0,
					full: '0 real ETH',
					minimized: '0',
					rounded: '0',
					roundedValue: 0,
					value: 0
				}
			}
		}, {
			[testState.branch.id]: {
				testEventID1: {
					reportPeriod: '19',
					reportedOutcomeID: 'testOutcomeID',
					isIndeterminate: false,
					isCategorical: false,
					isScalar: true,
					isRevealed: false,
					isUnethical: false,
					salt: 'salt12345',
					reportHash: '0xdeadbeef'
				}
			},
			type: 'UPDATE_REPORTS'
		}];

		store.dispatch(action.sendCommitReport('transID1', market, 'testOutcomeID', false, false));

		assert(mockHex.bytesToHex.calledOnce, `bytesToHex wasn't called once as expected`);
		assert(mockUpdateReports.updateReports.calledTwice, `updateReports wasn't called twice as expected`);
		assert(mockUpdateExistingTransaction.updateExistingTransaction.calledTwice, `updateExistingTransaction wasn't called twice as expected`);
		assert(mockAugurJS.augur.submitReportHash.calledOnce, `Didn't call commitReport once as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected actions for processing a report`);
	});

});
