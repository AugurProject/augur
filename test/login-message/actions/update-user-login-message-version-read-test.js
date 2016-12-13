import { describe, it } from 'mocha';
import { assert } from 'chai';
import mocks from 'test/mockStore';
import { UPDATE_LOGIN_MESSAGE_VERSION_READ } from 'modules/login-message/actions/update-user-login-message-version-read';

describe('modules/login-message/actions/update-user-login-message-version-read.js', () => {
	const { store } = mocks;

	it('should dispatch UPDATE_LOGIN_MESSAGE_VERSION_READ action', () => {
		const updateUserLoginMessageVersionRead = require('../../../src/modules/login-message/actions/update-user-login-message-version-read').default;
		const expected = [{
			type: UPDATE_LOGIN_MESSAGE_VERSION_READ,
			loginMessageVersion: 2
		}];

		store.dispatch(updateUserLoginMessageVersionRead(2));

		assert.deepEqual(store.getActions(), expected, `Didn't properly dispatch UPDATE_LOGIN_MESSAGE_VERSION_READ action`);
	});
});
