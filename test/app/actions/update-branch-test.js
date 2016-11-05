import BigNumber from 'bignumber.js';
import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/app/actions/update-branch.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let state = Object.assign({}, testState, {
		branch: {
			currentPeriod: 20,
			currentPeriodProgress: 52,
			isReportRevealPhase: true,
			reportPeriod: 18,
			periodLength: 900
		}
	});
	let store = mockStore(state);
	let mockAugurJS = { augur: {}, abi: { bignum: () => {} } };
	let mockCheckPeriod = { checkPeriod: () => {} };
	let mockClaimProceeds = {};
	mockAugurJS.augur.getCurrentPeriod = sinon.stub().returns(20);
	mockAugurJS.augur.getCurrentPeriodProgress = sinon.stub().returns(52);
	mockAugurJS.augur.getVotePeriod = sinon.stub().yields(19);
	mockAugurJS.augur.getVotePeriod.onCall(1).yields(15);
	mockAugurJS.augur.getVotePeriod.onCall(2).yields(18);
	mockClaimProceeds.claimProceeds = sinon.stub().returns({ type: 'CLAIM_PROCEEDS' });
	sinon.stub(mockAugurJS.abi, 'bignum', (n) => {
		if (n == null) return null;
		return new BigNumber(n, 10);
	});
	sinon.stub(mockCheckPeriod, 'checkPeriod', (unlock, cb) => {
		return (dispatch, getState) => {
			const reportPeriod = 19;
			dispatch({ type: 'UPDATE_BRANCH', branch: { reportPeriod } });
			cb(null, reportPeriod);
		};
	});
	let action = proxyquire('../../../src/modules/app/actions/update-branch.js', {
		'../../../services/augurjs': mockAugurJS,
		'../../reports/actions/check-period': mockCheckPeriod,
		'../../my-positions/actions/claim-proceeds': mockClaimProceeds
	});
	beforeEach(() => {
		store.clearActions();
		global.Date.now = sinon.stub().returns(12345);
	});
	afterEach(() => {
		store.clearActions();
		mockAugurJS.augur.getCurrentPeriod.reset();
		mockAugurJS.augur.getCurrentPeriodProgress.reset();
		mockCheckPeriod.checkPeriod.reset();
	});
	it('should update our local state to match blockchain if chain is up-to-date', () => {
		let mockCB = () => {
			store.dispatch({
				type: 'MOCK_CB_CALLED'
			})
		};
		let out = [{
			type: 'UPDATE_BRANCH',
			branch: {
				currentPeriod: 20,
				currentPeriodProgress: 52,
				isReportRevealPhase: true,
				reportPeriod: 19,
				phaseLabel: 'Reveal',
				phaseTimeRemaining: 'in 7 minutes'
			}
		}, {
			type: 'CLAIM_PROCEEDS'
		}, {
			type: 'MOCK_CB_CALLED'
		}];
		store.dispatch(action.syncBranch(mockCB));
		assert(mockAugurJS.augur.getVotePeriod.calledOnce, `getVotePeriod wasn't called once as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected actions`);
	});
	it(`should increment branch if the branch is behind`, () => {
		mockAugurJS.augur.getCurrentPeriodProgress = sinon.stub().returns(42);
		let mockCB = () => {
			store.dispatch({
				type: 'MOCK_CB_CALLED'
			})
		};
		let out = [{
			type: 'UPDATE_BRANCH',
			branch: {
				currentPeriod: 20,
				currentPeriodProgress: 42,
				isReportRevealPhase: false,
				reportPeriod: 15,
				phaseLabel: 'Commit',
				phaseTimeRemaining: 'in a minute'
			}
		}, {
			type: 'CLAIM_PROCEEDS'
		}, {
			type: 'UPDATE_BRANCH',
			branch: { reportPeriod: 19 }
		}, {
			type: 'MOCK_CB_CALLED'
		}];
		store.dispatch(action.syncBranch(mockCB));
		assert(mockAugurJS.augur.getVotePeriod.calledTwice, `getVotePeriod wasn't called twice (no reset) as expected`);
		assert(mockAugurJS.augur.getCurrentPeriod.calledOnce, `getCurrentPeriod wasn't called once as expected`);
		assert(mockAugurJS.augur.getCurrentPeriodProgress.calledOnce, `getCurrentPeriodProgress wasn't called once as expected`);
		assert(mockCheckPeriod.checkPeriod.calledOnce, `checkPeriod wasn't called once as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the correct actions`);
	});
	it(`should collect fees and reveal reports if we're in the second half of the reporting period`, () => {
		mockAugurJS.augur.getCurrentPeriodProgress = sinon.stub().returns(52);
		let mockCB = () => {
			store.dispatch({
				type: 'MOCK_CB_CALLED'
			});
		};
		let out = [{
			type: 'UPDATE_BRANCH',
			branch: {
				currentPeriod: 20,
				currentPeriodProgress: 52,
				isReportRevealPhase: true,
				reportPeriod: 18,
				phaseLabel: 'Reveal',
				phaseTimeRemaining: 'in 7 minutes'
			}
		}, {
			type: 'CLAIM_PROCEEDS'
		}, {
			type: 'UPDATE_BRANCH',
			branch: { reportPeriod: 19 }
		}, {
			type: 'MOCK_CB_CALLED'
		}];
		store.dispatch(action.syncBranch(mockCB));
		assert(mockAugurJS.augur.getVotePeriod.calledThrice, `getVotePeriod wasn't called three times (no reset) as expected`);
		assert(mockAugurJS.augur.getCurrentPeriod.calledOnce, `getCurrentPeriod wasn't called once as expected`);
		assert(mockAugurJS.augur.getCurrentPeriodProgress.calledOnce, `getCurrentPeriodProgress wasn't called once as expected`);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the correct actions`);
	});
});
