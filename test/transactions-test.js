import {assert} from 'chai';

const selectorsLocation =
process.env.selectors ? process.env.selectors : '../src/selectors';
const selectors = require(selectorsLocation);

describe(`selectors.transactions tests:`, () => {
	if (selectors.transactions) {
		// transactions: Array,
		it(`should contain a transactions with the expected shape`, () => {
			let actual = selectors.transactions;
			assert.isDefined(actual, `transactions isn't defined`);
			assert.isArray(actual, `transactions isn't an array`);
		});
	} else {
		console.log(`
	***************************************************************************
	| - selectors.transactions isn't defined. skipping transactions tests.    |
	***************************************************************************
	`);
	}
});
