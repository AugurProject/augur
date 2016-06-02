var assert = require('chai').assert;
// transactions: Array,
function transactionsAssertion(actual) {
	assert.isDefined(actual, `transactions isn't defined`);
	assert.isArray(actual, `transactions isn't an array`);
}
module.exports = transactionsAssertion;
