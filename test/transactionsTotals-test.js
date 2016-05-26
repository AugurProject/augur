import {assert} from 'chai';

const selectorsLocation =
process.env.selectors ? process.env.selectors : '../src/selectors';
const selectors = require(selectorsLocation);

describe(`selectors.transactionsTotals tests:`, () => {
	if (selectors.transactionsTotals) {
		// transactionsTotals: { title: String },
		it(`should contain a transactionsTotals object with the expected shape`, () => {
			let actual = selectors.transactionsTotals;
			assert.isDefined(actual, `transactionsTotals isn't defined`);
			assert.isObject(actual, `transactionsTotals isn't an object as expected`);
			assert.isDefined(actual.title, `transactionsTotals.title isn't defined`);
			assert.isString(actual.title, `transactionsTotals.title isn't a string`);
		});
	} else {
		console.log(`
	****************************************************************
	selectors.transactionsTotals isn't defined.
	skipping transactionsTotals tests.
	****************************************************************
	`);
	}
});
