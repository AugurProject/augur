import { describe, it } from 'mocha';
import { assert } from 'chai';

import marketDataNavItemsAssertions from 'assertions/market-data-nav-items';

import { MARKET_DATA_NAV_OUTCOMES, MARKET_DATA_ORDERS, MARKET_DATA_NAV_CHARTS, MARKET_DATA_NAV_DETAILS, MARKET_DATA_NAV_REPORT } from 'modules/app/constants/views';

import selector from 'modules/market/selectors/market-data-nav-items';

describe('modules/market/selectors/market-data-nav-items.js', () => {
	const actual = selector();

	const expected = {
		[MARKET_DATA_NAV_OUTCOMES]: {
			label: 'Outcomes'
		},
		[MARKET_DATA_ORDERS]: {
			label: 'Order Book',
			isMobile: true
		},
		[MARKET_DATA_NAV_CHARTS]: {
			label: 'Charts'
		},
		[MARKET_DATA_NAV_DETAILS]: {
			label: 'Details'
		},
		[MARKET_DATA_NAV_REPORT]: {
			label: 'Report',
			isPendingReport: true
		}
	};

	it('should return the expected object', () => {
		assert.deepEqual(actual, expected, `'marketDataNavItems' did not return the expected object`);
	});

	it('should delivery the correct object shape to the components', () => {
		marketDataNavItemsAssertions(actual);
	});
});
