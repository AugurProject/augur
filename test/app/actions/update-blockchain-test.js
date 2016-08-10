import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/app/actions/update-blockchain.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, action, out;
	let state = Object.assign({}, testState, {
		blockchain: {
			currentBlockMillisSinceEpoch: 1461774253983,
			currentBlockNumber: 833339,
			currentPeriod: 20,
			isReportConfirmationPhase: true,
			reportPeriod: 18
		}
	});
	store = mockStore(state);

	let mockAugurJS = {
		augur: {
			rpc: {
				blockNumber: () => {}
			},
			incrementPeriodAfterReporting: () => {}
		}
	};
	let mockPenalize = {};
	let mockCollectFees = {};
	let mockLoadReports = {
		loadReports: () => {}
	};
	let mockCheckPeriod = {};

	mockAugurJS.augur.getCurrentPeriod = sinon.stub().returns(2);
	mockAugurJS.augur.getCurrentPeriodProgress = sinon.stub().returns(42);
	sinon.stub(mockAugurJS.augur.rpc, 'blockNumber', (cb) => {
		cb("0x2710");
	});
	sinon.stub(mockAugurJS.augur, 'incrementPeriodAfterReporting', (o) => {
		o.onSuccess({ callReturn: "0x2710" });
	});
	sinon.stub(mockLoadReports, 'loadReports', (cb) => {
		cb(null);
	});
	mockAugurJS.augur.getVotePeriod = sinon.stub().yields(19);
	mockAugurJS.augur.getVotePeriod.onCall(1).yields(15);
	mockCheckPeriod.checkPeriod = sinon.stub().returns({ type: 'CHECK_PERIOD' });

	action = proxyquire('../../../src/modules/app/actions/update-blockchain.js', {
		'../../../services/augurjs': mockAugurJS,
		'../../reports/actions/load-reports': mockLoadReports,
		'../../reports/actions/check-period': mockCheckPeriod
	});

	beforeEach(() => {
		store.clearActions();
		global.Date.now = sinon.stub().returns(12345);
	});

	afterEach(() => {
		store.clearActions();
		mockCollectFees.collectFees.reset();
	});

	it(`should update our local state to match blockchain if chain is up-to-date`, () => {
		let mockCB = () => {
			store.dispatch({
				type: 'MOCK_CB_CALLED'
			})
		};
		out = [{
			type: 'UPDATE_BLOCKCHAIN',
			data: {
				currentBlockNumber: 10000,
				currentBlockMillisSinceEpoch: 12345,
				currentPeriod: 2,
				isReportConfirmationPhase: false
			}
		}, {
			type: 'UPDATE_BLOCKCHAIN',
			data: {
				reportPeriod: 19
			}
		}, {
			type: 'CHECK_PERIOD'
		}, {
			type: 'MOCK_CB_CALLED'
		}];
		console.log(action.updateBlockchain.toString())
		process.exit()
		store.dispatch(action.updateBlockchain(mockCB));
		assert(mockAugurJS.augur.rpc.blockNumber.calledOnce, `blockNumber wasn't called once as expected`);
		assert(mockAugurJS.augur.getVotePeriod.calledOnce, `getVotePeriod wasn't called once as expected`);
		assert(mockAugurJS.augur.getCurrentPeriod.calledOnce, `getCurrentPeriod wasn't called once as expected`);
		assert(mockAugurJS.augur.getCurrentPeriodProgress.calledOnce, `getCurrentPeriodProgress wasn't called once as expected`);
		assert(mockLoadReports.loadReports.calledOnce, `loadReports wasn't called once as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the correct actons`);
	});

	it('should increment blockchain if we are first to see new period', () => {
		let mockCB = () => {
			store.dispatch({
				type: 'MOCK_CB_CALLED'
			})
		};
		out = [{
			type: 'UPDATE_BLOCKCHAIN',
			data: {
				currentBlockNumber: 10000,
				currentBlockMillisSinceEpoch: 12345,
				currentPeriod: 2,
				isReportConfirmationPhase: false
			}
		}, {
			type: 'UPDATE_BLOCKCHAIN',
			data: {
				reportPeriod: 19
			}
		}, {
			type: 'COLLECT_FEES'
		}, {
			type: 'MOCK_CB_CALLED'
		}];

		store.dispatch(action.updateBlockchain(mockCB));

		assert(mockAugurJS.loadCurrentBlock.calledOnce, `loadCurrentBlock wasn't called once as expected`);
		// didn't reset teh next one because we need it to yield the expected outputs.
		assert(mockAugurJS.augur.getVotePeriod.calledThrice, `getVotePeriod wasn't called twice as expected`);
		assert(mockCollectFees.collectFees.calledOnce, `collectFees wasn't called once as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected actions`);
	});
});
