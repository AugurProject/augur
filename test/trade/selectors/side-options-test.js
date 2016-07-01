import { assert } from 'chai';
import selectors from '../../../src/selectors'
import { BID, ASK } from '../../../src/modules/bids-asks/constants/bids-asks-types';

describe('modules/trade/selectors/side-options.js', () => {
	let actual = selectors.sideOptions,
		expected = [
			{ value: BID, label: 'Buy' },
			{ value: ASK, label: 'Sell' }
		];

	it("should return a properly structured array of options", () => {
		assert.deepEqual(actual, expected, 'sideOptions was not the correct shape');
	});
});