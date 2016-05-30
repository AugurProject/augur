import {assert} from 'chai';

const selectorsLocation =
process.env.selectors ? process.env.selectors : '../src/selectors';
let selectors = require(selectorsLocation);
process.env.selectors ? selectors = selectors.default : selectors;

describe(`selectors.onChangeSort`, () => {
	if (selectors.onChangeSort) {
	  // onChangeSort: [Function],
		it(`should contain a onChangeSort function`, () => {
			let actual = selectors.onChangeSort;
			assert.isDefined(actual, `onChangeSort isn't defined`);
			assert.isFunction(actual, `onChangeSort isn't a function`);
		});
	} else {
		console.log(`
- selectors.onChangeSort isn't defined.
	- skipping onChangeSort tests.`);
	}
});
