var assert = require('chai').assert;
// isTransactionsWorking: Boolean,
function isTransactionWorkingAssertion(actual) {
	assert.isDefined(actual, `isTransactionsWorking isn't defined`);
	assert.isBoolean(actual, `isTransactionsWorking isn't a boolean`);
}
module.exports = isTransactionWorkingAssertion;
