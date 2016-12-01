import { assert } from 'chai';
import loginMessageReducer from '../../../src/modules/login-message/reducers/login-message';
import { UPDATE_LOGIN_MESSAGE_VERSION_READ } from '../../../src/modules/login-message/actions/update-user-login-message-version-read';

describe('modules/login-message/reducers/login-message.js', () => {
	it('should react to default action', () => {
		const newState = loginMessageReducer(undefined, {
			type: '@@INIT'
		});

		assert.deepEqual(newState, { version: 1 });
	});

	it('should react to UPDATE_LOGIN_MESSAGE_VERSION_READ action', () => {
		const currentState = { version: 1 };

		const newState = loginMessageReducer(currentState, {
			type: UPDATE_LOGIN_MESSAGE_VERSION_READ,
			loginMessageVersion: 1
		});

		assert.deepEqual(newState, { version: 1, userVersionRead: 1 });
		assert.notStrictEqual(currentState, newState);
	});
});
