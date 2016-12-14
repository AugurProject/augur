import { describe, it } from 'mocha';
import { assert } from 'chai';
import * as action from 'modules/auth/actions/auth-error';

describe(`modules/auth/actions/auth-error.js`, () => {
	it(`should return a AUTH_ERROR action with err provided`, () => {
		const errMsg = 'ERROR: testing';
		const expectedOutput = {
			type: action.AUTH_ERROR,
			err: errMsg
		};
		assert.deepEqual(action.authError(errMsg), expectedOutput, `didn't throw the correct error`);
	});
});
