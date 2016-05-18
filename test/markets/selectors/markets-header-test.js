import {
	assert
} from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import testState from '../../testState';

describe(`modules/markets/selectors/markets-header.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const middlewares = [thunk];
	const mockStore = configureMockStore(middlewares);
	let store, selector, out, test;
	let state = Object.assign({}, testState);
	store = mockStore(state);
	let mockSelect = {};
	mockSelect.marketsTotals = {
		numFiltered: 10,
		numFavorites: 100,
		numPendingReports: 25
	};
	let mockHeader = {
		updateSelectedMarketsHeader: () => {}
	};
	sinon.stub(mockHeader, 'updateSelectedMarketsHeader', (arg) => {
		return {
			type: 'UPDATE_SELECTED_MARKETS_HEADER',
			header: arg
		}
	});

	selector = proxyquire('../../../src/modules/markets/selectors/markets-header.js', {
		'../../../selectors': mockSelect,
		'../../../store': store,
		'../../markets/actions/update-selected-markets-header': mockHeader
	});

	it(`should select the correct Markets Header`, () => {
		test = selector.default();
		out = [{
			type: 'UPDATE_SELECTED_MARKETS_HEADER',
			header: null
		}, {
			type: 'UPDATE_SELECTED_MARKETS_HEADER',
			header: 'favorites'
		}, {
			type: 'UPDATE_SELECTED_MARKETS_HEADER',
			header: 'pending reports'
		}];

		test.onClickAllMarkets();
		test.onClickFavorites();
		test.onClickPendingReports();

		assert.equal(test.selectedMarketsHeader, 'testMarketHeader', `Didn't assign the expected selectedMarketsHeader`);
		assert.equal(test.numMarkets, 10, `Didn't assign the correct number of markets`);
		assert.equal(test.numFavorites, 100, `Didn't assign the correct number of favorites`);
		assert.equal(test.numPendingReports, 25, `Didn't assign the correct number of pending reports`);
		assert.deepEqual(store.getActions(), out, `Didn't dispatch the expected action objects from onclick events`);
	});
});
