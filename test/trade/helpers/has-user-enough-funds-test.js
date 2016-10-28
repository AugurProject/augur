/*
 * Author: priecint
 */
import { assert } from 'chai';
import { formatEther } from '../../../src/utils/format-number'

describe('modules/trade/helpers/has-user-enough-funds.js', () => {
	const hasUserEnoughFunds = require('../../../src/modules/trade/helpers/has-user-enough-funds').default;

	it(`should return false if user doesn't have enough money or is not logged in`, () => {
		assert.isFalse(hasUserEnoughFunds([], { id: null, ether: undefined }));
		assert.isFalse(hasUserEnoughFunds([], { id: 'address', ether: undefined }));
		assert.isFalse(hasUserEnoughFunds([{ totalCost: formatEther(11) }], { id: 'address', ether: 10 }));
	});

	it('should return true if user has enough money', () => {
		assert.isTrue(hasUserEnoughFunds([{ totalCost: formatEther(10) }], { id: 'address', ether: 10 }));
		assert.isTrue(hasUserEnoughFunds([{ totalCost: formatEther(9) }], { id: 'address', ether: 10 }));
	});
});
