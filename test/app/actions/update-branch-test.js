import { describe, it, beforeEach, afterEach } from 'mocha';
import BigNumber from 'bignumber.js';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from 'test/testState';

describe(`modules/app/actions/update-branch.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	const state = Object.assign({}, testState, {
		branch: {
			currentPeriod: 20,
			currentPeriodProgress: 52,
			isReportRevealPhase: true,
			reportPeriod: 18,
			periodLength: 900
		}
	});
	const store = mockStore(state);
	const mockAugurJS = { augur: {}, abi: { bignum: () => {} } };
	const mockCheckPeriod = { checkPeriod: () => {} };
	const mockClaimProceeds = {};
	mockAugurJS.augur.getCurrentPeriod = sinon.stub().returns(20);
	mockAugurJS.augur.getCurrentPeriodProgress = sinon.stub().returns(52);
	mockAugurJS.augur.getVotePeriod = sinon.stub().yields(19);
	mockAugurJS.augur.getVotePeriod.onCall(1).yields(15);
	mockAugurJS.augur.getVotePeriod.onCall(2).yields(18);
	mockAugurJS.augur.getPenalizedUpTo = sinon.stub().yields('10');
	mockAugurJS.augur.getFeesCollected = sinon.stub().yields('1');
	mockAugurJS.augur.getPast24 = sinon.stub().yields('2');
	mockAugurJS.augur.getNumberEvents = sinon.stub().yields('6');
	mockClaimProceeds.claimProceeds = sinon.stub().returns({ type: 'CLAIM_PROCEEDS' });
	sinon.stub(mockAugurJS.abi, 'bignum', (n) => {
		if (n == null) return null;
		return new BigNumber(n, 10);
	});
	sinon.stub(mockCheckPeriod, 'checkPeriod', (unlock, cb) => (dispatch, getState) => {
		const reportPeriod = 19;
		dispatch({ type: 'UPDATE_BRANCH', branch: { reportPeriod } });
		cb(null, reportPeriod);
	});
	const action = proxyquire('../../../src/modules/app/actions/update-branch.js', {
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
		const mockCB = () => {
			store.dispatch({
				type: 'MOCK_CB_CALLED'
			});
		};
		const out = [{
			type: 'UPDATE_BRANCH',
			branch: {
				currentPeriod: 20,
				currentPeriodProgress: 52,
				isReportRevealPhase: true,
				phaseLabel: 'Reveal',
				phaseTimeRemaining: 'in 7 minutes'
			}
		}, {
			type: 'MOCK_CB_CALLED'
		}];
		store.dispatch(action.syncBranch(mockCB));
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected actions`);
	});
	it(`should increment branch if the branch is behind`, () => {
		mockAugurJS.augur.getCurrentPeriodProgress = sinon.stub().returns(42);
		const mockCB = () => {
			store.dispatch({
				type: 'MOCK_CB_CALLED'
			});
		};
		const out = [{
			type: 'UPDATE_BRANCH',
			branch: {
				currentPeriod: 20,
				currentPeriodProgress: 42,
				isReportRevealPhase: false,
				phaseLabel: 'Commit',
				phaseTimeRemaining: 'in a minute'
			}
		}, {
			type: 'UPDATE_BRANCH',
			branch: {
				reportPeriod: 19
			}
		}, {
			type: 'UPDATE_BRANCH',
			branch: {
				numEventsCreatedInPast24Hours: 2
			}
		}, {
			type: 'UPDATE_BRANCH',
			branch: {
				numEventsInReportPeriod: 6
			}
		}, {
			type: 'CLAIM_PROCEEDS'
		}, {
			type: 'MOCK_CB_CALLED'
		}];
		store.dispatch(action.syncBranch(mockCB));
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the correct actions`);
	});
	it(`should collect fees and reveal reports if we're in the second half of the reporting period`, () => {
		const state = Object.assign({}, testState, {
			branch: {
				currentPeriod: 20,
				currentPeriodProgress: 49,
				isReportRevealPhase: false,
				reportPeriod: 18,
				periodLength: 900
			}
		});
		const store = mockStore(state);
		mockAugurJS.augur.getCurrentPeriodProgress = sinon.stub().returns(52);
		const mockCB = () => {
			store.dispatch({
				type: 'MOCK_CB_CALLED'
			});
		};
		const out = [{
			type: 'UPDATE_BRANCH',
			branch: {
				currentPeriod: 20,
				currentPeriodProgress: 52,
				isReportRevealPhase: true,
				phaseLabel: 'Reveal',
				phaseTimeRemaining: 'in 7 minutes'
			}
		}, {
			type: 'UPDATE_BRANCH',
			branch: {
				reportPeriod: 15
			}
		}, {
			type: 'UPDATE_BRANCH',
			branch: {
				numEventsCreatedInPast24Hours: 2
			}
		}, {
			type: 'UPDATE_BRANCH',
			branch: {
				numEventsInReportPeriod: 6
			}
		}, {
			type: 'CLAIM_PROCEEDS'
		}, {
			type: 'MOCK_CB_CALLED'
		}];
		store.dispatch(action.syncBranch(mockCB));
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the correct actions`);
	});
});
