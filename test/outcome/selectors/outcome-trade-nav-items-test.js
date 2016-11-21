import { assert } from 'chai';

import assertions from 'augur-ui-react-components/lib/assertions';

import { BUY, SELL } from '../../../src/modules/trade/constants/types';

import selector from '../../../src/modules/outcome/selectors/outcome-trade-nav-items';

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

	it('should delivery the correct object shape to the components', () => {
		assertions.outcomeTradeNavItems(actual);
	});
});
