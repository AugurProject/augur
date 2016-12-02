import { describe, it } from 'mocha';
import { assert } from 'chai';
import testState from '../../testState';
import reducer from '../../../src/modules/auth/reducers/auth';
import { UPDATE_URL } from '../../../src/modules/link/actions/update-url';
import { AUTH_ERROR } from '../../../src/modules/auth/actions/auth-error';

describe(`modules/auth/reducers/auth.js`, () => {
	let action;
	const thisTestState = Object.assign({}, testState);
	it(`should change selected auth type`, () => {
		action = {
			type: UPDATE_URL,
			parsedURL: {
				searchParams: { page: 'login' }
			}
		};
		const expectedOutput = {
			err: null,
			selectedAuthType: 'login'
		};
		assert.deepEqual(reducer(thisTestState.auth, action), expectedOutput, 'didnt update the auth object');
	});

	it(`should throw an error on auth error`, () => {
		action = {
			type: AUTH_ERROR,
			err: 'this is a test error!'
		};
		const expectedOutput = {
			err: 'this is a test error!',
			selectedAuthType: 'register'
		};
		assert.deepEqual(reducer(thisTestState.auth, action), expectedOutput, `didn't update the error object as expected`);
	});
});
