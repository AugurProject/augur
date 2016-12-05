import { describe, it } from 'mocha';
import { assert } from 'chai';
import isUserLoggedIn from '../../../src/modules/auth/helpers/is-user-logged-in';

describe('modules/auth/helpers/is-user-logged-in.js', () => {
	it('should return false for anonymous user', () => {
		assert.isFalse(isUserLoggedIn({}));
		assert.isFalse(isUserLoggedIn({ address: null }));
	});

	it('should return true for logged-in user', () => {
		assert.isTrue(isUserLoggedIn({ address: 'duffmanohyea' }));
	});
});
