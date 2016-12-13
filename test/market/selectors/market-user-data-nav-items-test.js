import { describe, it } from 'mocha';
import { assert } from 'chai';

import marketUserDataNavItemsAssertions from 'assertions/market-user-data-nav-items';

import { MARKET_USER_DATA_NAV_POSITIONS, MARKET_USER_DATA_NAV_OPEN_ORDERS } from 'modules/app/constants/views';

import selector from 'modules/market/selectors/market-user-data-nav-items';

describe('modules/market/selectors/market-user-data-nav-items.js', () => {
	const actual = selector();

	const expected = {
		[MARKET_USER_DATA_NAV_POSITIONS]: {
			label: 'Positions'
		},
		[MARKET_USER_DATA_NAV_OPEN_ORDERS]: {
			label: 'Orders'
		}
	};

	it('should return the expected object', () => {
		assert.deepEqual(actual, expected, `'marketUserDataNavItems' did not return the expected object`);
	});

	it('should delivery the correct object shape to the components', () => {
		marketUserDataNavItemsAssertions(actual);
	});
});
