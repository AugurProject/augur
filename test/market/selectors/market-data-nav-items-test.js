import { assert } from 'chai';

import assertions from 'augur-ui-react-components/lib/assertions';

import { MARKET_DATA_NAV_OUTCOMES, MARKET_DATA_ORDERS, MARKET_DATA_NAV_CHARTS, MARKET_DATA_NAV_DETAILS } from '../../../src/modules/app/constants/views';

import selector from '../../../src/modules/market/selectors/market-data-nav-items';

describe('modules/market/selectors/market-data-nav-items.js', () => {
	const actual = selector();

	const expected = {
		[MARKET_DATA_NAV_OUTCOMES]: {
			label: 'Outcomes'
		},
		[MARKET_DATA_ORDERS]: {
			label: 'Orders',
			mobileOnly: true
		},
		[MARKET_DATA_NAV_CHARTS]: {
			label: 'Charts'
		},
		[MARKET_DATA_NAV_DETAILS]: {
			label: 'Details'
		}
	};

	it('should return the expected object', () => {
		assert.deepEqual(actual, expected, `'marketDataNavItems' did not return the expected object`);
	});

	it('should delivery the correct object shape to the components', () => {
		assertions.marketDataNavItems(actual);
	});
});
