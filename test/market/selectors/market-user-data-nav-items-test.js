import { assert } from 'chai';

import assertions from 'augur-ui-react-components/lib/assertions';

import { MARKET_USER_DATA_NAV_POSITIONS, MARKET_USER_DATA_NAV_OPEN_ORDERS } from '../../../src/modules/app/constants/views';

import selector from '../../../src/modules/market/selectors/market-user-data-nav-items';

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
		assertions.marketUserDataNavItems(actual);
	});
});
