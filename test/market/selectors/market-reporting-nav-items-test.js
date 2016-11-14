import { assert } from 'chai';

import assertions from 'augur-ui-react-components/lib/assertions';

import { MARKET_REPORTING_NAV_REPORT, MARKET_REPORTING_NAV_DETAILS } from '../../../src/modules/app/constants/views';

import selector from '../../../src/modules/market/selectors/market-reporting-nav-items';

describe('modules/market/selectors/market-reporting-nav-items.js', () => {
	const actual = selector();

	const expected = {
		[MARKET_REPORTING_NAV_REPORT]: {
			label: 'Report'
		},
		[MARKET_REPORTING_NAV_DETAILS]: {
			label: 'Details'
		}
	};

	it('should return the expected object', () => {
		assert.deepEqual(actual, expected, `'marketReportingNavItems' did not return the expected object`);
	});

	it('should delivery the correct object shape to the components', () => {
		assertions.marketReportingNavItems(actual);
	});
});
