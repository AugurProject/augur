import { describe, it } from 'mocha';
import { assert } from 'chai';
import * as action from 'modules/create-market/actions/update-make-in-progress';

describe(`modules/create-market/actions/update-make-in-progress.js`, () => {
	it(`should fire UPDATE_MAKE_IN_PROGRESS with data`, () => {
		const data = {
			dummy: 'data'
		};
		const expectedOutput = {
			type: action.UPDATE_MAKE_IN_PROGRESS,
			data
		};
		assert.deepEqual(action.updateMakeInProgress(data), expectedOutput, `Didn't fire the correct type or return data`);
	});

	it(`should fire CLEAR_MAKE_IN_PROGRESS`, () => {
		const expectedOutput = {
			type: action.CLEAR_MAKE_IN_PROGRESS
		};
		assert.deepEqual(action.clearMakeInProgress(), expectedOutput, `Didn't fire the correct type`);
	});
});
