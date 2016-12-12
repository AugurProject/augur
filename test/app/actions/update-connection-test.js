import { describe, it } from 'mocha';
import { assert } from 'chai';
import * as action from 'modules/app/actions/update-connection';

describe('modules/app/actions/update-connection.js', () => {
	it(`should return a update connection action object`, () => {
		const test = action.updateConnectionStatus('test');
		const out = {
			type: 'UPDATE_CONNECTION_STATUS',
			isConnected: 'test'
		};
		assert.deepEqual(test, out, `Didn't produce the expected action object`);
	});
});
