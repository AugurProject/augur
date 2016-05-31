var assert = require('chai').assert;
// transactionsTotals: { title: String },
function transactionsTotalsAssertion(actual) {
	assert.isDefined(actual, `transactionsTotals isn't defined`);
	assert.isObject(actual, `transactionsTotals isn't an object as expected`);
	assert.isDefined(actual.title, `transactionsTotals.title isn't defined`);
	assert.isString(actual.title, `transactionsTotals.title isn't a string`);
}

module.exports = transactionsTotalsAssertion;
