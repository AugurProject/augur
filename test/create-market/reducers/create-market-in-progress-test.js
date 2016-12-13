import { describe, it } from 'mocha';
import { assert } from 'chai';
import {
	UPDATE_MAKE_IN_PROGRESS,
	CLEAR_MAKE_IN_PROGRESS
} from 'modules/create-market/actions/update-make-in-progress';
import reducer from 'modules/create-market/reducers/create-market-in-progress';
import testState from 'test/testState';

describe(`modules/create-market/reducers/create-market-in-progress.js`, () => {
	let action;
	let expectedOutput;
	let test;
	const thisTestState = Object.assign({}, testState);

	it(`should be able to update a make in progress`, () => {
		action = {
			type: UPDATE_MAKE_IN_PROGRESS,
			data: {
				example: 'test'
			}
		};
		expectedOutput = {
			example: 'test'
		};
		test = reducer(thisTestState.createMarketInProgress, action);

		assert.deepEqual(test, expectedOutput, `Didn't update the make in progress state`);
	});

	it(`should be able to clear a make in progress`, () => {
		action = {
			type: CLEAR_MAKE_IN_PROGRESS
		};
		expectedOutput = {};
		test = reducer(thisTestState.createMarketInProgress, action);

		assert.deepEqual(test, expectedOutput, `Didn't clear a make in progress`);
	});
});
