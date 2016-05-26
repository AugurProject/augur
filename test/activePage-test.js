import {assert} from 'chai';

const selectorsLocation =
process.env.selectors ? process.env.selectors : '../src/selectors';
const selectors = require(selectorsLocation);

describe(`selector.activePage tests:`, () => {
	if (selectors.activePage) {
		// activePage: String,
		it(`should contain a activePage string`, () => {
			let actual = selectors.activePage;
			assert.isDefined(actual, `activePage isn't defined`);
			assert.isString(actual, `activePage isn't a string`);
		});
	} else {
		console.log(`
- selectors.activePage isn't defined.
	- skipping activePage tests.`);
	}
});
