import { describe, it } from 'mocha';
import { assert } from 'chai';

describe('modules/bids-asks/helpers/is-order-of-user.js', () => {
	const isOrderOfUser = require('../../../src/modules/bids-asks/helpers/is-order-of-user').isOrderOfUser;

	describe('isOrderOfUser', () => {
		it('should return false if order is not of user', () => {
			assert.isFalse(isOrderOfUser({ owner: 'owner_address' }, null));
			assert.isFalse(isOrderOfUser({ owner: 'owner_address' }, 'some other address'));
		});

		it('should return correct ', () => {
			assert.isTrue(isOrderOfUser({ owner: 'owner_address' }, 'owner_address'));
		});
	});
});
