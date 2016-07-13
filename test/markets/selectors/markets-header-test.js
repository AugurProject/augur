import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mockStore from '../../mockStore';
import { assertions } from 'augur-ui-react-components';

describe(`modules/markets/selectors/markets-header.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	let selector, actual, expected;
	let { state, store } = mockStore.default;

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

	beforeEach(() => {
		store.clearActions();
	});

	afterEach(() => {
		store.clearActions();
	});

	// marketsHeader = selector.default;

	it(`should select the correct Markets Header`, () => {
		actual = selector.default();
		expected = [{
			type: 'UPDATE_SELECTED_MARKETS_HEADER',
			header: null
		}, {
			type: 'UPDATE_SELECTED_MARKETS_HEADER',
			header: 'favorites'
		}, {
			type: 'UPDATE_SELECTED_MARKETS_HEADER',
			header: 'pending reports'
		}];

		assertions.marketsHeader(actual)

		actual.onClickAllMarkets();
		actual.onClickFavorites();
		actual.onClickPendingReports();

		assert.deepEqual(store.getActions(), expected, `Didn't dispatch the expected action objects from onclick events`);
	});
});
