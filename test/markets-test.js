import {assert} from 'chai';

const selectorsLocation =
process.env.selectors ? process.env.selectors : '../src/selectors';
const selectors = require(selectorsLocation);

describe(`selectors.markets tests:`, () => {
	if (selectors.markets) {
		// markets: [ Object, Object, ... ]
		it(`should contain a markets array`, () => {
			let actual = selectors.markets;

			assert.isDefined(actual, `markets is not defined`);
			assert.isArray(actual, `markets isn't an array`);
		});
	} else {
		console.log(`
- selectors.markets isn't defined.
	- skipping markets test.`);
	}
});
