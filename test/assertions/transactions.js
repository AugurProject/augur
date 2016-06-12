var assert = require('chai').assert;
// transactions: Array[ transaction ],
function transactionAssertion(actual) {
	assert.isDefined(actual.id, `transactions[0].id isn't defined`);
	assert.isString(actual.id, `transactions[0].id isn't a string`);
	assert.isDefined(actual.type, `transactions[0].type isn't defined`);
	assert.isString(actual.type, `transactions[0].type isn't a string`);
	assert.isDefined(actual.status, `transactions[0].status isn't defined`);
	assert.isString(actual.status, `transcations[0].status isn't a string`);
	assert.isDefined(actual.message, `transactions[0].message isn't defined`);
	assert.isString(actual.message, `transactions[0].message isn't a string`);
}

function transactionsAssertion(actual) {
	assert.isDefined(actual, `transactions isn't defined`);
	assert.isArray(actual, `transactions isn't an array`);
	if (actual[0] !== undefined) {
		assert.isDefined(actual[0], `transactions[0] isn't defined`);
		assert.isObject(actual[0], `transactions[0] isn't an object`);
		transactionAssertion(actual[0]);
	}
}
module.exports = transactionsAssertion;
