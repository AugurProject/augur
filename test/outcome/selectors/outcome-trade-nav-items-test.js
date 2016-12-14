import { describe, it } from 'mocha';
import { assert } from 'chai';

import outcomeTradeNavItemsAssertions from 'assertions/outcome-trade-nav-items';

import { BUY, SELL } from 'modules/trade/constants/types';

import selector from 'modules/outcomes/selectors/outcome-trade-nav-items';

describe('modules/outcome/selectors/outcome-trade-nav-items.js', () => {
	const actual = selector();

	const expected = {
		[BUY]: {
			label: BUY
		},
		[SELL]: {
			label: SELL
		}
	};

	it('should return the expected object', () => {
		assert.deepEqual(actual, expected, `'outcomeTradeNavItems' did not return the expected object`);
	});

	it('should deliver the correct shape to the view components', () => {
		outcomeTradeNavItemsAssertions(actual);
	});
});
