import {assert} from 'chai';

const selectorsLocation =
process.env.selectors ? process.env.selectors : '../src/selectors';
const selectors = require(selectorsLocation);

describe(`selectors.marketsHeader tests:`, () => {
	if (selectors.marketsHeader) {
		// marketsHeader: {},
		it(`should contain a marketsHeader and is the expected shape`, () => {
			let actual = selectors.marketsHeader;
			assert.isDefined(actual, `marketsHeader isn't defined`);
			assert.isObject(actual, `marketsHeader isn't an object`);
		});
	} else {
		console.log(`
	***********************************************************************
	selectors.marketsHeader isn't defined. skipping marketsHeader tests.
	***********************************************************************
	`);
	}
});
