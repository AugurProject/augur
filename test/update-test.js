import {assert} from 'chai';

const selectorsLocation =
process.env.selectors ? process.env.selectors : '../src/selectors';
const selectors = require(selectorsLocation);

describe(`selectors.update tests:`, () => {
	if (selectors.update) {
		// update: function
		it(`should contain a update function`, () => {
			let actual = selectors.update;
			if (assert.isDefined(actual, `update isn't defined`)) {
				assert.isFunction(actual, `update isn't a function`);
			}
		});
	} else {
		console.log(`
	*******************************************************
	| - selectors.update isn't defined. skipping test.    |
	*******************************************************
	`);
	}
});
