var assert = require('chai').assert;
// marketsHeader: {},
function marketsHeaderAssertion(actual) {
	assert.isDefined(actual, `marketsHeader isn't defined`);
	assert.isObject(actual, `marketsHeader isn't an object`);
}
module.exports = marketsHeaderAssertion;
