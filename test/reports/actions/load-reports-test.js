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
	let store, action, test, out;
	let state = Object.assign({}, testState);
	store = mockStore(state);
	let mockAugurJS = {};
	let mockMarketData = {};
	let mockUpdateReports = {
		updateReports: () => {}
	};

	mockAugurJS.getEventsToReportOn = sinon.stub().yields(null, ['test1', 'test2']);
	mockMarketData.isMarketDataOpen = sinon.stub().returns(false);
	sinon.stub(mockUpdateReports, "updateReports", (eventIDs) => {
		return {
			type: 'UPDATE_REPORTS',
			reports: eventIDs
		}
	});

	action = proxyquire('../../../src/modules/reports/actions/load-reports', {
		'../../../services/augurjs': mockAugurJS,
		'../../../utils/is-market-data-open': mockMarketData,
		'../../reports/actions/update-reports': mockUpdateReports
	});

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	it('should dispatch an update_reports action when given closed markets', () => {
		test = {
			test1: {
				eventID: 'testEvent1'
			},
			test2: {
				eventID: 'testEvent2'
			}
		};

		out = [{
			type: 'UPDATE_REPORTS',
			reports: ['test1', 'test2']
		}];

		store.dispatch(action.loadReports(test));

		assert(mockAugurJS.getEventsToReportOn.calledOnce, `AugurJS.getEventsToReportOn() wasn't only called once as expected`);
		assert(mockMarketData.isMarketDataOpen.calledTwice, `isMarketDataOpen() wasn't called only twice as expected based on test data`);
		assert(mockUpdateReports.updateReports.calledOnce, `updateReports wasn't only called once as expected`);

		assert.deepEqual(store.getActions(), out, `Didn't dispatch the correct information`);
	});
});
