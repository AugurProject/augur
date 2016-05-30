import {assert} from 'chai';

const selectorsLocation =
process.env.selectors ? process.env.selectors : '../src/selectors';
let selectors = require(selectorsLocation);
process.env.selectors ? selectors = selectors.default : selectors;

describe(`selectors.authForm tests:`, () => {
	if (selectors.authForm) {
		// authForm: Object,
		it(`should contain a authForm with the expected shape`, () => {
			let actual = selectors.authForm;
			assert.isDefined(actual, `authForm isn't defined`);
			assert.isObject(actual, `authForm isn't an object`);
		});
	} else {
		console.log(`
- selectors.authForm isn't defined.
	- skipping authForm tests.`);
	}
});
