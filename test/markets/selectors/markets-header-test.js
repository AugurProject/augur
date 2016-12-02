import { describe, it, beforeEach, afterEach } from 'mocha';
import { assert } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import * as mockStore from '../../mockStore';
// import assertions from 'augur-ui-react-components/lib/assertions';

describe(`modules/markets/selectors/markets-header.js`, () => {
	proxyquire.noPreserveCache().noCallThru();
	const { store } = mockStore.default;

	const mockSelect = {};
	mockSelect.marketsTotals = {
		numFiltered: 10,
		numFavorites: 100,
		numPendingReports: 25
	};
	const mockHeader = {
		updateSelectedMarketsHeader: () => {}
	};
	sinon.stub(mockHeader, 'updateSelectedMarketsHeader', (arg) => ({
		type: 'UPDATE_SELECTED_MARKETS_HEADER',
		header: arg
	}));

	const selector = proxyquire('../../../src/modules/markets/selectors/markets-header.js', {
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
		const actual = selector.default();
		const expected = [{
			type: 'UPDATE_SELECTED_MARKETS_HEADER',
			header: null
		}, {
			type: 'UPDATE_SELECTED_MARKETS_HEADER',
			header: 'favorites'
		}, {
			type: 'UPDATE_SELECTED_MARKETS_HEADER',
			header: 'pending reports'
		}];

		// assertions.marketsHeader(actual)
		assert.isDefined(actual); // TODO -- remove

		actual.onClickAllMarkets();
		actual.onClickFavorites();
		actual.onClickPendingReports();

		assert.deepEqual(store.getActions(), expected, `Didn't dispatch the expected action objects from onclick events`);
	});
});
