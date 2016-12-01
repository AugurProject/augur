import { assert } from 'chai';
import proxyquire from 'proxyquire';
import assertions from 'augur-ui-react-components/lib/assertions';
import mocks from '../../mockStore';

describe('modules/market/selectors/market-data-age.js', () => {
	proxyquire.noPreserveCache().noCallThru();

	it('should meet AURC assertions', () => {
		const store = mocks.mockStore({
			requests: {},
			selectedMarketID: 'testmarketID',
			marketDataTimestamps: {
				testmarketID: 20
			},
			now: 30
		});

		const selectMarketDataAge = proxyquire('../../../src/modules/market/selectors/market-data-age.js', {
			'../../../store': store
		}).default;

		assertions.marketDataAge(selectMarketDataAge());
	});

	it('should return default object for empty values', () => {
		const getMarketDataAge = require('../../../src/modules/market/selectors/market-data-age.js').getMarketDataAge;
		const defaultValue = {
			lastUpdatedBefore: 'n/a',
			isMarketDataLoading: true
		};

		assert.deepEqual(getMarketDataAge(null, 9000, true, 10000), defaultValue);
		assert.deepEqual(getMarketDataAge('marketID', null, true, 10000), defaultValue);
		assert.deepEqual(getMarketDataAge('marketID', {'marketID': 1}, true, null), defaultValue);
	});

	it('should return correct object', () => {
		const getMarketDataAge = require('../../../src/modules/market/selectors/market-data-age.js').getMarketDataAge;
		const expected = {
			lastUpdatedBefore: 'less than a second ago',
			isMarketDataLoading: true
		};
		assert.deepEqual(getMarketDataAge('marketID', {'marketID': 9001}, true, 10000), expected);
	});
});
