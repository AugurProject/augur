import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe('modules/reports/actions/load-reports.js', () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, action, out;
	const testStateReports = Object.assign({}, testState.reports[testState.branch.id]);
	let state = Object.assign({}, testState);
	store = mockStore(state);
	let mockAugurJS = { augur: {} };
	let mockMarketData = {};
	let mockUpdateReports = { updateReports: () => {} };

	mockAugurJS.augur.getEventsToReportOn = sinon.stub().yields(['test1', 'test2']);
	mockAugurJS.augur.getReportHash = sinon.stub().yields(null);
	mockAugurJS.augur.getAndDecryptReport = sinon.stub().yields({ report: 1, salt: 1337 });
	sinon.stub(mockUpdateReports, 'updateReports', (reports) => {
		return { type: 'UPDATE_REPORTS', reports };
	});

	action = proxyquire('../../../src/modules/reports/actions/load-reports', {
		'../../../services/augurjs': mockAugurJS,
		'../../reports/actions/update-reports': mockUpdateReports
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	after(() => {
		testState.reports[testState.branch.id] = Object.assign({}, testStateReports);
	});

	it('should call augur.getEventsToReportOn, lookup stored report hash for each event, then dispatch updateReports', () => {
		out = [{
			type: 'UPDATE_REPORTS',
			reports: {
				[testState.branch.id]: {
					testEventID: {
						eventID: 'testEventID',
						isUnethical: false
					},
					test1: {
						eventID: 'test1',
						reportHash: null
					},
					test2: {
						eventID: 'test2',
						reportHash: null
					}
				}
			}
		}];

		store.dispatch(action.loadReports((err) => {
			assert.isNull(err);
			assert(mockAugurJS.augur.getEventsToReportOn.calledOnce, `augur.getEventsToReportOn() wasn't only called once as expected`);
			assert(mockUpdateReports.updateReports.calledOnce, `updateReports wasn't only called once as expected`);
			assert.deepEqual(store.getActions(), out, `Didn't dispatch the correct information`);
		}));
	});
});
