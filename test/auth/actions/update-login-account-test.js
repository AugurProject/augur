import { describe, it } from 'mocha';
import { assert } from 'chai';
import * as action from 'modules/auth/actions/update-login-account';

describe(`modules/auth/actions/update-login-account.js`, () => {
	it(`should fire a UPDATE_LOGIN_ACCOUNT action type with data`, () => {
		const data = {
			hello: 'world'
		};
		const expectedOutput = {
			type: action.UPDATE_LOGIN_ACCOUNT,
			data
		};
		assert.deepEqual(action.updateLoginAccount(data), expectedOutput, `The action fired with the wrong result!`);
	});

	it(`should fire a CLEAR_LOGIN_ACCOUNT action type`, () => {
		const expectedOutput = {
			type: action.CLEAR_LOGIN_ACCOUNT
		};
		assert.deepEqual(action.clearLoginAccount(), expectedOutput, `The action didn't fire the CLEAR_LOGIN_ACCOUNT type!`);
	});
});
