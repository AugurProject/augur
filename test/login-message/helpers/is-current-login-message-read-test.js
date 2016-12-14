import { describe, it } from 'mocha';
import { assert } from 'chai';
import isCurrentLoginMessageRead from 'modules/login-message/helpers/is-current-login-message-read';

describe('modules/auth/helpers/is-user-logged-in.js', () => {
	it(`should return false if user hasn't read the message`, () => {
		assert.isFalse(isCurrentLoginMessageRead({}));
		assert.isFalse(isCurrentLoginMessageRead({
			userVersionRead: null
		}));
		assert.isFalse(isCurrentLoginMessageRead({
			version: 2,
			userVersionRead: 1
		}));
	});

	it('should return true if user has read the message', () => {
		assert.isTrue(isCurrentLoginMessageRead({
			version: 2,
			userVersionRead: 2
		}));
		assert.isTrue(isCurrentLoginMessageRead({
			version: 2,
			userVersionRead: 3
		}));
	});
});
