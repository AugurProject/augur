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

	let mockAugurJS = {};
	let mockPenalize = {};
	let mockCollectFees = {};

	mockAugurJS.getCurrentPeriod = sinon.stub().returns(2);
	mockAugurJS.getCurrentPeriodProgress = sinon.stub().returns(42);
	mockAugurJS.loadCurrentBlock = sinon.stub().yields(10000);
	mockAugurJS.getReportPeriod = sinon.stub().yields(null, 19);
	mockAugurJS.getReportPeriod.onCall(1).yields(null, 15);
	mockAugurJS.incrementPeriodAfterReporting = sinon.stub().yields(null, 'res');
	mockCollectFees.collectFees = sinon.stub().returns({
		type: 'COLLECT_FEES'
	});

	action = proxyquire('../../../src/modules/app/actions/update-blockchain.js', {
		'../../../services/augurjs': mockAugurJS,
		'../../reports/actions/collect-fees': mockCollectFees
	});

	beforeEach(() => {
		store.clearActions();
		global.Date.now = sinon.stub().returns(12345);
	});

	afterEach(() => {
		store.clearActions();
		mockAugurJS.loadCurrentBlock.reset();
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
			type: 'COLLECT_FEES'
		}, {
			type: 'MOCK_CB_CALLED'
		}];
		store.dispatch(action.updateBlockchain(mockCB));
		assert(mockAugurJS.loadCurrentBlock.calledOnce, `loadCurrentBlock wasn't called once as expected`);
		assert(mockAugurJS.getReportPeriod.calledOnce, `getReportPeriod wasn't called once as expected`);
		assert(mockCollectFees.collectFees.calledOnce, `collectFees wasn't called once as expected`);
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
		assert(mockAugurJS.getReportPeriod.calledThrice, `getReportPeriod wasn't called twice as expected`);
		assert(mockCollectFees.collectFees.calledOnce, `collectFees wasn't called once as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected actions`);
	});
});
