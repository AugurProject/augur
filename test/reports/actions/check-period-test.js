import { describe, it, beforeEach, afterEach } from 'mocha';
import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from 'test/testState';

describe('modules/reports/actions/check-period.js', () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	const state = Object.assign({}, testState, {
		blockchain: {
			...testState.blockchain,
			isReportRevealPhase: false
		},
		loginAccount: {
			...testState.loginAccount,
			rep: 100
		}
	});
	const store = mockStore(state);
	const mockAugurJS = { augur: {} };
	const mockLoadReports = { loadReports: () => {} };
	const mockCollectFees = {};
	const mockRevealReports = {};
	const mockLoadEventsWithSubmittedReport = { loadEventsWithSubmittedReport: () => {} };
	mockAugurJS.augur.getCurrentPeriod = sinon.stub().returns(20);
	mockAugurJS.augur.getCurrentPeriodProgress = sinon.stub().returns(52);
	mockAugurJS.augur.checkPeriod = sinon.stub().yields(null, 'TEST RESPONSE!');
	mockAugurJS.augur.penalizeWrong = sinon.stub().yields(null, 'TEST RESPONSE!');
	mockAugurJS.augur.incrementPeriodAfterReporting = sinon.stub().yields(null, 'TEST RESPONSE!');
	sinon.stub(mockLoadReports, 'loadReports', cb => (dispatch, getState) => {
		dispatch({
			type: 'UPDATE_REPORTS',
			reports: { '0xf69b5': { '0xdeadbeef': { reportedOutcomeID: 1 } } }
		});
		cb(null);
	});
	sinon.stub(mockLoadEventsWithSubmittedReport, 'loadEventsWithSubmittedReport', () => (dispatch) => {
		dispatch({ type: 'LOAD_EVENTS' });
	});
	mockCollectFees.collectFees = sinon.stub().returns({
		type: 'UPDATE_ASSETS'
	});
	mockRevealReports.revealReports = sinon.stub().returns({
		type: 'UPDATE_REPORTS',
		reports: { '0xf69b5': { '0xdeadbeef': { reportedOutcomeID: 1, isRevealed: true } } }
	});

	const action = proxyquire('../../../src/modules/reports/actions/check-period.js', {
		'../../../services/augurjs': mockAugurJS,
		'../../reports/actions/load-reports': mockLoadReports,
		'../../reports/actions/collect-fees': mockCollectFees,
		'../../reports/actions/reveal-reports': mockRevealReports,
		'../../my-reports/actions/load-events-with-submitted-report': mockLoadEventsWithSubmittedReport
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	it('should check for increment period / penalize wrong', () => {
		store.dispatch(action.checkPeriod());
		assert(mockAugurJS.augur.checkPeriod.calledOnce);
	});

});
