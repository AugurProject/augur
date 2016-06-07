import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/markets/actions/load-markets.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, action, out;
	let state = Object.assign({}, testState);
	store = mockStore(state);
	let mockAugurJS = {};
	let mockReport = {};
	let mockPenReports = {};
	let mockClearReports = {};

	mockAugurJS.loadNumMarkets = sinon.stub();
	mockAugurJS.loadMarkets = sinon.stub();
	mockReport.loadReports = sinon.stub();
	mockAugurJS.loadNumMarkets.yields(null, 1);
	mockAugurJS.loadMarkets.yields(null, {
		marketsData: {
			_id: 'test',
			test: 'info',
			example: 'test info'
		}
	});
	mockReport.loadReports.returnsArg(0);
	mockPenReports.penalizeWrongReports = sinon.stub().returns({
		type: 'PENALIZE_WRONG_REPORTS'
	});
	mockClearReports.closeMarkets = sinon.stub().returns({
		type: 'CLEAR_MARKETS'
	});

	action = proxyquire('../../../src/modules/markets/actions/load-markets', {
		'../../../services/augurjs': mockAugurJS,
		'../../reports/actions/load-reports': mockReport,
		'../../reports/actions/penalize-wrong-reports': mockPenReports,
		'../../reports/actions/close-markets': mockClearReports
	});

	it(`should load markets properly`, () => {
		out = [{
			type: 'UPDATE_MARKETS_DATA',
			marketsData: {
				_id: 'test',
				test: 'info',
				example: 'test info'
			}
		}, {
			_id: 'test',
			test: 'info',
			example: 'test info'
		}, {
			type: 'PENALIZE_WRONG_REPORTS'
		}, {
			type: 'CLEAR_MARKETS'
		}];

		store.dispatch(action.loadMarkets());

		assert.deepEqual(store.getActions(), out, `Didn't dispatch the correct actions`);
		assert(mockAugurJS.loadNumMarkets.calledOnce, `AugurJS.loadNumMarkets() wasn't called once`);
		assert(mockAugurJS.loadMarkets.calledOnce, `AugurJS.loadMarkets() wasn't called once`);
		assert(mockReport.loadReports.calledOnce, `loadReports() wasn't called once`);
		assert(mockPenReports.penalizeWrongReports.calledOnce, `penalizeWrongReports() wsan't calledo once`);
		assert(mockClearReports.closeMarkets.calledOnce, `closeMarkets() wasn't called once`);
	});

});
